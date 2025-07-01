import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      router.replace("/Login");
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

   return (
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </Text>
        </View>
      </GradientBackground>
    );
}

// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Image, Text, View, ActivityIndicator } from "react-native";
// import GradientBackground from "../components/GradientBackground";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Index(): JSX.Element {
//   const router = useRouter();

//   useEffect(() => {
//     // This function will check for a stored token and navigate accordingly.
//     const checkAuthStatusAndNavigate = async () => {
//       let targetRoute: string = "/Login"; // Default route is Login

//       try {
//         // Check if a user token exists in async storage.
//         // The key 'userToken' MUST match the key used in your Login.tsx file.
//         const userToken = await AsyncStorage.getItem('userToken');
        
//         if (userToken) {
//           // If a token exists, the user is considered logged in.
//           targetRoute = "/tabs";
//         }
//       } catch (e) {
//         // If there's an error reading from storage, it's safest to send the user to Login.
//         console.error("Failed to read auth token from storage", e);
//         targetRoute = "/Login";
//       }

//       // We use a timeout to ensure the splash screen is visible for a minimum duration.
//       // This provides a better user experience than an instant screen flash.
//       const timeout = setTimeout(() => {
//         router.replace('/');
//       }, 2500);

      
//       return () => clearTimeout(timeout);
//     };

//     checkAuthStatusAndNavigate();

//   }, [router]); 

//    return (
//       <GradientBackground>
//         <View className="flex-1 justify-center items-center px-6">
//           <Image
//             source={require("../assets/images/child.png")}
//             className="w-75"
//             resizeMode="contain"
//           />
//           <Text className="text-white text-2xl font-bold mt-6">
//             AUTISM SPECTRUM DISORDER
//           </Text>
//           <Text className="text-white text-center mt-2">
//             Loading your experience...
//           </Text>
//           {/* A loading indicator provides feedback to the user that something is happening */}
//           <ActivityIndicator size="large" color="#fff" className="mt-6" />
//         </View>
//       </GradientBackground>
//     );
// }