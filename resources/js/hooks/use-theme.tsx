import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "system";
        const stored = localStorage.getItem("theme") as Theme | null;
        return stored || "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "light";
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored === "dark") return "dark";
        if (stored === "light") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            setResolvedTheme(systemTheme);
        } else {
            root.classList.add(theme);
            setResolvedTheme(theme);
        }
    }, [theme]);

    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            const newTheme = e.matches ? "dark" : "light";
            root.classList.add(newTheme);
            setResolvedTheme(newTheme);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const setThemeValue = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return {
        theme,
        setTheme: setThemeValue,
        resolvedTheme,
    };
}
