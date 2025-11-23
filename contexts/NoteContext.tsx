import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type NotesContextType = {
  notes: Note[];
  createNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // STORAGE KEY
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

  // CRUD
  const createNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, content } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  //getNote: devuelve la nota por id (o undefined si no existe)
  const getNote = (id: string) => {
    return notes.find((n) => n.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        updateNote,
        deleteNote,
        getNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within a NotesProvider");
  return context;
};