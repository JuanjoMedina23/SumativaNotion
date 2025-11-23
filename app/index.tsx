import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import "../global.css";
export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) router.replace("/notes");       
      else router.replace("/auth/login");       
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  return null;
}
