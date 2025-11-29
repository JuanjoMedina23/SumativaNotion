import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { useNotes } from "../contexts/NoteContext";
import { X, Check, Eye, Edit3 } from "lucide-react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import Markdown from "react-native-markdown-display";
import { z } from "zod";

export default function CreateNote() {
  const { createNote, notes } = useNotes();
  const { theme } = useContext(ThemeContext);

  // Recibir parámetros que vienen desde NoteAi
  const params = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);

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

  // Estilos para Markdown
  const markdownStyles = {
    body: {
      color: theme.text,
      fontSize: 14,
    },
    heading1: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "bold" as const,
      marginBottom: 12,
    },
    heading2: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold" as const,
      marginBottom: 10,
    },
    heading3: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "600" as const,
      marginBottom: 8,
    },
    strong: {
      color: theme.text,
      fontWeight: "bold" as const,
    },
    em: {
      color: theme.text,
      fontStyle: "italic" as const,
    },
    text: {
      color: theme.text,
    },
    bullet_list: {
      marginBottom: 8,
    },
    ordered_list: {
      marginBottom: 8,
    },
    list_item: {
      color: theme.text,
      marginBottom: 4,
    },
    code_inline: {
      backgroundColor: theme.background,
      color: theme.accent,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      fontFamily: "monospace" as const,
    },
    code_block: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: "monospace" as const,
    },
    fence: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: "monospace" as const,
    },
    blockquote: {
      backgroundColor: theme.background,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    link: {
      color: theme.accent,
      textDecorationLine: "underline" as const,
    },
    hr: {
      backgroundColor: theme.primary,
      height: 2,
      marginVertical: 12,
    },
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      {/* Top Bar */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        {/* Cancel */}
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color={theme.primary} />
        </TouchableOpacity>

        {/* Preview Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Edit3 size={18} color={!isPreview ? theme.primary : theme.text + "60"} />
          <Switch
            value={isPreview}
            onValueChange={setIsPreview}
            trackColor={{ false: theme.background, true: theme.primary }}
            thumbColor={theme.card}
          />
          <Eye size={18} color={isPreview ? theme.primary : theme.text + "60"} />
        </View>

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
        {isPreview ? "Vista Previa" : "Nueva Nota"}
      </Text>

      {/* Título */}
      <TextInput
        placeholder="Título"
        placeholderTextColor={theme.text + "99"}
        value={title}
        onChangeText={setTitle}
        editable={!isPreview}
        style={{
          backgroundColor: theme.card,
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
          color: theme.text,
          fontSize: isPreview ? 20 : 16,
          fontWeight: isPreview ? "bold" : "normal",
        }}
      />

      {/* Contenido - Editor o Preview */}
      {isPreview ? (
        <ScrollView
          style={{
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            flex: 1,
          }}
        >
          {content ? (
            <Markdown style={markdownStyles}>{content}</Markdown>
          ) : (
            <Text style={{ color: theme.text + "60", fontStyle: "italic" }}>
              Escribe algo para ver la vista previa...
            </Text>
          )}
        </ScrollView>
      ) : (
        <TextInput
          placeholder="Contenido (soporta Markdown)"
          placeholderTextColor={theme.text + "99"}
          value={content}
          onChangeText={setContent}
          multiline
          style={{
            backgroundColor: theme.card,
            padding: 12,
            borderRadius: 12,
            flex: 1,
            textAlignVertical: "top",
            color: theme.text,
          }}
        />
      )}
    </View>
  );
}