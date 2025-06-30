import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

export default function CompletionScreen() {
  const router = useRouter();
  
  // Animation value for the fade, initialized to 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Constants for timing control
  const animationDuration = 1500;
  const navigateDelay = animationDuration + 500; // Navigate after animation completes

  useEffect(() => {
    // Start the fade animation. The fadeAnim value will go from 0 to 1.
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Set a timer to navigate to the next screen after the animation
    const timer = setTimeout(() => {
      router.replace("/BehaviorChallenges");
    }, navigateDelay);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Interpolate the animation value (0 to 1) to an opacity value (1 to 0)
  // This will be used for the image that fades OUT.
  const topImageOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0], // When fadeAnim is 0, opacity is 1. When fadeAnim is 1, opacity is 0.
  });

  return (
    <GradientBackground>
      {/* Optional: A subtle gradient overlay at the bottom */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.85)']}
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
      />

      <View className="flex-1 justify-center items-center">
        <View style={styles.imageContainer}>
          {/* BOTTOM IMAGE: This is the final state (loader2.png). It is always visible underneath. */}
          <Animated.Image
            source={require("../assets/images/loader2.png")}
            style={styles.image}
          />

          {/* TOP IMAGE: This is the initial state (loader1.png). It fades out to reveal the image below. */}
          <Animated.Image
            source={require("../assets/images/loader1.png")} 
            style={[styles.image, { opacity: topImageOpacity }]}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    position: 'absolute', // This makes the images stack on top of each other
  },
});