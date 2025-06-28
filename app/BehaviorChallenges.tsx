import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import ChallengeCard from "../components/ChallengeCard";

const CHALLENGES = [
  { id: "social", label: "Social Interaction", image: null },
  { id: "sleeping", label: "Sleeping", image: null },
  { id: "impulsivity", label: "Impulsivity", image: null },
  { id: "eating", label: "Eating", image: null },
  { id: "communication", label: "Communication", image: null },
  { id: "hyperactivity", label: "Hyperactivity", image: null },
  { id: "repetitive", label: "Repetitive", image: null },
  { id: "rigid", label: "Rigid", image: null },
];

export default function BehaviourChallenges() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selected) {
      router.push({
        pathname: "/LoginSignup",
        params: { challenge: selected },
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
        <View className="items-center relative mb-4">
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

        {/* Divider */}
        <View className="h-[1px] bg-white/50 my-3 mb-4" />

        {/* Challenge Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="flex-row flex-wrap justify-between">
            {CHALLENGES.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                label={challenge.label}
                image={challenge.image}
                selected={selected === challenge.id}
                onPress={() =>
                  setSelected(
                    selected === challenge.id ? null : challenge.id
                  )
                }
              />
            ))}
          </View>
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selected}
          className={`bg-blue-500 w-full py-4 rounded-lg items-center mt-4 ${
            !selected ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white font-semibold text-xl">Next</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}
