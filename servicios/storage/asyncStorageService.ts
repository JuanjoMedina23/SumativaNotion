// storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  THEME: 'theme',
  USER: 'user',
};

// Guardar un valor genérico
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error guardando en AsyncStorage:', e);
  }
};

// Leer un valor genérico
export const getItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error leyendo de AsyncStorage:', e);
    return null;
  }
};

// Eliminar un valor
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error eliminando de AsyncStorage:', e);
  }
};

// Temas disponibles
export type ThemeType = 'light' | 'dark' | 'navidad' | 'halloween';

// Guardar tema
export const setTheme = async (theme: ThemeType) => {
  await setItem(STORAGE_KEYS.THEME, theme);
};

// Obtener tema
export const getTheme = async (): Promise<ThemeType> => {
  const theme = await getItem(STORAGE_KEYS.THEME);
  if (theme === 'light' || theme === 'dark' || theme === 'navidad' || theme === 'halloween') {
    return theme;
  }
  return 'light'; // Tema por defecto
};
