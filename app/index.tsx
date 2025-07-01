import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Only navigate after the router is ready
    if (!router) return;

    const checkLoginStatus = async () => {
      const isLoggedIn = false; // Replace with your auth logic

      if (isLoggedIn) {
        router.replace("/tabs");
      } else {
        router.replace("/Login");
      }
    };

    // Use a timeout to ensure the layout is mounted
    const timeout = setTimeout(checkLoginStatus, 0);

    return () => clearTimeout(timeout);
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
