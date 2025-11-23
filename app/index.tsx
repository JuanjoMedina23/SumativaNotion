import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useNotes } from "../contexts/NoteContext";
import NoteCard from "../components/NoteCard";
import { FilePlus2, Notebook } from "lucide-react-native";


export default function Home() {
  const { notes } = useNotes();

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
              No hay notas aún
            </Text>

            <Text className="text-neutral-500 mt-1 text-center">
              Crea tu primera nota con el botón de abajo
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
