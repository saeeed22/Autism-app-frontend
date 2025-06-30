import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

export default function Options() {
  const router = useRouter();

  return (
    <GradientBackground>
      {/* 1. Full-screen background image */}
      <ImageBackground
        source={require("../assets/images/backgroundImage.png")}
        className="flex-1 w-full h-full absolute opacity-80"
        resizeMode="cover"
      />

      {/* 2. White gradient overlay from the bottom */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.4)', 'white']}
        style={styles.whiteGradient}
      />

      {/* 3. Main content */}
      <View className="flex-1 justify-between pt-4">
        <View className="px-4 pt-16">
          <View className="flex-row items-center justify-center mb-8 relative">
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute left-0 w-12 h-12 justify-center items-center"
            >
              <Image
                source={require("../assets/images/backIcon.png")}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text className="text-white text-4xl font-normal text-center">
              We assist you in..
            </Text>
          </View>

          {/* Cards */}
          <View className="w-[80%] self-center space-y-4 mt-5">
            <View className="bg-white rounded-2xl p-4 items-center mb-6">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-semibold text-xl">
                Create a personalized insight report for your child
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-semibold text-xl">
                Lorem ipsum dolor sit amet consectetur. Eget integer ut.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-semibold text-xl">
                Lorem ipsum dolor sit amet consectetur. Eget integer ut.
              </Text>
            </View>
          </View>
        </View>

        
        <View className="px-6 mb-8 items-center">
          <TouchableOpacity
            className="w-[85%] rounded-full overflow-hidden" 
            onPress={() => router.push("/loading1")}
          >
            <LinearGradient
              colors={['#1072E5', '#64ABFF']}
              className="items-center"
            >
              {/* --- FIX IS APPLIED HERE by removing surrounding newlines --- */}
              <Text className="text-white font-semibold text-xl text-center py-4">Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  whiteGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
});