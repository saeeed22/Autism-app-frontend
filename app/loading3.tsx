import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native"; // Import Easing
import { useRouter } from "expo-router";
import GradientBackground from "../components/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";

export default function CompletionScreen() {
  const router = useRouter();
  
  // Single animation value to drive all our effects
  const animProgress = useRef(new Animated.Value(0)).current;

  // Constants for timing control
  const animationDuration = 1500;
  const navigateDelay = animationDuration + 500;

  useEffect(() => {
    // Start the animation sequence
    Animated.timing(animProgress, {
      toValue: 1, // Animate from 0 (start) to 1 (end)
      duration: animationDuration,
      // Use a professional easing function for a smooth start and end
      easing: Easing.inOut(Easing.ease), 
      useNativeDriver: true, // Essential for smooth, performant animations
    }).start();

    // Navigate after the animation is complete
    const timer = setTimeout(() => {
      router.replace("/personalized");
    }, navigateDelay);

    return () => clearTimeout(timer);
  }, []);

  // --- Interpolations ---

  // Opacity for the outgoing image (loader2.png)
  // It will fade from fully visible (1) to fully transparent (0)
  const topImageOpacity = animProgress.interpolate({
    inputRange: [0, 0.75], // Fades out a bit faster than the scale-in
    outputRange: [1, 0],
    extrapolate: 'clamp', // Ensures opacity doesn't go below 0
  });

  // Scale for the incoming image (loader3.png)
  // It will subtly grow from 95% to 100% size for a professional "settle" effect
  const bottomImageScale = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <GradientBackground>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.85)']}
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
      />

      <View className="flex-1 justify-center items-center">
        <View style={styles.imageContainer}>
          {/* BOTTOM IMAGE (loader3.png): The final state. It scales into view. */}
          <Animated.Image
            source={require("../assets/images/loader3.png")}
            style={[
              styles.image,
              { transform: [{ scale: bottomImageScale }] }
            ]}
          />

          {/* TOP IMAGE (loader2.png): The initial state. It fades out. */}
          <Animated.Image
            source={require("../assets/images/loader2.png")} 
            style={[
              styles.image, 
              { opacity: topImageOpacity }
            ]}
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
    position: 'absolute',
  },
});