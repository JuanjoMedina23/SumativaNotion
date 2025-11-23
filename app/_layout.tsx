import { Stack } from "expo-router";
import TabsNavigator from "../components/TabsNavigator";
import { NotesProvider } from "../contexts/NoteContext";
import { View } from "react-native";
import "../global.css"
export default function RootLayout() {
  return (
    <NotesProvider>
      <View className="flex-1">
        {/* Contenido de las pantallas */}
        <Stack screenOptions={{ headerShown: false }} />

        {/* Tabs SIEMPRE visibles */}
        <TabsNavigator />
      </View>
    </NotesProvider>
  );
}
