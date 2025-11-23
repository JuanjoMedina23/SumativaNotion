// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import "../global.css";
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
