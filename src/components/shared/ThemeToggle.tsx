"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <Moon className="h-5 w-5 text-gray-700 dark:hidden" />

      <Sun className="hidden h-5 w-5 text-yellow-400 dark:block" />
    </button>
  );
};

export default ThemeToggle;