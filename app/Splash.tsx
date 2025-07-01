import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
        router.replace("/");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <GradientBackground>
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require("../assets/images/child.png")}
          className="w-75"
          resizeMode="contain"
        />
        <Text className="text-white text-2xl font-bold mt-6">
          AUTISM SPECTRUM DISORDER
        </Text>
        <Text className="text-white text-center mt-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>
      </View>
    </GradientBackground>
  );
}
