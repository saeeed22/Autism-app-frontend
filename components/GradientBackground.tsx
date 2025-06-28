// components/GradientBackground.tsx
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ViewStyle } from "react-native";

export default function GradientBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={["#3B82F6", "#60A5FA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
