import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import ChallengeCard from "../components/ChallengeCard";
import { LinearGradient } from "expo-linear-gradient";

const CHALLENGES = [
  { id: "social", label: "Social Interaction", image: require("../assets/images/challenge_1.png") },
  { id: "sleeping", label: "Sleeping", image: require("../assets/images/challenge_2.png") },
  { id: "impulsivity", label: "Impulsivity", image: require("../assets/images/challenge_3.png") },
  { id: "eating", label: "Eating", image: require("../assets/images/challenge_4.png") },
  { id: "communication", label: "Communication", image: require("../assets/images/challenge_5.png") },
  { id: "hyperactivity", label: "Hyperactivity", image: require("../assets/images/challenge_6.png") },
  { id: "repetitive", label: "Repetitive", image: require("../assets/images/challenge_7.png") },
  { id: "rigid", label: "Rigid", image: require("../assets/images/challenge_8.png") },
];

export default function BehaviourChallenges() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selected) {
      router.push({
        pathname: "/loading3",
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

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.whiteGradient}
      />

      {/* Main container no longer uses justify-between */}
      <View className="flex-1 pt-20">
        {/* Header */}
        <View className="px-4">
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

              <Text className="text-white text-4xl font-normal text-center px-10">
                Select your child’s {"\n"} behaviour challenges
              </Text>
            </View>
            <View className="h-[1px] bg-white/50 my-3 mb-4" />
        </View>

        {/* Challenge Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          // --- CHANGE 1: ADD SIGNIFICANT PADDING TO THE BOTTOM ---
          // This ensures the last row of challenges can scroll above the floating button.
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
          className="flex-1"
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

        <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
              onPress={handleNext}
              disabled={!selected}
              className={`w-[80%] rounded-full overflow-hidden ${!selected ? "opacity-50" : ""}`}
            >
              <LinearGradient
                colors={["#1072E5", "#64ABFF"]}
                style={styles.buttonGradient}
              >
                <Text className="text-white font-semibold text-xl">Next</Text>
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
    pointerEvents: 'none',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
 
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24, 
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});