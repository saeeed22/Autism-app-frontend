import { View, Image, ImageBackground, Text, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";

export default function Loader2() {
  const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Navigate to next screen after loading
//       // router.push("/next-screen");
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, []);

  return (
    <GradientBackground>
      <ImageBackground
        source={require("../assets/images/backgroundImage.png")} 
        className="flex-1 w-full h-full absolute opacity-80"
        resizeMode="cover"
      />

      <View className="flex-1 justify-between">
        <View className="flex-1 justify-center items-center">
          
          <Image
            source={require("../assets/images/loader2.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>
      </View>
    </GradientBackground>
  );
}