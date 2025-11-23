import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNotes } from "../../contexts/NoteContext";
import { ArrowLeft, Pencil, Trash2, Check, X } from "lucide-react-native";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNote, updateNote, deleteNote } = useNotes();
  const { theme } = useContext(ThemeContext);

  const note = getNote(id as string);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateNote(id as string, title, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(id as string);
    router.back();
  };

  if (!note) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>No encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>

      {/* Top Bar */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color={theme.text} />
        </TouchableOpacity>

        {!isEditing && (
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Pencil size={26} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={26} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <X size={28} color="#dc2626" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave}>
              <Check size={28} color={theme.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content */}
      {isEditing ? (
        <View style={{ flex: 1 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.text + "66",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 16,
              color: theme.text,
            }}
          />

          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            style={{
              borderWidth: 1,
              borderColor: theme.text + "33",
              padding: 12,
              borderRadius: 16,
              flex: 1,
              fontSize: 16,
              color: theme.text,
              textAlignVertical: "top",
              backgroundColor: theme.card,
            }}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12, color: theme.text }}>
            {note.title}
          </Text>

          <Text style={{ fontSize: 16, color: theme.text, lineHeight: 22 }}>
            {note.content}
          </Text>

          <Text style={{ fontSize: 12, color: theme.text + "99", marginTop: 20 }}>
            Creada: {new Date(note.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
