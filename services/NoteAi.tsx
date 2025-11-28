import React, { useState, useRef, useEffect, useContext } from "react";
import {View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator,} from "react-native";
import { GoogleGenAI } from "@google/genai";
import { Bot, Camera, Send, X } from "lucide-react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import CameraNote from "../components/CameraNote";
import { useRouter } from "expo-router";

export default function NoteAi() {
  const [isOpen, setIsOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages]);

  const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  });

  /** ------------------ENVIAR MENSAJE DE TEXTO---------------------*/
  async function handleSend() {
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: value }]);

    const prompt = value;
    setValue("");
    setLoading(true);

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const aiText =
        res.text || "No pude generar respuesta, intenta de nuevo.";

      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err: any) {
      setMessages((p) => [
        ...p,
        { sender: "ai", text: "Error: " + err.message },
      ]);
    }

    setLoading(false);
  }

  /** ------------------------
   * FOTO TOMADA → ANALIZAR
   --------------------------*/
  async function handlePicture(base64Image: string) {
    setOpenCamera(false);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: " Enviando foto para análisis..." },
    ]);

    setLoading(true);

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Eres un sistema q analiza tareas, ademas puedes ver una imagen si el usuario lo pide :Puedes recommendar como dividir la foto q te manda en tareas mas optimizadas  (Ejemplo: si la cama está desordenada → puedes recomendar que podrías tender la cama)"
                  +"Dame el texto generado por ti en un mejor formato sin asteriscos"
                  +"Pon titulo de acuerdo a lo analizado :)",
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      });

      const aiText = res.text || "No pude interpretar la imagen.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);

      // Extraer titulo y contenido
      const tituloMatch = aiText.match(/TITULO:\s*(.+)/i);
      const contenidoMatch = aiText.match(/CONTENIDO:\s*([\s\S]+)/i);

      const titulo = tituloMatch ? tituloMatch[1].trim() : "Análisis de imagen";
      const contenido = contenidoMatch ? contenidoMatch[1].trim() : aiText;

      // Enviar datos a la pantalla /create
      router.push(
        `/create?title=${encodeURIComponent(titulo)}&content=${encodeURIComponent(
          contenido
        )}`
      );
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error analizando imagen: " + err.message },
      ]);
    }

    setLoading(false);
  }

  if (openCamera)
    return (
      <CameraNote
        onPictureTaken={handlePicture}
        onClose={() => setOpenCamera(false)}
      />
    );

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="absolute bottom-28 right-8 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: theme.primary }}
      >
        <Bot size={32} color={theme.card} />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={isOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/40">
          <View
            className="mt-auto h-[75%] rounded-t-3xl p-5"
            style={{ backgroundColor: theme.card }}
          >
            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-3">
              <Text
                style={{ fontSize: 20, fontWeight: "600", color: theme.text }}
              >
                Asistente IA
              </Text>

              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={26} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {/* BOTÓN ABRIR CÁMARA */}
            <TouchableOpacity
              onPress={() => setOpenCamera(true)}
              className="mb-3 p-3 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Camera size={22} color={theme.card} />
              <Text className="text-white ml-2">Tomar foto</Text>
            </TouchableOpacity>

            {/* CHAT */}
            <ScrollView ref={scrollRef} className="flex-1 mb-2">
              {messages.map((msg, i) => (
                <View
                  key={i}
                  className={`p-3 rounded-xl mb-2 max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-purple-600 self-end"
                      : "bg-neutral-200 self-start"
                  }`}
                >
                  <Text
                    className={
                      msg.sender === "user" ? "text-white" : "text-black"
                    }
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}

              {loading && (
                <ActivityIndicator className="mt-3" size="small" color="#7c3aed" />
              )}
            </ScrollView>

            {/* INPUT */}
            <View className="flex-row items-center space-x-3">
              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-3 rounded-xl bg-neutral-100"
              />

              <TouchableOpacity
                onPress={handleSend}
                className="px-4 py-3 rounded-xl"
                style={{ backgroundColor: theme.primary }}
              >
                <Send size={20} color={theme.card} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}