import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useNotes } from "../contexts/NoteContext";
import NoteCard from "../components/NoteCard";
import { FilePlus2, Notebook, CheckCircle2, Clock, ListTodo } from "lucide-react-native";
import { useState } from "react";

export default function Home() {
  const { getFilteredNotes } = useNotes();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const notes = getFilteredNotes(filter);

  const filterConfig = [
    { id: "all", label: "Todas", icon: ListTodo },
    { id: "pending", label: "Pendientes", icon: Clock },
    { id: "completed", label: "Completadas", icon: CheckCircle2 },
  ] as const;

  return (
    <View className="flex-1 bg-neutral-100 pt-14 px-5">

      {/* Header */}
      <View className="mb-6">
        <Text className="text-4xl font-extrabold text-neutral-800">
          Mis Notas
        </Text>
        <Text className="text-neutral-500 mt-1">
          Organiza tus ideas xd
        </Text>
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {filterConfig.map(({ id, label, icon: Icon }) => (
          <TouchableOpacity
            key={id}
            onPress={() => setFilter(id)}
            className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
              filter === id ? "bg-black" : "bg-neutral-200"
            }`}
          >
            <Icon 
              size={16} 
              color={filter === id ? "white" : "#737373"} 
              style={{ marginRight: 6 }}
            />
            <Text
              className={`font-semibold ${
                filter === id ? "text-white" : "text-neutral-700"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {notes.length === 0 ? (
          <View className="items-center mt-20 opacity-70">
            <Notebook size={70} color="#737373" />

            <Text className="text-xl font-semibold text-neutral-700 mt-4">
              No hay notas
            </Text>

            <Text className="text-neutral-500 mt-1 text-center">
              {filter === "pending" && "Todas tus notas están completadas 🎉"}
              {filter === "completed" && "No tienes notas completadas aún"}
              {filter === "all" && "Crea tu primera nota con el botón de abajo"}
            </Text>
          </View>
        ) : (
          notes.map((n) => <NoteCard key={n.id} note={n} />)
        )}
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity
        onPress={() => router.push("/create")}
        className="
          bg-black w-16 h-16 rounded-full 
          absolute bottom-8 right-8 
          items-center justify-center shadow-xl
        "
      >
        <FilePlus2 size={30} color="white" />
      </TouchableOpacity>

    </View>
  );
}