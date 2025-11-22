import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotesListScreen from "../screens/notes/ NotesListScreen";
import CreateNoteScreen from "../screens/notes/CreateNoteScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import { useTheme } from "../contexts/ThemeContext";

// Íconos de lucide-react-native
import { Home, PlusCircle, Settings } from "lucide-react-native";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      {/* 📝 LISTA DE NOTAS */}
      <Tab.Screen
        name="NotesList"
        component={NotesListScreen}
        options={{
          title: "Notas",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      {/* ➕ CREAR NOTA */}
      <Tab.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{
          title: "Nueva Nota",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size} />
          ),
        }}
      />

      {/* ⚙ CONFIGURACIÓN */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
