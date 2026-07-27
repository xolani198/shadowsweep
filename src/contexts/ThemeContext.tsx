// FILE: src/contexts/ThemeContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ss-theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * The class on <html> is the source of truth. It is applied before paint by the
 * bootstrap script in the root layout, so there is no flash of the wrong theme
 * and nothing needs to be written to storage during mount. Writing on mount is
 * what previously overwrote a saved preference with the default before it had
 * been read back.
 */
function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  // The server always renders the light default, so re-read once on the client
  // to pick up whatever the bootstrap script decided.
  useEffect(() => {
    setThemeState(currentTheme());
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The theme
      // still applies for this page view.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
