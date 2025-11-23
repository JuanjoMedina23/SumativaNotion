import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function NoteCard({ note }: { note: any }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/details/${note.id}`)}
      className="bg-white p-4 rounded-xl mb-3 shadow"
    >
      <Text className="text-lg font-bold">{note.title}</Text>
      <Text className="text-gray-500 mt-1 text-sm">
        {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
      </Text>
    </TouchableOpacity>
  );
}
