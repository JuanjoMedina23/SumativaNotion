import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/common/Button";
import {Input } from "../../components/common/Input";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/notes"); // solo redirige después de login
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-6">Iniciar Sesión</Text>

      <Input placeholder="Correo" value={email} onChangeText={setEmail} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry className="mt-3" />

      {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}

      <Button title={loading ? "Cargando..." : "Entrar"} onPress={handleLogin} className="mt-4" disabled={loading} />

      <TouchableOpacity onPress={() => router.push("/auth/register")} className="mt-4">
        <Text className="text-center text-blue-500">¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />}
    </View>
  );
}
