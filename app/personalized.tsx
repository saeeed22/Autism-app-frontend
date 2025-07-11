// import React, { useEffect, useRef } from "react";
// import { StyleSheet } from "react-native";
// import {
//   View,
//   Text,
//   Animated,
//   Easing,
//   SafeAreaView,
//   Image,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";

// const ANIMATION_DURATION = 7500;
// const NAVIGATE_DELAY = ANIMATION_DURATION + 500;
// const { height } = Dimensions.get("window");

// export default function PersonalizationScreen() {
//   const router = useRouter();
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Animate the loading progress bar
//     Animated.timing(progressAnim, {
//       toValue: 1,
//       duration: ANIMATION_DURATION,
//       easing: Easing.linear,
//       useNativeDriver: false,
//     }).start();

//     // Float animation loop for the image
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim, {
//           toValue: -8,
//           duration: 2500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim, {
//           toValue: 8,
//           duration: 2500,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Move to next screen
//     const timer = setTimeout(() => {
//       router.replace("/tabs");
//     }, NAVIGATE_DELAY);

//     return () => clearTimeout(timer);
//   }, []);

//   const progressBarWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <View className="flex-1 bg-white relative">
//       <StatusBar hidden />

//       {/* --- BACKGROUND IMAGE with better positioning --- */}
//       <View style={{ height: height * 0.6 }}>
//   <Image
//     source={require("../assets/images/personalization_img1.png")}
//     resizeMode="cover"
//     style={{
//       width: "100%",
//       height: "100%",
//       position: "absolute",
//       bottom: 0,
//       transform: [{ scale: 1.4 }], 
//     }}
//   />
// </View>


//       {/* --- GRADIENT OVERLAY --- */}
//       <LinearGradient
//         colors={[
//           "rgba(70,130,180,0.0)",
//           "rgba(100,160,210,0.5)",
//           "#FFFFFF",
//         ]}
//         style={{ ...StyleSheet.absoluteFillObject }}
//       />

//       {/* --- MAIN CONTENT --- */}
//       <SafeAreaView className="flex-1">
//         <View className="flex-1 justify-center items-center px-8">
//           {/* Title above tag image */}
//           <Text className="text-white text-3xl font-semibold text-center mb-4">
//             Get your personalized
//           </Text>

//           {/* Floating tag image */}
//           <Animated.Image
//             source={require("../assets/images/personalized_loader.png")}
//             resizeMode="contain"
//             className="w-[300px] h-[180px]"
//             style={{ transform: [{ translateY: floatAnim }] }}
//           />

//           {/* Animated Progress Bar */}
//           <View className="w-[85%] items-center mt-8">
//             <View
//               style={{
//                 width: "100%",
//                 height: 8,
//                 backgroundColor: "#ccc",
//                 borderRadius: 100,
//                 overflow: "hidden",
//               }}
//             >
//               <Animated.View
//                 style={{
//                   height: "100%",
//                   backgroundColor: "#4A90E2",
//                   width: progressBarWidth,
//                   borderRadius: 100,
//                 }}
//               />
//             </View>
//             <Text className="mt-2 text-sm text-gray-500">Loading</Text>
//           </View>
//         </View>

//         {/* Bottom Text */}
//         <View className="items-center mb-6">
//           <Text className="text-black text-base font-semibold text-center">
//             Personalising your experience
//           </Text>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }


import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
// --- 1. IMPORT ASYNCSTORAGE ---
import AsyncStorage from "@react-native-async-storage/async-storage";

const ANIMATION_DURATION = 7500;
const NAVIGATE_DELAY = ANIMATION_DURATION + 500;
const { height } = Dimensions.get("window");

// --- 2. ADD THE AUTHENTICATION CHECK FUNCTION ---
/**
 * Checks AsyncStorage for a user token to determine if the user is logged in.
 * In a real app, this token would be set upon successful login.
 * @returns {Promise<boolean>} - True if logged in, false otherwise.
 */
const checkAuthStatus = async () => {
  try {
    // We check for a key, e.g., 'userToken'. You would set this key in your login screen.
    const token = await AsyncStorage.getItem("userToken");
    // If the token exists, the user is logged in.
    return token !== null;
  } catch (error) {
    console.error("Failed to fetch auth token from storage", error);
    // If there's an error, assume the user is not logged in for safety.
    return false;
  }
};

export default function PersonalizationScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the loading progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Float animation loop for the image
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // --- 3. UPDATED NAVIGATION LOGIC ---
    const timer = setTimeout(async () => {
      // Call our function to check login status
      const isLoggedIn = await checkAuthStatus();

      // Determine the destination based on the result
      const destination = isLoggedIn ? "/tabs" : "/Register";

      console.log(`User is ${isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}. Navigating to ${destination}.`);
      
      // Navigate to the correct screen
      router.replace('/tabs');
    }, NAVIGATE_DELAY);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar hidden />
      <View style={{ height: height * 0.6 }}>
        <Image
          source={require("../assets/images/personalization_img1.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            bottom: 0,
            transform: [{ scale: 1.4 }],
          }}
        />
      </View>
      <LinearGradient
        colors={[
          "rgba(70,130,180,0.0)",
          "rgba(100,160,210,0.5)",
          "#FFFFFF",
        ]}
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-white text-3xl font-semibold text-center mb-4">
            Get your personalized
          </Text>
          <Animated.Image
            source={require("../assets/images/personalized_loader.png")}
            resizeMode="contain"
            className="w-[300px] h-[180px]"
            style={{ transform: [{ translateY: floatAnim }] }}
          />
          <View className="w-[85%] items-center mt-8">
            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: "#ccc",
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  height: "100%",
                  backgroundColor: "#4A90E2",
                  width: progressBarWidth,
                  borderRadius: 100,
                }}
              />
            </View>
            <Text className="mt-2 text-sm text-gray-500">Loading</Text>
          </View>
        </View>
        <View className="items-center mb-6">
          <Text className="text-black text-base font-semibold text-center">
            Personalising your experience
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}