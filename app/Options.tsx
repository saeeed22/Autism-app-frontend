import { View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

export default function Options() {
  const router = useRouter();

  return (
    <GradientBackground>
      <ImageBackground
        source={require("../assets/images/backgroundImage.png")} 
        className="flex-1 w-full h-full absolute opacity-80"
        resizeMode="cover"
      />

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

            <Text className="text-white text-3xl font-bold text-center">
              We assist you in..
            </Text>
          </View>

          {/* Cards */}
          <View className="w-[80%] self-center space-y-4 mt-5">
            {/* <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/recIcon.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-bold text-xl">
                Capture your child's daily story.
              </Text>
            </View> */}

            <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-bold text-xl">
                Create a personalized insight report for your child
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-bold text-xl">
                Lorem ipsum dolor sit amet consectetur. Eget integer ut.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 items-center mb-5">
              <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-3">
                <Image source={require("../assets/images/Icon2.png")} className="w-6 h-6" />
              </View>
              <Text className="text-black text-center font-bold text-xl">
                Lorem ipsum dolor sit amet consectetur. Eget integer ut.
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8">
          <TouchableOpacity
            className="bg-blue-500 w-full py-4 rounded-lg items-center"
            onPress={() => router.push("/asisstOptions")} 
          >
            <Text className="text-white font-semibold text-xl">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}
