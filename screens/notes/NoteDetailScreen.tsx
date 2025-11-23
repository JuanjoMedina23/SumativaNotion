// NoteDetailScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSearchParams } from "expo-router";
import { notesService } from "../../servicios/firebase/notesService";
import { useAuth } from "../../contexts/AuthContext";

const NoteDetailScreen = () => {
  const { noteId } = useSearchParams();
  const { user } = useAuth();
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    if (!noteId || !user) return;

    const fetchNote = async () => {
      const fetchedNote = await notesService.getNoteById(user.uid, noteId);
      setNote(fetchedNote);
    };
    fetchNote();
  }, [noteId, user]);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Cargando nota...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>
    </View>
  );
};

export default NoteDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  content: { fontSize: 16, marginTop: 10 },
});
