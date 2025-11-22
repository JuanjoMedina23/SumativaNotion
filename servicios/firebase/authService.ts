import axios from "axios";

const API_URL = "https://identitytoolkit.googleapis.com/v1"; // Firebase REST API
const API_KEY = "AIzaSyD4CSV2aZ-BnLA5C_Tn9wL3A4hvDUT1gT8"; // reemplaza con tu clave

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  idToken?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post(`${API_URL}/accounts:signInWithPassword?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      return {
        uid: res.data.localId,
        email: res.data.email,
        displayName: res.data.displayName || "",
        photoURL: res.data.photoUrl || "",
        idToken: res.data.idToken,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Error al iniciar sesión");
    }
  },

  register: async (email: string, password: string): Promise<User> => {
    try {
      const res = await axios.post(`${API_URL}/accounts:signUp?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      return {
        uid: res.data.localId,
        email: res.data.email,
        displayName: "",
        photoURL: "",
        idToken: res.data.idToken,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Error al registrar usuario");
    }
  },

  logout: async (): Promise<void> => {
    // Firebase no requiere logout para REST, solo elimina token local
    return Promise.resolve();
  },

  updateProfile: async (
    uid: string,
    data: { displayName?: string; photoURL?: string }
  ): Promise<User> => {
    try {
      const token = await getIdToken(); // función para recuperar idToken de AsyncStorage
      const res = await axios.post(
        `${API_URL}/accounts:update?key=${API_KEY}`,
        {
          idToken: token,
          displayName: data.displayName,
          photoUrl: data.photoURL,
          returnSecureToken: true,
        }
      );

      return {
        uid: res.data.localId,
        email: res.data.email,
        displayName: res.data.displayName || "",
        photoURL: res.data.photoUrl || "",
        idToken: res.data.idToken,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Error al actualizar perfil");
    }
  },
};

// Función auxiliar para obtener idToken de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getIdToken(): Promise<string> {
  const json = await AsyncStorage.getItem("user");
  if (!json) throw new Error("Usuario no logueado");
  const user = JSON.parse(json);
  if (!user.idToken) throw new Error("Token no encontrado");
  return user.idToken;
}
