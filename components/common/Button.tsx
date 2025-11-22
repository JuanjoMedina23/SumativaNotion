import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string; 
}

export const Button: React.FC<ButtonProps> = ({ title, className = "", ...props }) => {
  return (
    <TouchableOpacity
      className={`bg-blue-500 rounded-lg py-3 px-4 items-center justify-center ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className="text-white font-semibold text-base">{title}</Text>
    </TouchableOpacity>
  );
};
