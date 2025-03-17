"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "light"
  | "dark"
  | "system"
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "pink";
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: {
    name: Theme;
    label: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
    };
  }[];
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themes: [
    {
      name: "light",
      label: "Light",
      colors: {
        primary: "#0f172a",
        secondary: "#1e293b",
        accent: "#3b82f6",
        background: "#ffffff",
        foreground: "#0f172a",
      },
    },
    {
      name: "dark",
      label: "Dark",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#3b82f6",
        background: "#0f172a",
        foreground: "#f8fafc",
      },
    },
    {
      name: "system",
      label: "System",
      colors: {
        primary: "",
        secondary: "",
        accent: "",
        background: "",
        foreground: "",
      },
    },
    {
      name: "purple",
      label: "Purple",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#8b5cf6",
        background: "#581c87",
        foreground: "#f8fafc",
      },
    },
    {
      name: "blue",
      label: "Blue",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#3b82f6",
        background: "#1e3a8a",
        foreground: "#f8fafc",
      },
    },
    {
      name: "green",
      label: "Green",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#10b981",
        background: "#064e3b",
        foreground: "#f8fafc",
      },
    },
    {
      name: "orange",
      label: "Orange",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#f97316",
        background: "#7c2d12",
        foreground: "#f8fafc",
      },
    },
    {
      name: "pink",
      label: "Pink",
      colors: {
        primary: "#f8fafc",
        secondary: "#e2e8f0",
        accent: "#ec4899",
        background: "#831843",
        foreground: "#f8fafc",
      },
    },
  ],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(
      "light",
      "dark",
      "purple",
      "blue",
      "green",
      "orange",
      "pink"
    );

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    themes: initialState.themes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
