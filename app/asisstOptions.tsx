

import { View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";

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
        pathname: "/BehaviorChallenges",
        params: { option: selectedOption },
      });
    }
  };

  return (
    <GradientBackground>
      <ImageBackground
        source={require("../assets/images/backgroundImage.png")}
        resizeMode="cover"
        className="absolute w-full h-full opacity-80"
      />

      <View className="flex-1 justify-between px-4 pt-20 pb-6">
        {/* Header */}
        <View className="items-center relative">
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
            Select your child’s{"\n"}behaviour challenges
          </Text>
        </View>
        <View className="h-[1px] bg-white/50 my-3" />
        <Text className="text-white text-center text-xl">
          Please select an option to proceed.
        </Text>
        

        {/* Options */}
        <View className="space-y-8 self-center">
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedOption(option.id)}
              className={`bg-white rounded-3xl px-6 py-5 items-center border-2 mb-3 ${
                selectedOption === option.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <Image
                source={option.image}
                className="w-full mb-3"
                resizeMode="contain"
              />
              <View className="flex-row items-center space-x-2">
                <View
                  className={`w-4 h-4 rounded-full border ${
                    selectedOption === option.id ? "bg-blue-500 border-blue-500" : "border-gray-400"
                  }`}
                />
                <Text className="text-black text-lg font-semibold text-center ml-1">
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedOption}
          className={`bg-blue-500 w-full py-4 rounded-lg items-center mt-6 ${
            !selectedOption ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white font-semibold text-xl">Next</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}
