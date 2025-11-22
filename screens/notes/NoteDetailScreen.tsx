import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const NoteDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { note } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>

      <Text style={styles.date}>
        {new Date(note.createdAt?.toDate()).toLocaleString()}
      </Text>

      <Text style={styles.content}>{note.content}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("EditNote", { note })}
      >
        <Text style={styles.btnText}>Editar Nota</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoteDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  content: { fontSize: 16, marginTop: 20 },
  date: { color: "#888", fontSize: 12 },
  btn: {
    backgroundColor: "#4a90e2",
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
