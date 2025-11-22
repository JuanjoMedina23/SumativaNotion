import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeSwitcher from "../../components/theme/ThemeSwitcher";
import { useAuth } from "../../contexts/AuthContext";

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="p-5"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text
        className="text-2xl font-bold mb-5"
        style={{ color: theme.colors.text }}
      >
        Configuración
      </Text>

      {/* Theme Switcher */}
      <View className="mb-8">
        <ThemeSwitcher />
      </View>

      {/* Logout */}
      <Pressable
        onPress={logout}
        className="py-4 rounded-lg items-center"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text className="font-bold" style={{ color: theme.colors.text }}>
          Cerrar sesión
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default SettingsScreen;
