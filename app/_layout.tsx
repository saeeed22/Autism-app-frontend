
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="loading1" options={{ headerShown: false }} />
        <Stack.Screen name="loading2" options={{ headerShown: false }} />
        <Stack.Screen name="loading3" options={{ headerShown: false }} />
        <Stack.Screen name="personalized" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="asisstOptions" options={{ headerShown: false }} />
        <Stack.Screen name="BehaviorChallenges" options={{ headerShown: false }} />
        <Stack.Screen name="loader1" options={{ headerShown: false }} />
        <Stack.Screen name="loader2" options={{ headerShown: false }} />
        <Stack.Screen name="loader3" options={{ headerShown: false }} />
        <Stack.Screen name="Options" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}