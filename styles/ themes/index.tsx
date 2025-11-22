import { christmasTheme } from "./ christmasTheme";
import { darkTheme } from "./ darkTheme";
import { halloweenTheme } from "./ halloweenTheme";
import { lightTheme } from "./lightTheme";

export { lightTheme } from "./lightTheme";
export { darkTheme } from "./ darkTheme";
export { christmasTheme } from "./ christmasTheme";
export { halloweenTheme } from "./ halloweenTheme";

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  christmas: christmasTheme,
  halloween: halloweenTheme,
};

export type ThemeName = keyof typeof themes;