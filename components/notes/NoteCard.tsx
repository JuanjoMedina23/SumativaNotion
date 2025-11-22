// components/NoteCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  note: {
    id: string;
    title: string;
    content: string;
    createdAt?: any;
  };
  onPress: () => void;
  onDelete?: () => void;
}

const NoteCard: React.FC<Props> = ({ note, onPress, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || "Sin título"}
        </Text>

        {onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="#ff3b30" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content} numberOfLines={2}>
        {note.content}
      </Text>

      {note.createdAt && (
        <Text style={styles.date}>
          {note.createdAt.toDate().toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  content: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
});

export default NoteCard;
