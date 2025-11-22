import React from "react";
import { View, TextInput, Text, TextInputProps } from "react-native";
import * as Icons from "lucide-react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Icons;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  ...props
}) => {
  const IconComponent = icon
    ? (Icons[icon] as React.FC<{ size?: number; color?: string }>)
    : null;

  return (
    <View className={`mb-2 ${className}`}>
      {label && <Text className="text-black dark:text-white mb-1">{label}</Text>}

      <View className="flex-row items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900">
        {IconComponent && (
          <View className="mr-2">
            <IconComponent size={20} color="#888" />
          </View>
        )}

        <TextInput
          className="flex-1 text-black dark:text-white p-0"
          placeholderTextColor="#888"
          {...props}
        />
      </View>

      {error ? <Text className="text-red-500 mt-1 text-sm">{error}</Text> : null}
    </View>
  );
};
