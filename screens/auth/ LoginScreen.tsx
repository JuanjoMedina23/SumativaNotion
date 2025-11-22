import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { authService, useGoogleAuth } from "../../servicios/firebase/authService";
import { loginSchema } from "../../utils/schemas";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export default function LoginScreen({ navigation }: any) {
  const { login, user } = useAuth();
  const { request, promptAsync } = useGoogleAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya está logueado, redirige automáticamente
  useEffect(() => {
    if (user) {
      navigation.replace("NotesList");
    }
  }, [user]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Error de validación");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigation.replace("NotesList");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await promptAsync();
      // El login se procesa automáticamente en tu contexto
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <Text className="text-3xl font-bold text-center mb-6 text-black dark:text-white">
        Iniciar Sesión
      </Text>

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="mt-3"
        editable={!loading}
      />

      {error ? (
        <Text className="text-red-500 text-center mt-2">{error}</Text>
      ) : null}

      <Button
        title={loading ? "Cargando..." : "Entrar"}
        onPress={handleLogin}
        className="mt-4"
        disabled={loading}
      />

      {/* SEPARADOR */}
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-500">O</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* BOTÓN GMAIL */}
      <TouchableOpacity
        className="bg-white border border-gray-300 rounded-lg py-3 px-4 flex-row justify-center items-center"
        onPress={handleGoogleLogin}
        disabled={loading || !request}
      >
        <Text className="text-center text-gray-700 font-semibold">
          {loading ? "Autenticando..." : "Continuar con Google"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 20 }}
        />
      )}

      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate("Register")}
        disabled={loading}
      >
        <Text className="text-center text-blue-500">
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}