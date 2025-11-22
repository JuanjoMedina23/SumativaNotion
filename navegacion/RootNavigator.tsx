import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

// Pantallas
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/auth/ LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import NoteDetailScreen from "../screens/notes/NoteDetailScreen";
import CreateNoteScreen from "../screens/notes/CreateNoteScreen";

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // Si está cargando usuario, puedes poner un loader
  if (loading) return null;

  // 💡 Usamos DefaultTheme para NO romper TypeScript
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* 🔐 Si NO hay usuario → Login */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {/* 🧭 Tabs principales */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            {/* 📝 Ver nota */}
            <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />

            {/* ✏️ Crear nota */}
            <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
