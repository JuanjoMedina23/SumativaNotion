import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function Settings() {
  return (
    <View className="flex-1 bg-gray-100 p-5">

      {/* Header */}
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Configuración</Text>
      </View>

      {/* Opciones */}
      <View className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
        <TouchableOpacity className="py-2">
          <Text className="text-lg">Cambiar Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-2">
          <Text className="text-lg">Sincronización</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-2">
          <Text className="text-lg">Acerca de la App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
