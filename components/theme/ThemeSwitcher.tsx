import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeName } from "../../styles/ themes"; 

const ThemeSwitcher: React.FC = () => {
  const { themeName, switchTheme, theme } = useTheme();

  const availableThemes: ThemeName[] = ["light", "dark", "christmas", "halloween"];

  return (
    <View className="p-4">
      <Text
        className="text-lg font-bold mb-3"
        style={{ color: theme.colors.text }}
      >
        Seleccionar tema
      </Text>

      {availableThemes.map((t) => (
        <Pressable
          key={t}
          onPress={() => switchTheme(t)}
          className="p-3 rounded-lg mb-2 border"
          style={{
            backgroundColor: t === themeName ? theme.colors.primary : theme.colors.card,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={{ color: theme.colors.text }}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {themeName === t ? "✓" : ""}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ThemeSwitcher;
