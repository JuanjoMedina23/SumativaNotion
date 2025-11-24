import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useNotes } from "../contexts/NoteContext";
import NoteCard from "../components/NoteCard";
import { FilePlus2, Notebook, CheckCircle2, Clock, ListTodo } from "lucide-react-native";
import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";


export default function Home() {
  const { getFilteredNotes } = useNotes();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const { theme } = useContext(ThemeContext);

  const notes = getFilteredNotes(filter);

  const filterConfig = [
    { id: "all", label: "Todas", icon: ListTodo },
    { id: "pending", label: "Pendientes", icon: Clock },
    { id: "completed", label: "Completadas", icon: CheckCircle2 },
  ] as const;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 14, paddingHorizontal: 20 }}>

      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: theme.text }}>
          MIS NOTAS XD
        </Text>
        <Text style={{ color: theme.text + "99", marginTop: 4 }}>
          Organiza tus ideas xd
        </Text>
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        {filterConfig.map(({ id, label, icon: Icon }) => {
          const isActive = filter === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => setFilter(id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                marginRight: 8,
                backgroundColor: isActive ? theme.primary : theme.card,
              }}
            >
              <Icon 
                size={16} 
                color={isActive ? theme.card : theme.text + "99"} 
                style={{ marginRight: 6 }}
              />
              <Text style={{ 
                fontWeight: "600", 
                color: isActive ? theme.card : theme.text + "99" 
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {notes.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 80, opacity: 0.7 }}>
            <Notebook size={70} color={theme.text + "99"} />

            <Text style={{ fontSize: 20, fontWeight: "600", color: theme.text, marginTop: 16 }}>
              No hay notas
            </Text>

            <Text style={{ color: theme.text + "99", marginTop: 4, textAlign: "center" }}>
              {filter === "pending" && "Todas tus notas están completadas "}
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
        style={{
          backgroundColor: theme.primary,
          width: 64,
          height: 64,
          borderRadius: 32,
          position: "absolute",
          bottom: 32,
          right: 32,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <FilePlus2 size={30} color={theme.card} />
      </TouchableOpacity>

    </View>
  );
}
