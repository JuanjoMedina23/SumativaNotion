import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  completed: boolean;
};

export type NotesContextType = {
  notes: Note[];
  createNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  toggleComplete: (id: string) => void;
  getFilteredNotes: (filter: "all" | "pending" | "completed") => Note[];
};

const NoteContext = createContext<NotesContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const STORAGE_KEY = "NOTES_DATA";

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setNotes(JSON.parse(raw));
        }
      } catch (e) {
        console.log("Error loading notes:", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.log("Error saving notes:", e);
      }
    })();
  }, [notes]);

  const createNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const getNote = (id: string) => {
    return notes.find((n) => n.id === id);
  };

  const toggleComplete = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
    );
  };

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