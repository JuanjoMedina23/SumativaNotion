import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useNotes } from "../contexts/NoteContext";
import { X, Check } from "lucide-react-native";

export default function CreateNote() {
  const { createNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <View className="flex-1 p-5 bg-gray-100">

      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-5">
        {/* Cancel */}
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color="#dc2626" />
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          onPress={() => {
            createNote(title, content);
            router.replace("/");
          }}
        >
          <Check size={28} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold mb-5">Nueva Nota</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        className="bg-white p-3 rounded-lg mb-3"
      />

      <TextInput
        placeholder="Contenido"
        value={content}
        onChangeText={setContent}
        multiline
        className="bg-white p-3 rounded-lg h-72 text-top"
      />
    </View>
  );
}
