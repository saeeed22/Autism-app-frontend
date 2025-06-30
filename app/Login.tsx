import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import GradientBackground from "../components/GradientBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- IMPORTS FOR GOOGLE SIGN-IN ---
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

const { height } = Dimensions.get("window");
const API_BASE_URL = "https://your-api-domain.com/api"; // <-- REPLACE WITH YOUR URL

WebBrowser.maybeCompleteAuthSession();

export default function LoginSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === "error") {
      setApiError("Google Sign-In failed. Please try again.");
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    // This function remains unchanged
    setLoading(true);
    setApiError("");
    try {
      const backendResponse = await fetch(`${API_BASE_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await backendResponse.json();
      if (!backendResponse.ok) {
        throw new Error(data.error || "Failed to sign in with Google.");
      }
      await AsyncStorage.setItem("userToken", data.token);
      hidePanel();
      router.replace("/tabs");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [rememberMe, setRememberMe] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showPanel = (): void => {
    setErrors({});
    setApiError("");
    setIsPanelVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hidePanel = (): void => {
    Keyboard.dismiss();
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsPanelVisible(false);
    });
  };

  const handleLoginPress = async (): Promise<void> => {
    Keyboard.dismiss();
    // Validation is NOT disturbed and runs first
    const newErrors: { [key: string]: string } = {};
    if (!loginEmail) newErrors.loginEmail = "Email is required.";
    else if (!emailRegex.test(loginEmail))
      newErrors.loginEmail = "Invalid email address.";
    if (!loginPassword) newErrors.loginPassword = "Password is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // --- START OF DEV-ONLY LOGIN BYPASS ---
    // This block checks for the special credentials.
    // To disable this, simply comment out or delete this entire `if` block.
    if (loginEmail.toLowerCase() === "test@test.com" && loginPassword === "password123") {
      console.log("--- DEV LOGIN: Bypassing API call for test user ---");
      setLoading(true); // Show loading indicator for realism
      
      // Simulate API delay and success
      setTimeout(async () => {
        // Use a dummy token since we are not hitting a real API
        await AsyncStorage.setItem("userToken", "dummy-dev-token-12345");
        hidePanel();
        router.replace("/tabs");
        setLoading(false);
      }, 500); // 0.5 second delay

      return; // IMPORTANT: This stops the function from proceeding to the real API call
    }
    // --- END OF DEV-ONLY LOGIN BYPASS ---


    // The original API logic for any other email/password
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      await AsyncStorage.setItem("userToken", data.token);
      hidePanel();
      router.replace("/tabs");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginPanel = (): JSX.Element => (
    <View className="bg-white rounded-t-3xl p-6">
      <View className="flex items-center mb-6">
        <Text className="text-2xl font-bold text-blue-600">LOGIN</Text>
      </View>

      <Text className="text-gray-600 mb-2">Email</Text>
      <TextInput
        value={loginEmail}
        onChangeText={setLoginEmail}
        placeholder="Enter your email"
        className="border border-gray-300 rounded-lg p-3 mb-1"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.loginEmail && (
        <Text className="text-red-500 text-sm mb-2">{errors.loginEmail}</Text>
      )}

      <Text className="text-gray-600 mb-2">Password</Text>
      <TextInput
        value={loginPassword}
        onChangeText={setLoginPassword}
        placeholder="Enter your password"
        className="border border-gray-300 rounded-lg p-3 mb-1"
        secureTextEntry
      />
      {errors.loginPassword && (
        <Text className="text-red-500 text-sm mb-2">
          {errors.loginPassword}
        </Text>
      )}

      <View className="flex-row justify-between items-center mb-6 mt-2">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            className={`w-5 h-5 border border-gray-300 rounded mr-2 items-center justify-center ${
              rememberMe ? "bg-blue-600" : "bg-white"
            }`}
          >
            {rememberMe && <Feather name="check" size={14} color="white" />}
          </View>
          <Text className="text-gray-600">Remember Me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-blue-600">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {apiError && (
        <Text className="text-red-500 text-center text-sm mb-4">
          {apiError}
        </Text>
      )}

      <TouchableOpacity
        className={`bg-blue-600 py-4 rounded-full items-center mb-6 ${
          loading && "opacity-50"
        }`}
        onPress={handleLoginPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">LOGIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <GradientBackground>
          <View className="flex-1 justify-center items-center px-6">
            <Image
              source={require("../assets/images/child.png")}
              className="w-75"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-bold mt-6">
              AUTISM SPECTRUM DISORDER
            </Text>
            <Text className="text-white text-center mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>

            <TouchableOpacity
              className="bg-white w-full py-4 rounded-full items-center mt-6"
              onPress={() => router.push("/Options")}
            >
              <Text className="text-blue-600 font-bold">NEXT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full py-4 border border-white rounded-full items-center mt-4"
              onPress={() => showPanel()}
            >
              <Text className="text-white font-bold">LOGIN</Text>
            </TouchableOpacity>
          </View>

          {isPanelVisible && (
            <Pressable
              style={{ position: "absolute", width: "100%", height: "100%" }}
              onPress={hidePanel}
            >
              <View style={{ flex: 1 }} />
            </Pressable>
          )}

          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: height * 0.85,
              transform: [{ translateY: slideAnim }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            }}
          >
            {isPanelVisible && renderLoginPanel()}
          </Animated.View>
        </GradientBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}