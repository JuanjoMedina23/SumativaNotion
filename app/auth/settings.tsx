import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { themes, ThemeName } from "../../styles/themes";

// Configuración de botones de tema
const themeOptions: { key: ThemeName; label: string }[] = [
  { key: "light", label: "Claro" },
  { key: "dark", label: "Oscuro" },
  { key: "christmas", label: "Navidad" },
  { key: "halloween", label: "Halloween" },
];

export default function Settings() {
  const { theme, themeName, changeTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Configuración</Text>
      </View>

      {/* Card de opciones */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Seleccionar Tema</Text>

        {/* Botones de tema */}
        <View style={styles.themeButtons}>
          {themeOptions.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[
                styles.themeButton,
                { borderColor: themeName === t.key ? theme.primary : "#ccc" },
              ]}
              onPress={() => changeTheme(t.key)}
            >
              {/* Mini preview de color */}
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: themes[t.key].primary },
                ]}
              />
              <Text
                style={{
                  color: themeName === t.key ? theme.primary : theme.text,
                  fontWeight: themeName === t.key ? "700" : "500",
                }}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Otras opciones */}
        <TouchableOpacity style={styles.option}>
          <Text style={{ color: theme.text }}>Sincronización</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={{ color: theme.text }}>Acerca de la App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 10 },
  headerText: { fontSize: 24, fontWeight: "bold" },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  themeButtons: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  option: { paddingVertical: 12 },
});
