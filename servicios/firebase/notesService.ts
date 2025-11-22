// notesService.ts
import { app } from "./firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore(app);

export const notesService = {
  // ✅ Crear nota
  createNote: async (userId: string, data: { title: string; content: string }) => {
    try {
      await addDoc(collection(db, "users", userId, "notes"), {
        title: data.title,
        content: data.content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al crear la nota:", error);
      throw error;
    }
  },

  // ✅ Editar nota
  updateNote: async (
    userId: string,
    noteId: string,
    data: { title?: string; content?: string }
  ) => {
    try {
      const noteRef = doc(db, "users", userId, "notes", noteId);
      await updateDoc(noteRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      throw error;
    }
  },

  // ✅ Eliminar nota
  deleteNote: async (userId: string, noteId: string) => {
    try {
      const noteRef = doc(db, "users", userId, "notes", noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      throw error;
    }
  },

  // ✅ Obtener notas en tiempo real
  listenNotes: (
    userId: string,
    callback: (notes: any[]) => void
  ) => {
    try {
      const notesRef = collection(db, "users", userId, "notes");
      const q = query(notesRef, orderBy("createdAt", "desc"));

      return onSnapshot(q, (snapshot) => {
        const notes: any[] = [];
        snapshot.forEach((doc) => {
          notes.push({ id: doc.id, ...doc.data() });
        });
        callback(notes);
      });
    } catch (error) {
      console.error("Error escuchando notas:", error);
      throw error;
    }
  },

  // ✅ Obtener 1 nota por ID
  getNoteById: async (userId: string, noteId: string) => {
    try {
      const noteRef = doc(db, "users", userId, "notes", noteId);
      const snapshot = await getDoc(noteRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error("Error obteniendo la nota:", error);
      throw error;
    }
  },
};
