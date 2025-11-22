import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { profileUpdateSchema } from "../../utils/schemas";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setError("");
    const validation = profileUpdateSchema.safeParse({ displayName, photoURL });
    if (!validation.success) {
      const messages = validation.error.issues.map(issue => issue.message).join(", ");
      setError(messages);
      return;
    }

    try {
      await updateProfile({ displayName, photoURL });
      alert("Perfil actualizado");
    } catch (e: any) {
      setError(e.message || "Error al actualizar perfil");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
        Editar Perfil
      </Text>

      <Input placeholder="Nombre" value={displayName} onChangeText={setDisplayName} />
      <Input placeholder="URL de foto" value={photoURL} onChangeText={setPhotoURL} className="mt-3" />

      {error ? <Text className="text-red-500 mt-2 text-center">{error}</Text> : null}

      <Button title="Actualizar Perfil" onPress={handleUpdate} className="mt-4" />
    </View>
  );
}
