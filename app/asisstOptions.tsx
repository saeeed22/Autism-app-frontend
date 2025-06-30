import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

const OPTIONS = [
  {
    id: "check",
    label: "I want to check for Autism",
    image: require("../assets/images/checkAutism.png"),
  },
  {
    id: "support",
    label: "I have Autism and need support",
    image: require("../assets/images/needSupport.png"),
  },
];

export default function AssistOptions() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      router.push({
        pathname: "/loading2",
        params: { option: selectedOption },
      });
    }
  };

  return (
    <GradientBackground>
      {/* Background Image */}
      <ImageBackground
        source={require("../assets/images/backgroundImage.png")}
        resizeMode="cover"
        className="absolute w-full h-full opacity-80"
      />

      {/* White gradient overlay */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.85)']}
        style={styles.whiteGradient}
      />

      <View className="flex-1 justify-between px-4 pt-20 pb-6">
        {/* Top Content Grouping */}
        <View>
          {/* Header */}
          <View>
            <View className="items-center justify-center relative mb-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-0 w-12 h-12 justify-center items-center z-10"
              >
                <Image
                  source={require("../assets/images/backIcon.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-white text-4xl font-normal text-center px-16">
                {"How can we assist you today?"}
              </Text>
            </View>
            <View className="h-[1px] bg-white/50 my-3" />
            <Text className="text-white text-center text-xl">
              Please select an option to proceed.
            </Text>
          </View>

          {/* Options rendered using .map() */}
          <View className="space-y-6 self-center w-[77%] mt-12">
            {OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedOption(option.id)}
                className={`bg-white rounded-3xl p-5 items-center border-2 ${
                  selectedOption === option.id
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  source={option.image}
                  className="w-full h-32 mb-4"
                  resizeMode="contain"
                />
                <View className="flex-row items-center">
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 justify-center items-center ${
                      selectedOption === option.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedOption === option.id && (
                      <View className="w-2 h-2 rounded-full bg-white"/>
                    )}
                  </View>
                  <Text className="text-black text-lg font-semibold text-center">
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Button */}
        <View className="items-center">
            <TouchableOpacity
              onPress={handleNext}
              disabled={!selectedOption}
              className={`w-[80%] rounded-full overflow-hidden ${!selectedOption ? "opacity-50" : ""}`}
            >
              <LinearGradient
                colors={["#1072E5", "#64ABFF"]}
                style={styles.buttonGradient}
              >
                <Text className="text-white font-semibold text-xl text-center">Next</Text>
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
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});