import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AccentColor = "violet" | "blue" | "emerald" | "amber" | "rose";

interface ThemeContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  accentColor: "violet",
  setAccentColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// HSL values for each accent color
const accentColors: Record<AccentColor, { primary: string; primaryLight: string }> = {
  violet: { primary: "263 70% 58%", primaryLight: "270 70% 65%" },
  blue: { primary: "217 91% 60%", primaryLight: "213 94% 68%" },
  emerald: { primary: "160 84% 39%", primaryLight: "158 64% 52%" },
  amber: { primary: "38 92% 50%", primaryLight: "43 96% 56%" },
  rose: { primary: "350 89% 60%", primaryLight: "347 77% 68%" },
};

// Generate gradient mesh CSS using HSL values
const generateGradientMesh = (primary: string, primaryLight: string): string => {
  return `radial-gradient(at 40% 20%, hsl(${primary} / 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(${primaryLight} / 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(${primary} / 0.08) 0px, transparent 50%)`;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("accent-color");
    return (saved as AccentColor) || "violet";
  });

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("accent-color", color);
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = accentColors[accentColor];
    
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-light", colors.primaryLight);
    root.style.setProperty("--primary-glow", colors.primary);
    root.style.setProperty("--accent", colors.primary);
    root.style.setProperty("--ring", colors.primary);
    root.style.setProperty("--border-focus", colors.primary);
    root.style.setProperty("--card-glow", colors.primary);
    root.style.setProperty("--sidebar-primary", colors.primary);
    root.style.setProperty("--sidebar-ring", colors.primary);
    
    // Update background mesh gradient
    const gradientMesh = generateGradientMesh(colors.primary, colors.primaryLight);
    root.style.setProperty("--gradient-mesh", gradientMesh);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
