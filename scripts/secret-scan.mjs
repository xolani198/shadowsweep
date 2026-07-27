#!/usr/bin/env node
// Dependency-free secret scanner. Runs as a pre-commit hook over staged files
// and can scan the whole tree with `--all`. Exits non-zero when a likely secret
// is found so the commit is blocked. High-precision patterns plus a guarded
// generic rule keep false positives low; add `secret-scan: ignore` on a line to
// suppress a confirmed false positive.

import { execSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";

const PATTERNS = [
  { name: "Stripe secret key", re: /\bsk_(?:live|test)_[0-9a-zA-Z]{20,}/ },
  { name: "Stripe restricted key", re: /\brk_(?:live|test)_[0-9a-zA-Z]{20,}/ },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Google API key", re: /\bAIza[0-9A-Za-z_\-]{35}\b/ },
  { name: "GitHub token", re: /\bgh[pousr]_[0-9A-Za-z]{36,}/ },
  { name: "Slack token", re: /\bxox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP |DSA )?PRIVATE KEY-----/ },
  {
    name: "Hardcoded secret assignment",
    re: /(?:secret|passwd|password|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["'][^"'\n]{12,}["']/i,
  },
];

// Lines containing any of these are treated as safe (placeholders, env reads,
// and the intentionally-public test fixture).
const ALLOW = [
  "secret-scan: ignore",
  "process.env",
  "not-for-production",
  "playwright-e2e-secret",
  "your-",
  "changeme",
  "example.com",
  "<value>",
  "placeholder",
];

const SKIP_SUFFIXES = [
  ".env.example",
  "scripts/secret-scan.mjs",
  "SECURITY.md",
  "package-lock.json",
];

const NUL = String.fromCharCode(0);

function gitLines(cmd) {
  return execSync(cmd, { encoding: "utf8" })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function targetFiles() {
  return process.argv.includes("--all")
    ? gitLines("git ls-files")
    : gitLines("git diff --cached --name-only --diff-filter=ACM");
}

function scanFile(path) {
  if (SKIP_SUFFIXES.some((s) => path.endsWith(s))) return [];
  if (!existsSync(path) || statSync(path).isDirectory()) return [];
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return [];
  }
  // Skip files that look binary (contain a NUL byte).
  if (text.indexOf(NUL) !== -1) return [];

  const findings = [];
  text.split("\n").forEach((line, i) => {
    if (ALLOW.some((a) => line.includes(a))) return;
    for (const p of PATTERNS) {
      if (p.re.test(line)) findings.push({ path, line: i + 1, name: p.name });
    }
  });
  return findings;
}

const files = targetFiles();
let findings = [];
for (const f of files) findings = findings.concat(scanFile(f));

if (findings.length > 0) {
  console.error("\nx Potential secrets detected. Commit blocked.\n");
  for (const f of findings) console.error(`  ${f.path}:${f.line}  ${f.name}`);
  console.error(
    "\nMove the value to an environment variable (see .env.example). If this is a" +
      "\nfalse positive, append `secret-scan: ignore` to the line.\n"
  );
  process.exit(1);
}

console.log(`secret-scan: clean (${files.length} file(s) scanned).`);
