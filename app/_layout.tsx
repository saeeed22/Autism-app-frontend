
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="Splash" options={{ headerShown: false }} />
        <Stack.Screen name="LoginSignup" options={{ headerShown: false }} />
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