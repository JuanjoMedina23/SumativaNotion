import { Stack } from "expo-router";
import TabsNavigator from "../components/TabsNavigator";
import { NoteProvider } from "../contexts/NoteContext";
import { View } from "react-native";
import "../global.css";
import { ThemeProvider, ThemeContext } from "@/contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NoteProvider>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <View style={{ flex: 1, backgroundColor: theme.background }}>
              <Stack screenOptions={{ headerShown: false }} />
              <TabsNavigator />
            </View>
          )}
        </ThemeContext.Consumer>
      </NoteProvider>
    </ThemeProvider>
  );
}
