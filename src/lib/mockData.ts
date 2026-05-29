// FILE: src/lib/mockData.ts

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
  status: "active" | "offboarded" | "departing";
  joinDate: string;
  lastSeen: string;
  riskScore: number; // 0-100
  sanctionedApps: AppRecord[];
  shadowApps: AppRecord[];
}

export interface AppRecord {
  id: string;
  name: string;
  category: string;
  icon: string;
  monthlySpend: number;
  lastAccessed: string;
  dataAccess: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  authorized: boolean;
  discoveredVia: string;
}

export interface Alert {
  id: string;
  type: "new_app" | "departed_employee" | "spend_anomaly" | "data_access";
  title: string;
  description: string;
  employeeId?: string;
  employeeName?: string;
  appName?: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  read: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logoColor: string;
  connected: boolean;
  lastSync?: string;
  appsDiscovered?: number;
}

// ── Employees ──────────────────────────────────────────────────────────────

export const EMPLOYEES: Employee[] = [
  {
    id: "emp-001",
    name: "Marcus Chen",
    email: "m.chen@acmecorp.io",
    department: "Engineering",
    role: "Senior Software Engineer",
    avatar: "MC",
    status: "active",
    joinDate: "2021-03-15",
    lastSeen: "2024-06-10",
    riskScore: 78,
    sanctionedApps: [
      {
        id: "app-gh",
        name: "GitHub",
        category: "Development",
        icon: "🐙",
        monthlySpend: 0,
        lastAccessed: "2024-06-10",
        dataAccess: ["Code Repositories", "Pull Requests"],
        riskLevel: "low",
        authorized: true,
        discoveredVia: "Google Workspace SSO",
      },
      {
        id: "app-jira",
        name: "Jira",
        category: "Project Management",
        icon: "📋",
        monthlySpend: 0,
        lastAccessed: "2024-06-09",
        dataAccess: ["Issue Tracker", "Sprint Board"],
        riskLevel: "low",
        authorized: true,
        discoveredVia: "Google Workspace SSO",
      },
      {
        id: "app-slack",
        name: "Slack",
        category: "Communication",
        icon: "💬",
        monthlySpend: 0,
        lastAccessed: "2024-06-10",
        dataAccess: ["Messages", "Files", "Channels"],
        riskLevel: "low",
        authorized: true,
        discoveredVia: "Microsoft 365",
      },
    ],
    shadowApps: [
      {
        id: "shadow-fig",
        name: "Figma",
        category: "Design",
        icon: "🎨",
        monthlySpend: 45,
        lastAccessed: "2024-06-08",
        dataAccess: ["Design Files", "Team Projects"],
        riskLevel: "medium",
        authorized: false,
        discoveredVia: "Ramp Card Statement",
      },
      {
        id: "shadow-cf",
        name: "Cloudflare Workers",
        category: "Infrastructure",
        icon: "☁️",
        monthlySpend: 120,
        lastAccessed: "2024-06-07",
        dataAccess: ["Production Traffic", "DNS Records", "API Keys"],
        riskLevel: "critical",
        authorized: false,
        discoveredVia: "Brex Spend Analysis",
      },
      {
        id: "shadow-oa",
        name: "OpenAI API",
        category: "AI / ML",
        icon: "🤖",
        monthlySpend: 88,
        lastAccessed: "2024-06-10",
        dataAccess: ["Prompts", "Completions", "Fine-tune Data"],
        riskLevel: "high",
        authorized: false,
        discoveredVia: "Brex Spend Analysis",
      },
    ],
  },
  {
    id: "emp-002",
    name: "Priya Sharma",
    email: "p.sharma@acmecorp.io",
    department: "Marketing",
    role: "Growth Marketing Manager",
    avatar: "PS",
    status: "departing",
    joinDate: "2020-07-01",
    lastSeen: "2024-06-09",
    riskScore: 91,
    sanctionedApps: [
      {
        id: "app-hub",
        name: "HubSpot",
        category: "CRM",
        icon: "🔶",
        monthlySpend: 0,
        lastAccessed: "2024-06-09",
        dataAccess: ["Contacts", "Deals", "Email Sequences"],
        riskLevel: "medium",
        authorized: true,
        discoveredVia: "Google Workspace SSO",
      },
    ],
    shadowApps: [
      {
        id: "shadow-mo",
        name: "Mailchimp",
        category: "Email Marketing",
        icon: "📧",
        monthlySpend: 299,
        lastAccessed: "2024-06-05",
        dataAccess: ["Customer Email List", "Campaign Analytics"],
        riskLevel: "critical",
        authorized: false,
        discoveredVia: "Stripe Subscription",
      },
      {
        id: "shadow-sem",
        name: "SEMrush",
        category: "SEO Tools",
        icon: "📊",
        monthlySpend: 119,
        lastAccessed: "2024-06-08",
        dataAccess: ["Domain Analytics", "Keyword Data"],
        riskLevel: "medium",
        authorized: false,
        discoveredVia: "Ramp Card Statement",
      },
      {
        id: "shadow-can",
        name: "Canva Pro",
        category: "Design",
        icon: "🖼️",
        monthlySpend: 55,
        lastAccessed: "2024-06-01",
        dataAccess: ["Brand Assets", "Design Templates"],
        riskLevel: "low",
        authorized: false,
        discoveredVia: "Ramp Card Statement",
      },
    ],
  },
  {
    id: "emp-003",
    name: "Tobias Wolff",
    email: "t.wolff@acmecorp.io",
    department: "Finance",
    role: "Senior Financial Analyst",
    avatar: "TW",
    status: "active",
    joinDate: "2019-11-20",
    lastSeen: "2024-06-10",
    riskScore: 55,
    sanctionedApps: [
      {
        id: "app-qb",
        name: "QuickBooks",
        category: "Accounting",
        icon: "💰",
        monthlySpend: 0,
        lastAccessed: "2024-06-10",
        dataAccess: ["Financial Records", "Payroll", "Tax Data"],
        riskLevel: "high",
        authorized: true,
        discoveredVia: "Microsoft 365",
      },
    ],
    shadowApps: [
      {
        id: "shadow-gpt",
        name: "ChatGPT Plus",
        category: "AI / ML",
        icon: "🤖",
        monthlySpend: 20,
        lastAccessed: "2024-06-10",
        dataAccess: ["Potentially sensitive prompts"],
        riskLevel: "high",
        authorized: false,
        discoveredVia: "Brex Spend Analysis",
      },
      {
        id: "shadow-xero",
        name: "Xero",
        category: "Accounting",
        icon: "📒",
        monthlySpend: 62,
        lastAccessed: "2024-06-03",
        dataAccess: ["Bank Connections", "Invoice Data"],
        riskLevel: "critical",
        authorized: false,
        discoveredVia: "Stripe Subscription",
      },
    ],
  },
  {
    id: "emp-004",
    name: "Aisha Okonkwo",
    email: "a.okonkwo@acmecorp.io",
    department: "Sales",
    role: "Account Executive",
    avatar: "AO",
    status: "offboarded",
    joinDate: "2022-01-10",
    lastSeen: "2024-05-31",
    riskScore: 82,
    sanctionedApps: [
      {
        id: "app-sf",
        name: "Salesforce",
        category: "CRM",
        icon: "☁️",
        monthlySpend: 0,
        lastAccessed: "2024-05-31",
        dataAccess: ["Customer Data", "Opportunity Pipeline"],
        riskLevel: "high",
        authorized: true,
        discoveredVia: "Google Workspace SSO",
      },
    ],
    shadowApps: [
      {
        id: "shadow-lk",
        name: "LinkedIn Sales Navigator",
        category: "Sales Intelligence",
        icon: "💼",
        monthlySpend: 99,
        lastAccessed: "2024-05-29",
        dataAccess: ["Prospect Data", "InMail"],
        riskLevel: "medium",
        authorized: false,
        discoveredVia: "Ramp Card Statement",
      },
    ],
  },
  {
    id: "emp-005",
    name: "Devon Park",
    email: "d.park@acmecorp.io",
    department: "Product",
    role: "Product Manager",
    avatar: "DP",
    status: "active",
    joinDate: "2023-02-14",
    lastSeen: "2024-06-10",
    riskScore: 44,
    sanctionedApps: [
      {
        id: "app-no",
        name: "Notion",
        category: "Productivity",
        icon: "📝",
        monthlySpend: 0,
        lastAccessed: "2024-06-10",
        dataAccess: ["Documents", "Databases", "Roadmaps"],
        riskLevel: "low",
        authorized: true,
        discoveredVia: "Google Workspace SSO",
      },
    ],
    shadowApps: [
      {
        id: "shadow-mix",
        name: "Mixpanel",
        category: "Analytics",
        icon: "📈",
        monthlySpend: 0,
        lastAccessed: "2024-06-07",
        dataAccess: ["User Events", "Funnels", "Retention Data"],
        riskLevel: "high",
        authorized: false,
        discoveredVia: "Google Workspace OAuth",
      },
    ],
  },
];

// ── Alerts ─────────────────────────────────────────────────────────────────

export const ALERTS: Alert[] = [
  {
    id: "alert-001",
    type: "departed_employee",
    title: "Departing employee still has 3 live app subscriptions",
    description: "Priya Sharma's last day is June 14. Active paid subscriptions on Mailchimp, SEMrush, and Canva remain live.",
    employeeId: "emp-002",
    employeeName: "Priya Sharma",
    severity: "critical",
    timestamp: "2024-06-10T08:14:00Z",
    read: false,
  },
  {
    id: "alert-002",
    type: "data_access",
    title: "Unreviewed Cloudflare Workers access — production DNS",
    description: "Marcus Chen connected an unauthorized Cloudflare account with production DNS and API key write access.",
    employeeId: "emp-001",
    employeeName: "Marcus Chen",
    appName: "Cloudflare Workers",
    severity: "critical",
    timestamp: "2024-06-10T07:52:00Z",
    read: false,
  },
  {
    id: "alert-003",
    type: "spend_anomaly",
    title: "Shadow IT monthly spend increased 34% this month",
    description: "Unmanaged SaaS spend reached $907/mo across 11 apps — up from $677 last month.",
    severity: "warning",
    timestamp: "2024-06-09T18:00:00Z",
    read: false,
  },
  {
    id: "alert-004",
    type: "new_app",
    title: "New unauthorized app detected: Xero (Finance)",
    description: "Tobias Wolff registered a Xero account connected to a corporate bank account without IT approval.",
    employeeId: "emp-003",
    employeeName: "Tobias Wolff",
    appName: "Xero",
    severity: "critical",
    timestamp: "2024-06-09T14:22:00Z",
    read: true,
  },
  {
    id: "alert-005",
    type: "departed_employee",
    title: "Offboarded employee Aisha Okonkwo retains LinkedIn Sales Nav",
    description: "Account was not revoked during offboarding. Active paid seat still billable at $99/mo.",
    employeeId: "emp-004",
    employeeName: "Aisha Okonkwo",
    appName: "LinkedIn Sales Navigator",
    severity: "warning",
    timestamp: "2024-06-08T11:00:00Z",
    read: true,
  },
  {
    id: "alert-006",
    type: "new_app",
    title: "OpenAI API key created outside IT-approved account",
    description: "Marcus Chen created a personal OpenAI API key. Sensitive code completion prompts may be transmitted.",
    employeeId: "emp-001",
    employeeName: "Marcus Chen",
    appName: "OpenAI API",
    severity: "warning",
    timestamp: "2024-06-07T09:30:00Z",
    read: true,
  },
];

// ── Integrations ───────────────────────────────────────────────────────────

export const INTEGRATIONS: Integration[] = [
  {
    id: "int-gws",
    name: "Google Workspace",
    category: "Identity & SSO",
    description: "Scan OAuth tokens and third-party app grants across all Google accounts.",
    logoColor: "#4285F4",
    connected: true,
    lastSync: "2024-06-10T06:00:00Z",
    appsDiscovered: 34,
  },
  {
    id: "int-m365",
    name: "Microsoft 365",
    category: "Identity & SSO",
    description: "Enumerate Azure AD app registrations and conditional access policies.",
    logoColor: "#0078D4",
    connected: true,
    lastSync: "2024-06-10T06:00:00Z",
    appsDiscovered: 21,
  },
  {
    id: "int-ramp",
    name: "Ramp",
    category: "Spend Intelligence",
    description: "Parse corporate card transactions to identify SaaS subscriptions automatically.",
    logoColor: "#FF5C00",
    connected: true,
    lastSync: "2024-06-10T05:30:00Z",
    appsDiscovered: 18,
  },
  {
    id: "int-brex",
    name: "Brex",
    category: "Spend Intelligence",
    description: "Analyze Brex card spend for recurring SaaS charges and vendor categorization.",
    logoColor: "#6C5CE7",
    connected: false,
    appsDiscovered: 0,
  },
  {
    id: "int-stripe",
    name: "Stripe",
    category: "Billing Detection",
    description: "Identify employees who are paying for SaaS tools via corporate Stripe accounts.",
    logoColor: "#6772E5",
    connected: true,
    lastSync: "2024-06-09T22:00:00Z",
    appsDiscovered: 7,
  },
];

// ── Discovery Table Rows ───────────────────────────────────────────────────

export interface DiscoveryRow {
  id: string;
  employeeName: string;
  employeeEmail: string;
  employeeId: string;
  appName: string;
  category: string;
  monthlySpend: number;
  discoveredVia: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  lastAccessed: string;
  dataScopes: string[];
}

export const DISCOVERY_ROWS: DiscoveryRow[] = EMPLOYEES.flatMap((emp) =>
  emp.shadowApps.map((app) => ({
    id: `${emp.id}-${app.id}`,
    employeeName: emp.name,
    employeeEmail: emp.email,
    employeeId: emp.id,
    appName: app.name,
    category: app.category,
    monthlySpend: app.monthlySpend,
    discoveredVia: app.discoveredVia,
    riskLevel: app.riskLevel,
    lastAccessed: app.lastAccessed,
    dataScopes: app.dataAccess,
  }))
);

// ── Aggregate Metrics ──────────────────────────────────────────────────────

export const METRICS = {
  monitoredEmployees: EMPLOYEES.length,
  vulnerabilityScore: 74,
  wastedMonthlySpend: DISCOVERY_ROWS.reduce((sum, r) => sum + r.monthlySpend, 0),
  shadowAppsTotal: DISCOVERY_ROWS.length,
  criticalAlerts: ALERTS.filter((a) => a.severity === "critical" && !a.read).length,
};
