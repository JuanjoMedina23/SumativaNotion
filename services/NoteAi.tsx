import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { Bot, Send, X } from "lucide-react-native";
import { ThemeContext } from "../contexts/ThemeContext";
export default function NoteAi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [messages]);

  const APIKEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;


  const ai = new GoogleGenAI({ apiKey: APIKEY });

  async function handleSend() {
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: value }]);

    const prompt = value;
    setValue("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const aiText = response.text || "No se pudo generar una respuesta.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error con la IA: " + err.message },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="absolute bottom-28 right-8 w-16 h-16  rounded-full items-center justify-center shadow-lg "
        style={{
          backgroundColor: theme.primary,
        }}
      >
        <Bot size={32} color={theme.card}  />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={isOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/40">
          <View className="mt-auto h-[75%]  rounded-t-3xl p-5"
          style={{
            backgroundColor: theme.card,
          }}
          >

            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-3">
              <Text style={{ fontSize: 20, fontWeight: "600", color: theme.text }}>
              Asistente IA
              </Text>

              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={26} color={theme.primary}  />
              </TouchableOpacity>
            </View>

            {/* CHAT */}
            <ScrollView ref={scrollRef} className="flex-1 mb-2">
              {messages.map((msg, i) => (
                <View
                  key={i}
                  className={`
                    p-3 rounded-xl mb-2 max-w-[80%]
                    ${msg.sender === "user"
                      ? "bg-purple-600 self-end"
                      : "bg-neutral-200 self-start"
                    }
                  `}
                >
                  <Text
                    className={msg.sender === "user" ? "text-white" : "text-black"}
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
                className="
                  flex-1  px-4 py-3 rounded-xl
                "
                
              />

              <TouchableOpacity
                onPress={handleSend}
                className=" px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: theme.primary,
                }}
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
