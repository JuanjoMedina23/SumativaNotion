import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  completed: boolean;
};

export type NotesContextType = {
  notes: Note[];
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  toggleComplete: (id: string) => Promise<void>;
  getFilteredNotes: (filter: "all" | "pending" | "completed") => Note[];
};

const NoteContext = createContext<NotesContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const STORAGE_KEY = "NOTES_DATA";

  // Cargar notas al iniciar
  useEffect(() => {
    loadNotes();
  }, []);

  // Guardar en AsyncStorage cuando cambien las notas
  useEffect(() => {
    if (notes.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const loadNotes = async () => {
    try {
      // 1. Cargar desde AsyncStorage primero (para mostrar algo rápido)
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setNotes(JSON.parse(raw));
      }

      // 2. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();

      // 3. Cargar desde Supabase
      let query = supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      // Si hay usuario, filtrar por user_id
      if (user) {
        query = query.eq("user_id", user.id);
      } else {
        // Si no hay usuario, solo notas sin user_id
        query = query.is("user_id", null);
      }

      const { data, error } = await query;

      if (!error && data) {
        const normalized = data.map((n: any) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          createdAt: n.created_at,
          completed: n.completed ?? false,
        }));

        setNotes(normalized);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    } catch (e) {
      console.log("Error loading notes:", e);
    }
  };

  // CREAR NOTA
  const createNote = async (title: string, content: string) => {
    
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        completed: false,
      };

      // Actualizar estado local inmediatamente
      setNotes((prev) => [newNote, ...prev]);

      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();

      // Insertar en Supabase
      const { error } = await supabase.from("notes").insert({
        id: newNote.id,
        title: newNote.title,
        content: newNote.content,
        created_at: newNote.createdAt,
        completed: newNote.completed,
        user_id: user?.id || null, // null si no hay usuario
      });

      if (error) {
        console.log("Error creating note in Supabase:", error);
        // Opcional: revertir el cambio local si falla
      }
    } catch (e) {
      console.log("Error creating note:", e);
    }
  };

  // ACTUALIZAR NOTA
  const updateNote = async (id: string, title: string, content: string) => {
    try {
      // Actualizar estado local
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, content } : n))
      );

      // Actualizar en Supabase
      const { error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", id);

      if (error) {
        console.log("Error updating note in Supabase:", error);
      }
    } catch (e) {
      console.log("Error updating note:", e);
    }
  };

  // ELIMINAR NOTA
  const deleteNote = async (id: string) => {
    try {
      // Eliminar del estado local
      setNotes((prev) => prev.filter((n) => n.id !== id));

      // Eliminar de Supabase
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) {
        console.log("Error deleting note in Supabase:", error);
      }
    } catch (e) {
      console.log("Error deleting note:", e);
    }
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (id: string) => {
    try {
      const note = notes.find((n) => n.id === id);
      if (!note) return;

      // Actualizar estado local
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
      );

      // Actualizar en Supabase
      const { error } = await supabase
        .from("notes")
        .update({ completed: !note.completed })
        .eq("id", id);

      if (error) {
        console.log("Error toggling note in Supabase:", error);
      }
    } catch (e) {
      console.log("Error toggling note:", e);
    }
  };

  const getNote = (id: string) => notes.find((n) => n.id === id);

  const getFilteredNotes = (filter: "all" | "pending" | "completed") => {
    switch (filter) {
      case "pending":
        return notes.filter((n) => !n.completed);
      case "completed":
        return notes.filter((n) => n.completed);
      default:
        return notes;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        createNote,
        updateNote,
        deleteNote,
        getNote,
        toggleComplete,
        getFilteredNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error("useNotes must be used within a NoteProvider");
  return context;
};