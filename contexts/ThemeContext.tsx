import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  // Importación de temas
  import light from "../styles/ themes/lightTheme";
  import dark from "../styles/ themes/ darkTheme";
  import christmas from "../styles/ themes/ christmasTheme";
  import halloween from "../styles/ themes/ halloweenTheme";
  
  // --------------------------
  // TIPOS
  // --------------------------
  
  export type ThemeName = "light" | "dark" | "christmas" | "halloween";
  
  export interface Theme {
    colors: {
      background: string;
      text: string;
      primary: string;
      card: string;
    };
  }
  
  interface ThemeContextProps {
    theme: Theme;
    themeName: ThemeName;
    switchTheme: (theme: ThemeName) => void;
  }
  
  // ---------------------------
  // OBJETO THEMES
  // ---------------------------
  const themes: Record<ThemeName, Theme> = {
    light,
    dark,
    christmas,
    halloween,
  };
  
  // ---------------------------
  // CREACIÓN CONTEXTO
  // ---------------------------
  const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
  
  // Hook
  export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme debe estar dentro de ThemeProvider");
    return ctx;
  };
  
  // ---------------------------
  // PROVIDER
  // ---------------------------
  export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>("light");
    const [theme, setTheme] = useState<Theme>(themes.light);
  
    useEffect(() => {
      const loadTheme = async () => {
        try {
          const saved = await AsyncStorage.getItem("theme");
          if (saved && themes[saved as ThemeName]) {
            setThemeName(saved as ThemeName);
            setTheme(themes[saved as ThemeName]);
          }
        } catch (e) {
          console.log("Error cargando tema", e);
        }
      };
  
      loadTheme();
    }, []);
  
    const switchTheme = async (name: ThemeName) => {
      setThemeName(name);
      setTheme(themes[name]);
      await AsyncStorage.setItem("theme", name);
    };
  
    return (
      <ThemeContext.Provider value={{ theme, themeName, switchTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  