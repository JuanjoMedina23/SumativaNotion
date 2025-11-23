// CreateNoteScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { notesService } from "../../servicios/firebase/notesService";
import { useAuth } from "../../contexts/AuthContext";

const CreateNoteScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("El título y contenido son obligatorios");
      return;
    }

    try {
      await notesService.createNote(user.uid, { title, content });
      router.back(); // vuelve a la lista
    } catch {
      setError("Error al crear nota");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} placeholder="Título de la nota" value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Contenido</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Escribe tu nota..."
        value={content}
        multiline
        onChangeText={setContent}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={createNote}>
        <Text style={styles.btnText}>Crear Nota</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNoteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  textArea: { height: 150, textAlignVertical: "top" },
  btn: { backgroundColor: "#4a90e2", padding: 15, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  error: { color: "red", marginBottom: 10 },
});
