import { View, Text, TouchableOpacity, Animated, PanResponder } from "react-native";
import { router } from "expo-router";
import { useNotes, Note } from "../contexts/NoteContext";
import { useRef } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react-native";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, toggleComplete } = useNotes();
  const pan = useRef(new Animated.ValueXY()).current;
  const checkScale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, { dx }) => {
        if (dx > 100) {
          // Swipe derecha → completar
          Animated.timing(pan, {
            toValue: { x: 300, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            toggleComplete(note.id);
            pan.setValue({ x: 0, y: 0 });
          });
        } else if (dx < -100) {
          // Swipe izquierda → eliminar
          Animated.timing(pan, {
            toValue: { x: -300, y: 0 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            deleteNote(note.id);
          });
        } else {
          // Volver a posición original
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleCheckPress = () => {
    Animated.sequence([
      Animated.timing(checkScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(checkScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    toggleComplete(note.id);
  };

  return (
    <View className="mb-3">
      {/* Background completar (derecha) */}
      <View className="absolute left-0 right-0 h-full bg-green-500 rounded-xl justify-center pl-4" pointerEvents="none">
        <CheckCircle2 size={24} color="white" />
      </View>

      {/* Background eliminar (izquierda) */}
      <View className="absolute left-0 right-0 h-full bg-red-500 rounded-xl justify-center pr-4 items-end" pointerEvents="none">
        <Trash2 size={24} color="white" />
      </View>

      {/* Card animada */}
      <Animated.View
        style={[
          {
            transform: [{ translateX: pan.x }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => router.push(`/details/${note.id}`)}
          className={`bg-white p-4 rounded-xl shadow ${
            note.completed ? "opacity-50" : "opacity-100"
          }`}
          activeOpacity={0.8}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text
                className={`text-lg font-bold ${
                  note.completed ? "line-through text-gray-400" : "text-black"
                }`}
              >
                {note.title}
              </Text>
              <Text className="text-gray-500 mt-1 text-sm">
                {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
              </Text>
            </View>

            {/* Checkbox animado */}
            <TouchableOpacity
              onPress={handleCheckPress}
              className="p-2"
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                {note.completed ? (
                  <CheckCircle2 size={28} color="#22c55e" />
                ) : (
                  <Circle size={28} color="#d1d5db" />
                )}
              </Animated.View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}