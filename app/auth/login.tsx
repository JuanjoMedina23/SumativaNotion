import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Borra cualquier sesión guardada localmente
  useEffect(() => {
    const clearSession = async () => {
      await AsyncStorage.clear();
      await supabase.auth.signOut(); // asegura limpiar Supabase también
      console.log("Sesión local borrada");
    };
    clearSession();
  }, []);

  // Redirige si ya hay usuario
  useEffect(() => {
    if (!loading && user) {
      router.replace("/"); // redirige solo si hay usuario confirmado
    }
  }, [loading, user]);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      await login(email, password); // login del AuthContext
      router.replace("/"); // redirige después de login exitoso
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
