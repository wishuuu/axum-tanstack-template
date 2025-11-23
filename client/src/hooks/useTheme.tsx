import { createContext, type ReactNode, useEffect, useState } from "react";

export const themes = {
  light: "light",
  dark: "dark",
  cupcake: "cupcake",
  emerald: "emerald",
  synthwave: "synthwave",
  halloween: "halloween",
  garden: "garden",
  forest: "forest",
  lofi: "lofi",
  fantasy: "fantasy",
  cmyk: "cmyk",
  autumn: "autumn",
  lemonade: "lemonade",
  night: "night",
  winter: "winter",
  dim: "dim",
  nord: "nord",
  sunset: "sunset",
};

export type themes = (typeof themes)[keyof typeof themes];

export const ThemeContext = createContext({
  theme: themes.sunset,
  setTheme: (theme: themes) => {
    localStorage.setItem("theme", theme);
  },
});
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || themes.sunset);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}> {children} </ThemeContext.Provider>;
};
