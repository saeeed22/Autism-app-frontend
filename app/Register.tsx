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
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import GradientBackground from "../components/GradientBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- IMPORTS FOR GOOGLE SIGN-IN ---
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

const { height } = Dimensions.get("window");
// --- UPDATED API URLS ---
const API_BASE_URL = "https://your-api-domain.com/api"; // <-- REPLACE WITH YOUR URL

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const slideAnim = useRef(new Animated.Value(height)).current;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // --- STATE TO CONTROL WHICH PANEL VIEW IS SHOWN: 'register' or 'otp' ---
  const [panelView, setPanelView] = useState("register");
  // --- STATE TO STORE THE EMAIL FOR OTP VERIFICATION ---
  const [emailForOtp, setEmailForOtp] = useState("");

  // --- GOOGLE SIGN-IN LOGIC ---
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

  // --- PANEL ANIMATION LOGIC ---
  const showPanel = (): void => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
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
      if (router.canGoBack()) router.back();
    });
  };

  useEffect(() => {
    showPanel();
  }, []);

  // --- REGISTRATION FORM STATE & LOGIC ---
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleRegisterPress = async (): Promise<void> => {
    Keyboard.dismiss();
    const newErrors: { [key: string]: string } = {};
    if (!registerUsername)
      newErrors.registerUsername = "Username is required.";
    if (!registerEmail) newErrors.registerEmail = "Email is required.";
    else if (!emailRegex.test(registerEmail))
      newErrors.registerEmail = "Invalid email address.";
    if (!registerPassword)
      newErrors.registerPassword = "Password is required.";
    else if (registerPassword.length < 6)
      newErrors.registerPassword = "Password must be at least 6 characters.";
    if (registerPassword !== registerConfirmPassword)
      newErrors.registerConfirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError("");
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      // --- ON SUCCESS, SWITCH TO OTP VIEW ---
      setEmailForOtp(registerEmail); // Save email for the next step
      setPanelView("otp");
      setErrors({}); // Clear previous errors
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- OTP VERIFICATION STATE & LOGIC ---
  const [otp, setOtp] = useState("");

  const handleOtpVerifyPress = async (): Promise<void> => {
    Keyboard.dismiss();
    if (!otp || otp.length < 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP." });
      return;
    }
    setErrors({});
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForOtp, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP or an error occurred.");
      }
      // --- OTP IS CORRECT, SAVE TOKEN AND NAVIGATE ---
      await AsyncStorage.setItem("userToken", data.token);
      hidePanel();
      router.replace("/tabs");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- JSX FOR THE REGISTRATION PANEL ---
  const renderRegisterPanel = (): JSX.Element => (
    <ScrollView
      className="bg-white rounded-t-3xl p-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex items-center mb-6">
        <Text className="text-2xl font-bold text-blue-600">CREATE ACCOUNT</Text>
      </View>
      {/* ... Registration form fields (same as before) ... */}
      <Text className="text-gray-600 mb-2">Username</Text>
      <TextInput value={registerUsername} onChangeText={setRegisterUsername} placeholder="Enter your username" className="border border-gray-300 rounded-lg p-3 mb-1" autoCapitalize="none" />
      {errors.registerUsername && <Text className="text-red-500 text-sm mb-2">{errors.registerUsername}</Text>}
      <Text className="text-gray-600 mb-2">Email</Text>
      <TextInput value={registerEmail} onChangeText={setRegisterEmail} placeholder="Enter your email" className="border border-gray-300 rounded-lg p-3 mb-1" keyboardType="email-address" autoCapitalize="none" />
      {errors.registerEmail && <Text className="text-red-500 text-sm mb-2">{errors.registerEmail}</Text>}
      <Text className="text-gray-600 mb-2">Password</Text>
      <TextInput value={registerPassword} onChangeText={setRegisterPassword} placeholder="Enter your password" className="border border-gray-300 rounded-lg p-3 mb-1" secureTextEntry />
      {errors.registerPassword && <Text className="text-red-500 text-sm mb-2">{errors.registerPassword}</Text>}
      <Text className="text-gray-600 mb-2">Confirm Password</Text>
      <TextInput value={registerConfirmPassword} onChangeText={setRegisterConfirmPassword} placeholder="Re-enter your password" className="border border-gray-300 rounded-lg p-3 mb-1" secureTextEntry />
      {errors.registerConfirmPassword && <Text className="text-red-500 text-sm mb-2">{errors.registerConfirmPassword}</Text>}
      
      {apiError && <Text className="text-red-500 text-center text-sm my-4">{apiError}</Text>}
      
      <TouchableOpacity
        className={`bg-blue-600 py-4 rounded-full items-center mt-4 mb-6 ${loading && "opacity-50"}`}
        onPress={handleRegisterPress}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">REGISTER</Text>}
      </TouchableOpacity>
      <View className="flex-row items-center mb-6"><View className="flex-1 h-0.5 bg-gray-300" /><Text className="mx-4 text-gray-500">OR</Text><View className="flex-1 h-0.5 bg-gray-300" /></View>
      <TouchableOpacity className="flex-row items-center justify-center py-3 border border-gray-300 rounded-lg" onPress={() => promptAsync()} disabled={!request || loading}>
        <AntDesign name="google" size={18} color="#4285F4" style={{ marginRight: 10 }}/>
        <Text className="font-medium">Sign up with Google</Text>
      </TouchableOpacity>
      <View className="h-10" />
    </ScrollView>
  );

  // --- NEW: JSX FOR THE OTP PANEL ---
  const renderOtpPanel = (): JSX.Element => (
    <View className="bg-white rounded-t-3xl p-6">
        <View className="flex items-center mb-4">
            <Text className="text-2xl font-bold text-blue-600">OTP VERIFICATION</Text>
        </View>
        <Text className="text-gray-600 text-center mb-6">
            An OTP has been sent to your email at{" "}
            <Text className="font-bold">{emailForOtp}</Text>
        </Text>

        <Text className="text-gray-600 mb-2">Enter OTP</Text>
        <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit OTP"
            className="border border-gray-300 rounded-lg p-3 mb-1 text-center tracking-widest"
            keyboardType="number-pad"
            maxLength={6}
        />
        {errors.otp && <Text className="text-red-500 text-sm mb-2">{errors.otp}</Text>}
        
        {apiError && <Text className="text-red-500 text-center text-sm my-4">{apiError}</Text>}

        <TouchableOpacity
            className={`bg-blue-600 py-4 rounded-full items-center mt-6 mb-6 ${loading && "opacity-50"}`}
            onPress={handleOtpVerifyPress}
            disabled={loading}
        >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">VERIFY & PROCEED</Text>}
        </TouchableOpacity>
        
        {/* Optional: Add a resend button */}
        <TouchableOpacity disabled={loading} className="items-center">
            <Text className="text-blue-600">Resend OTP</Text>
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
            <Image source={require("../assets/images/child.png")} className="w-75" resizeMode="contain" />
          </View>
          <TouchableWithoutFeedback onPress={hidePanel}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: height * 0.9,
              transform: [{ translateY: slideAnim }],
              shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
              backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden",
            }}
          >
            {/* --- CONDITIONALLY RENDER THE CORRECT PANEL VIEW --- */}
            {panelView === 'register' ? renderRegisterPanel() : renderOtpPanel()}
          </Animated.View>
        </GradientBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}