import { Stack } from "expo-router";
import TabsNavigator from "../components/TabsNavigator";
import { NoteProvider } from "../contexts/NoteContext";
import { View } from "react-native";
import "../global.css"
export default function RootLayout() {
  return (
    <NoteProvider>
      <View className="flex-1">
        {/* Contenido de las pantallas */}
        <Stack screenOptions={{ headerShown: false }} />

        {/* Tabs SIEMPRE visibles */}
        <TabsNavigator />
      </View>
    </NoteProvider>
  );
}
