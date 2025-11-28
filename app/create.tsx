import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { useNotes } from "../contexts/NoteContext";
import { X, Check } from "lucide-react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import { z } from "zod";

export default function CreateNote() {
  const { createNote, notes } = useNotes();
  const { theme } = useContext(ThemeContext);

  // Recibir parámetros que vienen desde NoteAi
  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Cuando vienen datos desde NoteAi -> rellenar los campos
  useEffect(() => {
    if (params.title) setTitle(String(params.title));
    if (params.content) setContent(String(params.content));
  }, [params]);

  const noteSchema = z.object({
    title: z
      .string()
      .min(1, "El título no puede estar vacío")
      .refine((t) => !notes.some((n) => n.title === t), {
        message: "Ya existe una nota con ese título",
      }),
    content: z.string().min(1, "El contenido no puede estar vacío"),
  });

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
            const validated = noteSchema.safeParse({ title, content });

            if (!validated.success) {
              alert(validated.error.issues[0].message);
              return;
            }

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
