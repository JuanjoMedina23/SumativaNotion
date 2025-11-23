import { View, Text, TouchableOpacity } from "react-native";
import { Link, usePathname } from "expo-router";
import type { Href } from "expo-router";
import { Home, FilePlus2, Settings } from "lucide-react-native";

export default function TabsNavigator() {
  const pathname = usePathname();

  const tabs: { name: string; href: Href; icon: any }[] = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Crear", href: "/create", icon: FilePlus2 },
    { name: "Ajustes", href: "/auth/settings", icon: Settings },
  ];

  return (
    <View className="flex-row justify-around bg-white border-t border-gray-300 px-4 py-3">
      {tabs.map(({ name, href, icon: Icon }) => {
        const active = pathname === href;

        return (
            <Link key={name} href={href} asChild>
            <TouchableOpacity className="items-center gap-1">
              <Icon size={26} color={active ? "black" : "#9ca3af"} />
              <Text className={active ? "text-black" : "text-gray-500"}>
                {name}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}
