import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../servicios/firebase/firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  userId: string;
}

const NotesListScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const notesRef = collection(db, "notes");
    const q = query(notesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userNotes: Note[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          userNotes.push({ id: doc.id, ...data } as Note);
        }
      });
      setNotes(userNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando notas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
        onPress={() => router.push("/CreateNote")}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          + Crear Nota
        </Text>
      </TouchableOpacity>

      {notes.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16 }}>
          No tienes notas todavía 📝
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: "#f2f2f2",
                marginBottom: 12,
                borderRadius: 8,
              }}
              onPress={() => router.push(`/NoteDetail/${item.id}`)}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
              <Text numberOfLines={2} style={{ marginTop: 5 }}>
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default NotesListScreen;
