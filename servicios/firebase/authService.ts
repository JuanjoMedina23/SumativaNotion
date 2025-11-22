import { app } from "../../servicios/firebase/firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile, // ← 🔧 FIX IMPORTACIÓN
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = getAuth(app);

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export const authService = {
  // ✅ LOGIN CON EMAIL Y PASSWORD
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Error al iniciar sesión");
    }
  },

  // ✅ LOGIN CON GOOGLE
  loginWithGoogle: async (request: any, promptAsync: any): Promise<User> => {
    try {
      const result = await promptAsync();

      if (result?.type !== "success") {
        throw new Error("Inicio de sesión con Google cancelado");
      }

      if (!result.authentication?.idToken) {
        throw new Error("No se obtuvo token de Google");
      }

      const credential = GoogleAuthProvider.credential(result.authentication.idToken);

      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Error al iniciar sesión con Google");
    }
  },

  // ✅ REGISTRO CON EMAIL Y PASSWORD
  register: async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (displayName) {
        await firebaseUpdateProfile(user, { displayName });
      }

      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: displayName || "",
        photoURL: "",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Error al registrar usuario");
    }
  },

  // ✅ LOGOUT
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
    } catch (error: any) {
      throw new Error(error.message || "Error al cerrar sesión");
    }
  },

  // ✅ ACTUALIZAR PERFIL (NOMBRE / FOTO)
  updateProfile: async (
    data: { displayName?: string; photoURL?: string }
  ): Promise<User> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no logueado");

      await firebaseUpdateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      const userData: User = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Error al actualizar perfil");
    }
  },

  // ✅ OBTENER USUARIO GUARDADO EN LOCAL
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const json = await AsyncStorage.getItem("user");
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  },

  // ✅ SABER SI HAY SESIÓN INICIADA
  isLoggedIn: async (): Promise<boolean> => {
    const user = await authService.getCurrentUser();
    return !!user?.uid;
  },
};

// 🔧 HOOK PARA USAR GOOGLE LOGIN EN COMPONENTES
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "1076516348586-pteir86rk8lf1m1kk8oih7pd6g13uife.apps.googleusercontent.com",
    iosClientId: "1076516348586-pteir86rk8lf1m1kk8oih7pd6g13uife.apps.googleusercontent.com",
    androidClientId: "1076516348586-pteir86rk8lf1m1kk8oih7pd6g13uife.apps.googleusercontent.com",
  });

  return { request, response, promptAsync };
};
