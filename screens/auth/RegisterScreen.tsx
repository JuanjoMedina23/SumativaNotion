import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../utils/schemas";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export default function RegisterScreen({ navigation }: any) {
  const { register, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Si el usuario está logueado → evitar mostrar el registro
  useEffect(() => {
    if (user) {
      navigation.replace("NotesList");
    }
  }, [user]);

  const handleRegister = async () => {
    setError("");

    const validation = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const messages = validation.error.issues.map(issue => issue.message).join(", ");
      setError(messages);
      return;
    }

    try {
      await register(email, password);
      navigation.replace("NotesList");
    } catch (e: any) {
      setError(e.message || "Error al registrarse.");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <Text className="text-3xl font-bold text-center mb-6 text-black dark:text-white">
        Crear Cuenta
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

      <Input
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="mt-3"
      />

      {error ? (
        <Text className="text-red-500 text-center mt-2">{error}</Text>
      ) : null}

      <Button title="Registrarse" onPress={handleRegister} className="mt-4" />

      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-center text-blue-500">
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
