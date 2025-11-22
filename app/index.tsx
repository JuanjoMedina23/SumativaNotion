// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Si hay usuario → ir a notas
  // Si no → login
  return user ? <Redirect href="/notes" /> : <Redirect href="/auth/login" />;
}

