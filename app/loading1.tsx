import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

export default function CompletionScreen() {
  const router = useRouter();
  
  // Animation value for the fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animationDuration = 1500;
  const navigateDelay = animationDuration + 500; 

  useEffect(() => {
    // Start the fade animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate from 0 to 1
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/asisstOptions");
    }, navigateDelay);

    return () => clearTimeout(timer);
  }, []);

  const topImageOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <GradientBackground>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.85)']}
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
      />

      <View className="flex-1 justify-center items-center">
        <View style={styles.imageContainer}>
          <Animated.Image
            source={require("../assets/images/loader1.png")}
            style={styles.image}
          />

          <Animated.Image
            source={require("../assets/images/loader.png")} 
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