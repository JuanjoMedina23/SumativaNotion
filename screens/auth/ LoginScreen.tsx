import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../utils/schemas";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export default function LoginScreen({ navigation }: any) {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Si ya está logueado, redirige automáticamente
  useEffect(() => {
    if (user) {
      navigation.replace("NotesList");
    }
  }, [user]);

  const handleLogin = async () => {
    setError("");

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      await login(email, password);
      navigation.replace("NotesList");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión.");
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
      />

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="mt-3"
      />

      {error ? (
        <Text className="text-red-500 text-center mt-2">{error}</Text>
      ) : null}

      <Button title="Entrar" onPress={handleLogin} className="mt-4" />

      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate("Register")}
      >
        <Text className="text-center text-blue-500">
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}
