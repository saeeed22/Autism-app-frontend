import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      router.replace("/tabs");
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

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
