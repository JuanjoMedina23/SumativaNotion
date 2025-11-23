import React, { useState } from "react";
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

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNote, updateNote, deleteNote } = useNotes();

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
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>No encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 p-4">

      {/* Top Bar */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#1f2937" />
        </TouchableOpacity>

        {!isEditing && (
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Pencil size={26} color="#1f2937" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={26} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <X size={28} color="#dc2626" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave}>
              <Check size={28} color="#16a34a" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content */}
      {isEditing ? (
        <View className="flex-1">
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="border-b border-gray-300 text-2xl font-bold mb-4"
          />

          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            className="border border-gray-200 p-3 flex-1 rounded-xl text-base"
          />
        </View>
      ) : (
        <View className="flex-1">
          <Text className="text-3xl font-bold mb-3">{note.title}</Text>

          <Text className="text-neutral-700 text-base whitespace-pre-line">
            {note.content}
          </Text>

          <Text className="text-sm text-gray-500 mt-5">
            Creada: {new Date(note.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
