import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../servicios/firebase/firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";

const NoteEditorScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const noteId = route.params?.noteId || null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);

  // Cargar nota si es edición
  useEffect(() => {
    if (!noteId) {
      setLoadingNote(false);
      return;
    }

    const loadNote = async () => {
      try {
        const ref = doc(db, "notes", noteId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title);
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error al cargar nota:", error);
      }

      setLoadingNote(false);
    };

    loadNote();
  }, [noteId]);

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título no puede estar vacío");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "La nota no puede estar vacía");
      return;
    }

    setLoading(true);

    try {
      if (noteId) {
        // EDITAR NOTA
        const ref = doc(db, "notes", noteId);
        await updateDoc(ref, {
          title,
          content,
        });
      } else {
        // CREAR NUEVA NOTA
        const newId = Date.now().toString(); // ID simple o puedes usar uuid
        const ref = doc(db, "notes", newId);

        await setDoc(ref, {
          id: newId,
          title,
          content,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error guardando nota:", error);
      Alert.alert("Error", "No se pudo guardar la nota.");
    }

    setLoading(false);
  };

  if (loadingNote) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando nota...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {noteId ? "Editar Nota" : "Nueva Nota"}
      </Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{
          marginTop: 20,
          padding: 12,
          fontSize: 16,
          backgroundColor: "#f2f2f2",
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="Escribe tu nota aquí..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        style={{
          marginTop: 15,
          padding: 12,
          height: 300,
          fontSize: 16,
          backgroundColor: "#f2f2f2",
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={saveNote}
        style={{
          marginTop: 20,
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {noteId ? "Guardar Cambios" : "Crear Nota"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NoteEditorScreen;
