import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importa todos los temas desde index.ts
import { themes, ThemeName } from "../styles/ themes";

// --------------------------
// TIPOS
// --------------------------
export interface Theme {
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    primary: string;
    card: string;
    border: string;
  };
}

interface ThemeContextProps {
  theme: Theme;
  themeName: ThemeName;
  switchTheme: (theme: ThemeName) => void;
}

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
