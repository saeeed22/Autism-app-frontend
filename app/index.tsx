import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      router.replace("/tabs");
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-blue-100">
      <Text className="text-2xl text-blue-700 font-bold">Welcome to Autism App</Text>
    </View>
  );
}
