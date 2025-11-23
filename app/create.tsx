import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState, useContext } from "react";
import { useNotes } from "../contexts/NoteContext";
import { X, Check } from "lucide-react-native";
import { ThemeContext } from "../contexts/ThemeContext";

export default function CreateNote() {
  const { createNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { theme } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>

      {/* Top Bar */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        {/* Cancel */}
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color={theme.primary} />
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          onPress={() => {
            createNote(title, content);
            router.replace("/");
          }}
        >
          <Check size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: theme.text }}>
        Nueva Nota
      </Text>

      {/* Título */}
      <TextInput
        placeholder="Título"
        placeholderTextColor={theme.text + "99"}
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: theme.card,
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
          color: theme.text,
        }}
      />

      {/* Contenido */}
      <TextInput
        placeholder="Contenido"
        placeholderTextColor={theme.text + "99"}
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          backgroundColor: theme.card,
          padding: 12,
          borderRadius: 12,
          height: 280,
          textAlignVertical: "top",
          color: theme.text,
        }}
      />
    </View>
  );
}
