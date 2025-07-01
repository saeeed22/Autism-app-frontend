// // import React, { useState } from 'react';
// // import { 
// //   SafeAreaView, 
// //   View, 
// //   Text, 
// //   TouchableOpacity, 
// //   Image, 
// //   ScrollView,
// //   StyleSheet,
// //   ActivityIndicator, // Added for loading states
// // } from 'react-native';
// // import { LinearGradient } from 'expo-linear-gradient'; 
// // import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// // import { useRouter, useFocusEffect } from 'expo-router';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // --- API Configuration ---
// // const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// // // --- Types ---
// // type ViewMode = 'main' | 'quiz' | 'summary';
// // type Answer = 'Yes' | 'No' | null;

// // type Question = {
// //   id: string;
// //   text: string;
// // };

// // type CheckInItem = {
// //   id: string;
// //   date: string; // e.g., "June 4"
// //   status: string; // e.g., "All answers were positive"
// // };

// // type CheckInSummary = {
// //   id: string;
// //   date: string;
// //   summary: {
// //     questionText: string;
// //     answer: Answer;
// //   }[];
// //   insight: string;
// // };

// // // --- Helper: Centralized Fetch Logic with Auth ---
// // const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
// //   const token = await AsyncStorage.getItem('userToken');
// //   const headers = {
// //     'Content-Type': 'application/json',
// //     ...options.headers,
// //     ...(token && { Authorization: `Bearer ${token}` }),
// //   };
// //   const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
// //   if (!response.ok) {
// //     const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
// //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
// //   }
// //   if (response.status === 204) return null;
// //   return response.json();
// // };

// // // --- UI Components (No major changes) ---
// // const CheckInCard: React.FC<{ item: CheckInItem }> = ({ item }) => (
// //     <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm shadow-black/10 mb-4">
// //       <View className="flex-row items-center">
// //         <Image
// //           source={require('../../assets/images/smiley_icon.png')}
// //           className="w-12 h-12 mr-4"
// //           resizeMode="contain"
// //         />
// //         <View>
// //           <Text className="text-base font-semibold text-neutral-800">{item.date}</Text>
// //           <Text className="text-sm text-neutral-500">{item.status}</Text>
// //         </View>
// //       </View>
// //       {/* TODO: Implement navigation to a detailed summary view */}
// //       <TouchableOpacity className="bg-blue-500 rounded-lg py-2 px-5">
// //         <Text className="text-white font-bold text-xs">Summary</Text>
// //       </TouchableOpacity>
// //     </View>
// // );
  
// // const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
// //     <View className="flex-row justify-between items-center px-4 pt-6 pb-2">
// //       {onBack ? (
// //         <TouchableOpacity onPress={onBack} className="p-1">
// //           <Ionicons name="chevron-back" size={28} color="#1F2937" />
// //         </TouchableOpacity>
// //       ) : (
// //         <View className="w-8" />
// //       )}
// //       <View className="flex-row items-center space-x-4"> 
// //         <TouchableOpacity className="relative bg-white rounded-full p-2 shadow-sm">
// //           <Ionicons name="notifications-outline" size={22} color="#1F2937" />
// //           <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
// //         </TouchableOpacity>
// //         <TouchableOpacity>
// //           <Image
// //             source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
// //             className="w-10 h-10 rounded-full ml-2"
// //           />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// // );

// // // --- THE ALL-IN-ONE SCREEN COMPONENT ---
// // const AddScreen: React.FC = () => {
// //   const router = useRouter();

// //   // View & UI State
// //   const [viewMode, setViewMode] = useState<ViewMode>('main');
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [answers, setAnswers] = useState<Record<string, Answer>>({});

// //   // Data State
// //   const [canShowCheckin, setCanShowCheckin] = useState(true);
// //   const [questions, setQuestions] = useState<Question[]>([]);
// //   const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);
// //   const [summaryData, setSummaryData] = useState<CheckInSummary | null>(null);

// //   // Network State
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useFocusEffect(
// //     React.useCallback(() => {
// //       const loadInitialData = async () => {
// //         setIsLoading(true);
// //         setError(null);
// //         setViewMode('main'); // Reset view on focus
// //         setCurrentQuestionIndex(0); // Reset quiz progress
// //         try {
// //           // Fetch all initial data in parallel
// //           const [statusRes, questionsRes, checkInsRes] = await Promise.all([
// //             fetchWithAuth('/check-ins/today/status'),
// //             fetchWithAuth('/check-ins/questions'),
// //             fetchWithAuth('/check-ins'),
// //           ]);
// //           setCanShowCheckin(statusRes.canCheckIn);
// //           setQuestions(questionsRes);
// //           setCheckIns(checkInsRes);
          
// //           // Reset answers state based on fetched questions
// //           const initialAnswers = questionsRes.reduce((acc: Record<string, Answer>, q: Question) => {
// //             acc[q.id] = null;
// //             return acc;
// //           }, {});
// //           setAnswers(initialAnswers);

// //         } catch (err: any) {
// //           setError(err.message);
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       };
// //       loadInitialData();
// //     }, [])
// //   );

// //   const handleAnswer = (questionId: string, answer: Answer) => setAnswers(prev => ({ ...prev, [questionId]: answer }));
// //   const handleNext = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
// //   const handleBack = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));

// //   const handleSubmit = async () => {
// //     setIsLoading(true);
// //     try {
// //       const answersPayload = {
// //           answers: Object.entries(answers).map(([questionId, answer]) => ({
// //               questionId,
// //               answer
// //           }))
// //       };
// //       const summaryResult: CheckInSummary = await fetchWithAuth('/check-ins', {
// //         method: 'POST',
// //         body: JSON.stringify(answersPayload)
// //       });
// //       setSummaryData(summaryResult);
// //       setViewMode('summary');
// //     } catch (err: any) {
// //       alert(`Error submitting check-in: ${err.message}`);
// //     } finally {
// //         setIsLoading(false);
// //     }
// //   };

// //   // --- RENDER LOGIC ---
// //   if (isLoading && viewMode === 'main') {
// //     return (
// //         <SafeAreaView className="flex-1 bg-[#E0F2FE] justify-center items-center">
// //             <ActivityIndicator size="large" color="#3B82F6" />
// //             <Text className="mt-4 text-gray-600">Loading your check-ins...</Text>
// //         </SafeAreaView>
// //     );
// //   }

// //   if (error) {
// //     return (
// //         <SafeAreaView className="flex-1 bg-[#E0F2FE]">
// //             <AppHeader />
// //             <View className="flex-1 justify-center items-center p-5">
// //               <Text className="text-red-500 font-bold text-lg">An Error Occurred</Text>
// //               <Text className="text-red-400 text-center mt-2">{error}</Text>
// //             </View>
// //         </SafeAreaView>
// //     );
// //   }

// //   if (viewMode === 'quiz') {
// //     if (questions.length === 0) return null; // Or show loading/error
// //     const currentQuestion = questions[currentQuestionIndex];
// //     return (
// //       <SafeAreaView className="flex-1 bg-white">
// //         <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
// //         <AppHeader onBack={() => currentQuestionIndex === 0 ? setViewMode('main') : handleBack()} />
// //         <View className="flex-1 px-8 mt-8">
// //             <Text className="text-4xl font-bold text-neutral-800 text-center">
// //                 Question {currentQuestionIndex + 1} of {questions.length}
// //             </Text>
// //             <Text className="text-lg text-neutral-600 text-center mt-6 mb-8">{currentQuestion.text}</Text>
// //             <View className="items-center">
// //                 <View className="w-4/5">
// //                     <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'Yes')} className={`py-4 rounded-2xl border-2 mb-4 bg-white ${answers[currentQuestion.id] === 'Yes' ? 'border-blue-500' : 'border-gray-300'}`}>
// //                         <Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'Yes' ? 'text-blue-500' : 'text-neutral-800'}`}>Yes</Text>
// //                     </TouchableOpacity>
// //                     <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'No')} className={`py-4 rounded-2xl border-2 bg-white ${answers[currentQuestion.id] === 'No' ? 'border-blue-500' : 'border-gray-300'}`}>
// //                         <Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'No' ? 'text-blue-500' : 'text-neutral-800'}`}>No</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //             <View className="flex-row justify-center items-center space-x-2 mt-8">
// //                 {questions.map((_, index) => (
// //                     <View key={index} className={`w-2.5 h-2.5 rounded-full ${index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />
// //                 ))}
// //             </View>
// //         </View>
// //         <View className="flex-row p-6">
// //             <TouchableOpacity onPress={() => currentQuestionIndex === 0 ? setViewMode('main') : handleBack()} className="flex-1 mr-2 py-4 rounded-2xl border-2 border-gray-300 bg-white items-center justify-center">
// //                 <Text className="font-bold text-lg text-neutral-800">BACK</Text>
// //             </TouchableOpacity>
// //             {currentQuestionIndex === questions.length - 1 ? (
// //                 <TouchableOpacity onPress={handleSubmit} disabled={!answers[currentQuestion.id] || isLoading} className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${(!answers[currentQuestion.id] || isLoading) && 'opacity-50'}`}>
// //                     {isLoading ? <ActivityIndicator color="white" /> : <Text className="font-bold text-lg text-white">SUBMIT</Text>}
// //                 </TouchableOpacity>
// //             ) : (
// //                 <TouchableOpacity onPress={handleNext} disabled={!answers[currentQuestion.id]} className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${!answers[currentQuestion.id] && 'opacity-50'}`}>
// //                     <Text className="font-bold text-lg text-white">NEXT</Text>
// //                 </TouchableOpacity>
// //             )}
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   if (viewMode === 'summary') {
// //     if (!summaryData) return <ActivityIndicator />; // Should not happen, but for safety
// //     return (
// //       <SafeAreaView className="flex-1 bg-white">
// //         <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
// //         <AppHeader />
// //         <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
// //             <Text className="text-4xl font-bold text-neutral-800 text-center mb-8">Summary for {summaryData.date}</Text>
// //             <View className="space-y-4 mb-8">
// //                 {summaryData.summary.map((item, i) => (
// //                     <View key={i}>
// //                         <Text className="text-lg font-bold text-neutral-700 leading-6">Q{i + 1}: {item.questionText}</Text>
// //                         <Text className="text-base text-neutral-800">Answer: {item.answer || 'Not answered'}</Text>
// //                     </View>
// //                 ))}
// //             </View>
// //             <View className="w-full h-[1px] bg-gray-300 my-4" />
// //             <View>
// //                 <Text className="text-xl font-bold text-neutral-800 mb-2">Insight: Tip</Text>
// //                 <Text className="text-lg text-neutral-700 leading-6">{summaryData.insight}</Text>
// //             </View>
// //         </ScrollView>
// //         <View className="p-6">
// //             <TouchableOpacity onPress={() => router.push('/')} className="w-full py-4 rounded-2xl bg-blue-500 mb-4">
// //                 <Text className="text-center font-bold text-lg text-white">GO TO HOME</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={() => setViewMode('main')} className="w-full py-4 rounded-2xl border-2 border-gray-300 bg-white">
// //                 <Text className="text-center font-bold text-lg text-neutral-800">VIEW PAST CHECK-INS</Text>
// //             </TouchableOpacity>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView className="flex-1 bg-[#E0F2FE]">
// //       <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
// //       <AppHeader />
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {canShowCheckin ? (
// //           <>
// //             <View className="items-center px-4 mt-4">
// //               <Text className="text-5xl font-bold text-neutral-800 text-center">Daily{'\n'}Check-In</Text>
// //               <Text className="text-base text-neutral-600 text-center mt-4 w-3/4">
// //                 Track your child's mood and behavior daily to understand patterns and provide better care.
// //               </Text>
// //             </View>
// //             <View className="px-6 mt-8 items-center">
// //               <TouchableOpacity onPress={() => setViewMode('quiz')} className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 w-5/6">
// //                 <MaterialCommunityIcons name="calendar-check" size={24} color="white" className='mr-1' />
// //                 <Text className="text-white font-bold text-base tracking-wider">START TODAY'S CHECK-IN</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </>
// //         ) : (
// //           <View className="items-center px-4 mt-4 pt-8">
// //             {/* <Image source={require('../../assets/images/checkin_done.png')} className="w-24 h-24" resizeMode="contain" /> */}
// //             <Text className="text-2xl font-bold text-neutral-800 text-center mt-4">Check-In Complete!</Text>
// //             <Text className="text-base text-neutral-600 text-center mt-2 w-3/4">
// //               You've already completed the check-in for today. Come back tomorrow for the next one!
// //             </Text>
// //           </View>
// //         ) }
// //         <View className={`px-4 pb-6 ${canShowCheckin ? 'mt-16' : 'mt-4'}`}>
// //           <Text className="text-xl font-bold text-neutral-800 mb-4">Recent Check-Ins</Text>
// //           {checkIns.map(item => <CheckInCard key={item.id} item={item} />)}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // export default AddScreen;



// import React, { useState, useRef } from 'react';
// import { 
//   SafeAreaView, 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   Image, 
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   ImageBackground,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; 
// import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
// import { useRouter, useFocusEffect } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Camera, CameraType } from 'expo-camera'; // Import Camera
// import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

// // --- API Configuration ---
// const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// // --- Types ---
// type ViewMode = 'main' | 'camera' | 'analysis';

// type CapturedImage = {
//   uri: string;
//   width: number;
//   height: number;
// };

// type CheckInItem = {
//   id: string;
//   date: string; // e.g., "June 4"
//   status: string; // e.g., "Check-in completed"
// };

// // --- Helper: Centralized Fetch Logic with Auth (Updated for FormData) ---
// const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
//   const token = await AsyncStorage.getItem('userToken');
//   const isFormData = options.body instanceof FormData;

//   const headers: HeadersInit = {
//     // Let fetch set the 'Content-Type' for FormData automatically
//     ...(!isFormData && { 'Content-Type': 'application/json' }),
//     ...options.headers,
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
//     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//   }
//   if (response.status === 204) return null; // No Content
//   return response.json();
// };

// // --- UI Components (No major changes) ---
// const CheckInCard: React.FC<{ item: CheckInItem }> = ({ item }) => (
//     <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm shadow-black/10 mb-4">
//       <View className="flex-row items-center">
//         <Image
//           source={require('../../assets/images/smiley_icon.png')}
//           className="w-12 h-12 mr-4"
//           resizeMode="contain"
//         />
//         <View>
//           <Text className="text-base font-semibold text-neutral-800">{item.date}</Text>
//           <Text className="text-sm text-neutral-500">{item.status}</Text>
//         </View>
//       </View>
//       <TouchableOpacity className="bg-blue-500 rounded-lg py-2 px-5">
//         <Text className="text-white font-bold text-xs">Summary</Text>
//       </TouchableOpacity>
//     </View>
// );
  
// const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
//     <View className="flex-row justify-between items-center px-4 pt-6 pb-2">
//       {onBack ? (
//         <TouchableOpacity onPress={onBack} className="p-1">
//           <Ionicons name="chevron-back" size={28} color="#1F2937" />
//         </TouchableOpacity>
//       ) : <View className="w-8" />}
//       <View className="flex-row items-center space-x-4"> 
//         <TouchableOpacity className="relative bg-white rounded-full p-2 shadow-sm">
//           <Ionicons name="notifications-outline" size={22} color="#1F2937" />
//           <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Image
//             source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
//             className="w-10 h-10 rounded-full ml-2"
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
// );

// // --- THE ALL-IN-ONE SCREEN COMPONENT ---
// const AddScreen: React.FC = () => {
//   const router = useRouter();
//   const cameraRef = useRef<Camera>(null);

//   // View & UI State
//   const [viewMode, setViewMode] = useState<ViewMode>('main');
//   const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);

//   // Data State
//   const [canShowCheckin, setCanShowCheckin] = useState(true);
//   const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);

//   // Network State
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useFocusEffect(
//     React.useCallback(() => {
//       // This function now only loads the main screen data
//       const loadInitialData = async () => {
//         setIsLoading(true);
//         setError(null);
//         // Reset state on focus
//         setViewMode('main'); 
//         setCapturedImage(null);
//         try {
//           const [statusRes, checkInsRes] = await Promise.all([
//             fetchWithAuth('/check-ins/today/status'),
//             fetchWithAuth('/check-ins'),
//           ]);
//           setCanShowCheckin(statusRes.canCheckIn);
//           setCheckIns(checkInsRes);
//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       loadInitialData();
//     }, [])
//   );

//   const handleStartCheckIn = async () => {
//     const cameraPermission = await Camera.requestCameraPermissionsAsync();
//     if (cameraPermission.status !== 'granted') {
//       alert('Camera permission is required to continue.');
//       return;
//     }
//     setViewMode('camera');
//   };

//   const handleTakePicture = async () => {
//     if (!cameraRef.current) return;
//     try {
//       const photo = await cameraRef.current.takePictureAsync();
//       setCapturedImage(photo);
//     } catch (e) {
//       console.error("Failed to take picture:", e);
//       alert("Could not take picture. Please try again.");
//     }
//   };
  
//   const handlePickImage = async () => {
//     const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if(galleryPermission.status !== 'granted') {
//         alert('Gallery permission is required to continue.');
//         return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setCapturedImage(result.assets[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!capturedImage) return;
//     setIsUploading(true);
    
//     // --- IMPORTANT FOR BACKEND DEVELOPER ---
//     // The API now needs to handle 'multipart/form-data'.
//     // The image will be available in the 'image' field of the form data.
//     const formData = new FormData();
//     const uriParts = capturedImage.uri.split('.');
//     const fileType = uriParts[uriParts.length - 1];
    
//     formData.append('image', {
//       uri: capturedImage.uri,
//       name: `checkin-${new Date().toISOString()}.${fileType}`,
//       type: `image/${fileType}`,
//     } as any);

//     try {
//       await fetchWithAuth('/check-ins', {
//         method: 'POST',
//         body: formData,
//       });
//       setViewMode('analysis');
//     } catch (err: any) {
//       alert(`Error uploading image: ${err.message}`);
//     } finally {
//         setIsUploading(false);
//     }
//   };

//   // --- RENDER LOGIC ---
//   if (isLoading) {
//     return (
//         <SafeAreaView className="flex-1 bg-[#E0F2FE] justify-center items-center">
//             <ActivityIndicator size="large" color="#3B82F6" />
//             <Text className="mt-4 text-gray-600">Loading your check-ins...</Text>
//         </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//         <SafeAreaView className="flex-1 bg-[#E0F2FE]">
//             <AppHeader />
//             <View className="flex-1 justify-center items-center p-5">
//               <Text className="text-red-500 font-bold text-lg">An Error Occurred</Text>
//               <Text className="text-red-400 text-center mt-2">{error}</Text>
//             </View>
//         </SafeAreaView>
//     );
//   }

//   if (viewMode === 'camera') {
//     if (capturedImage) {
//         return ( // --- Image Preview View ---
//             <SafeAreaView className="flex-1 bg-black">
//                 <ImageBackground source={{ uri: capturedImage.uri }} className="flex-1 justify-between">
//                     <View className="flex-row justify-end p-4 mt-4">
//                         <TouchableOpacity onPress={() => setCapturedImage(null)} className="bg-black/50 p-2 rounded-full">
//                            <Ionicons name="close" size={28} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                     <View className="p-6">
//                         <TouchableOpacity 
//                             onPress={handleSubmit} 
//                             disabled={isUploading} 
//                             className={`w-full py-4 rounded-2xl items-center justify-center bg-blue-500 ${isUploading && 'opacity-50'}`}
//                         >
//                             {isUploading ? <ActivityIndicator color="white" /> : <Text className="text-center font-bold text-lg text-white">UPLOAD & ANALYZE</Text>}
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={() => setCapturedImage(null)} disabled={isUploading} className="w-full py-4 mt-4 rounded-2xl bg-white/90">
//                            <Text className="text-center font-bold text-lg text-neutral-800">Retake</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ImageBackground>
//             </SafeAreaView>
//         )
//     }
//     return ( // --- Live Camera View ---
//       <SafeAreaView className="flex-1 bg-black">
//         <Camera style={StyleSheet.absoluteFill} type={CameraType.back} ref={cameraRef} />
//         <View className="flex-1 justify-between">
//             <View className="flex-row justify-between items-center p-4 mt-4">
//                 <TouchableOpacity onPress={() => setViewMode('main')} className="bg-black/50 p-2 rounded-full">
//                     <Ionicons name="chevron-back" size={28} color="white" />
//                 </TouchableOpacity>
//             </View>
//             <View className="flex-row justify-around items-center p-6 bg-black/30">
//                 <TouchableOpacity onPress={handlePickImage} className="items-center">
//                     <Ionicons name="image" size={32} color="white" />
//                     <Text className="text-white text-xs mt-1">Gallery</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleTakePicture} className="w-20 h-20 rounded-full bg-white border-4 border-white/50" />
//                 <TouchableOpacity className="items-center opacity-0"> {/* Placeholder for symmetry */}
//                     <Ionicons name="sync" size={32} color="white" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (viewMode === 'analysis') {
//     return (
//       <SafeAreaView className="flex-1 bg-white">
//         <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
//         <AppHeader />
//         <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
//             <View className="items-center">
//                 <Feather name="cpu" size={60} color="#3B82F6" />
//                 <Text className="text-3xl font-bold text-neutral-800 text-center mt-6 mb-4">Analysis in Progress</Text>
//                 <Text className="text-lg text-neutral-600 text-center leading-7">
//                     Thank you! Our AI model will analyze your image and provide you with guidance and insights shortly. 
//                     You will be notified once the summary is ready.
//                 </Text>
//             </View>
//         </ScrollView>
//         <View className="p-6">
//             <TouchableOpacity onPress={() => router.replace('/tabs')} className="w-full py-4 rounded-2xl bg-blue-500 mb-4">
//                 <Text className="text-center font-bold text-lg text-white">GO TO HOME</Text>
//             </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return ( // --- Main View ---
//     <SafeAreaView className="flex-1 bg-[#E0F2FE]">
//       <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
//       <AppHeader />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {canShowCheckin ? (
//           <>
//             <View className="items-center px-4 mt-4">
//               <Text className="text-5xl font-bold text-neutral-800 text-center">Daily{'\n'}Check-In</Text>
//               <Text className="text-base text-neutral-600 text-center mt-4 w-3/4">
//                 Upload a photo to help our AI track patterns and provide better care insights.
//               </Text>
//             </View>
//             <View className="px-6 mt-8 items-center">
//               <TouchableOpacity onPress={handleStartCheckIn} className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 w-5/6">
//                 <MaterialCommunityIcons name="camera" size={24} color="white" className='mr-1' />
//                 <Text className="text-white font-bold text-base tracking-wider">START TODAY'S CHECK-IN</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         ) : (
//           <View className="items-center px-4 mt-4 pt-8">
//             <Text className="text-2xl font-bold text-neutral-800 text-center mt-4">Check-In Complete!</Text>
//             <Text className="text-base text-neutral-600 text-center mt-2 w-3/4">
//               You've already completed the check-in for today. Come back tomorrow!
//             </Text>
//           </View>
//         )}
//         <View className={`px-4 pb-6 ${canShowCheckin ? 'mt-16' : 'mt-4'}`}>
//           <Text className="text-xl font-bold text-neutral-800 mb-4">Recent Check-Ins</Text>
//           {checkIns.map(item => <CheckInCard key={item.id} item={item} />)}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// export default AddScreen;


import React, { useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// --- FIX 1: Import CameraView and useCameraPermissions ---
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// --- API Configuration ---
const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// --- Types ---
type ViewMode = 'main' | 'camera' | 'analysis';

type CapturedImage = {
  uri: string;
  width: number;
  height: number;
};

type CheckInItem = {
  id: string;
  date: string; // e.g., "June 4"
  status: string; // e.g., "Check-in completed"
};

// --- Helper: Centralized Fetch Logic with Auth (Updated for FormData) ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('userToken');
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

// --- UI Components (No changes) ---
const CheckInCard: React.FC<{ item: CheckInItem }> = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm shadow-black/10 mb-4">
      <View className="flex-row items-center">
        <Image
          source={require('../../assets/images/smiley_icon.png')}
          className="w-12 h-12 mr-4"
          resizeMode="contain"
        />
        <View>
          <Text className="text-base font-semibold text-neutral-800">{item.date}</Text>
          <Text className="text-sm text-neutral-500">{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity className="bg-blue-500 rounded-lg py-2 px-5">
        <Text className="text-white font-bold text-xs">Summary</Text>
      </TouchableOpacity>
    </View>
);

const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
    <View className="flex-row justify-between items-center px-4 pt-6 pb-2">
      {onBack ? (
        <TouchableOpacity onPress={onBack} className="p-1">
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
      ) : <View className="w-8" />}
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity className="relative bg-white rounded-full p-2 shadow-sm">
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
            className="w-10 h-10 rounded-full ml-2"
          />
        </TouchableOpacity>
      </View>
    </View>
);


// --- THE ALL-IN-ONE SCREEN COMPONENT ---
const AddScreen: React.FC = () => {
  const router = useRouter();
  // --- FIX 2: Update the ref type to CameraView ---
  const cameraRef = useRef<CameraView>(null);
  
  // --- FIX 3: Use the modern permissions hook ---
  const [permission, requestPermission] = useCameraPermissions();

  // View & UI State
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);

  // Data State
  const [canShowCheckin, setCanShowCheckin] = useState(true);
  const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);

  // Network State
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);
        setViewMode('main');
        setCapturedImage(null);
        try {
          const [statusRes, checkInsRes] = await Promise.all([
            fetchWithAuth('/check-ins/today/status'),
            fetchWithAuth('/check-ins'),
          ]);
          setCanShowCheckin(statusRes.canCheckIn);
          setCheckIns(checkInsRes);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      loadInitialData();
    }, [])
  );

  const handleStartCheckIn = async () => {
    // --- FIX 4: Update permission request logic ---
    if (!permission) return; // Permissions are still loading

    let finalPermission = permission;
    if (!permission.granted) {
      finalPermission = await requestPermission();
    }
    
    if (!finalPermission.granted) {
      alert('Camera permission is required to continue.');
      return;
    }
    setViewMode('camera');
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo);
    } catch (e) {
      console.error("Failed to take picture:", e);
      alert("Could not take picture. Please try again.");
    }
  };

  const handlePickImage = async () => {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(galleryPermission.status !== 'granted') {
        alert('Gallery permission is required to continue.');
        return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      // The result is an array, take the first asset
      setCapturedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    setIsUploading(true);

    const formData = new FormData();
    const uriParts = capturedImage.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('image', {
      uri: capturedImage.uri,
      name: `checkin-${new Date().toISOString()}.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      await fetchWithAuth('/check-ins', {
        method: 'POST',
        body: formData,
      });
      setViewMode('analysis');
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
        setIsUploading(false);
    }
  };

  // --- RENDER LOGIC ---

  // A better loading state while checking permissions
  if (!permission && isLoading) {
    return (
        <SafeAreaView className="flex-1 bg-[#E0F2FE] justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
        </SafeAreaView>
    );
  }

  if (viewMode === 'camera') {
    if (capturedImage) {
        return ( // --- Image Preview View ---
            <SafeAreaView className="flex-1 bg-black">
                <ImageBackground source={{ uri: capturedImage.uri }} className="flex-1 justify-between">
                    <View className="flex-row justify-end p-4 mt-4">
                        <TouchableOpacity onPress={() => setCapturedImage(null)} className="bg-black/50 p-2 rounded-full">
                           <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="p-6">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isUploading}
                            className={`w-full py-4 rounded-2xl items-center justify-center bg-blue-500 ${isUploading && 'opacity-50'}`}
                        >
                            {isUploading ? <ActivityIndicator color="white" /> : <Text className="text-center font-bold text-lg text-white">UPLOAD & ANALYZE</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCapturedImage(null)} disabled={isUploading} className="w-full py-4 mt-4 rounded-2xl bg-white/90">
                           <Text className="text-center font-bold text-lg text-neutral-800">Retake</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        )
    }
    return ( // --- Live Camera View ---
      <SafeAreaView className="flex-1 bg-black">
        {/* --- FIX 5: Use CameraView and the `facing` prop --- */}
        <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef} />
        <View className="flex-1 justify-between">
            <View className="flex-row justify-between items-center p-4 mt-4">
                <TouchableOpacity onPress={() => setViewMode('main')} className="bg-black/50 p-2 rounded-full">
                    <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-around items-center p-6 bg-black/30">
                <TouchableOpacity onPress={handlePickImage} className="items-center">
                    <Ionicons name="image" size={32} color="white" />
                    <Text className="text-white text-xs mt-1">Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTakePicture} className="w-20 h-20 rounded-full bg-white border-4 border-white/50" />
                <TouchableOpacity className="items-center opacity-0"> {/* Placeholder for symmetry */}
                    <Ionicons name="sync" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    );
  }

  if (viewMode === 'analysis') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <AppHeader />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">
            <View className="items-center">
                <Feather name="cpu" size={60} color="#3B82F6" />
                <Text className="text-3xl font-bold text-neutral-800 text-center mt-6 mb-4">Analysis in Progress</Text>
                <Text className="text-lg text-neutral-600 text-center leading-7">
                    Thank you! Our AI model will analyze your image and provide you with guidance and insights shortly.
                    You will be notified once the summary is ready.
                </Text>
            </View>
        </ScrollView>
        <View className="p-6">
            <TouchableOpacity onPress={() => router.replace('/tabs')} className="w-full py-4 rounded-2xl bg-blue-500 mb-4">
                <Text className="text-center font-bold text-lg text-white">GO TO HOME</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Main View --- (This part has no significant changes, but included for completeness)
  if (isLoading) {
    return (
        <SafeAreaView className="flex-1 bg-[#E0F2FE] justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-600">Loading your check-ins...</Text>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView className="flex-1 bg-[#E0F2FE]">
            <AppHeader />
            <View className="flex-1 justify-center items-center p-5">
              <Text className="text-red-500 font-bold text-lg">An Error Occurred</Text>
              <Text className="text-red-400 text-center mt-2">{error}</Text>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#E0F2FE]">
      <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {canShowCheckin ? (
          <>
            <View className="items-center px-4 mt-4">
              <Text className="text-5xl font-bold text-neutral-800 text-center">Daily{'\n'}Check-In</Text>
              <Text className="text-base text-neutral-600 text-center mt-4 w-3/4">
                Upload a photo to help our AI track patterns and provide better care insights.
              </Text>
            </View>
            <View className="px-6 mt-8 items-center">
              <TouchableOpacity onPress={handleStartCheckIn} className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 w-5/6">
                <MaterialCommunityIcons name="camera" size={24} color="white" className='mr-1' />
                <Text className="text-white font-bold text-base tracking-wider">START TODAY'S CHECK-IN</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="items-center px-4 mt-4 pt-8">
            <Text className="text-2xl font-bold text-neutral-800 text-center mt-4">Check-In Complete!</Text>
            <Text className="text-base text-neutral-600 text-center mt-2 w-3/4">
              You've already completed the check-in for today. Come back tomorrow!
            </Text>
          </View>
        )}
        <View className={`px-4 pb-6 ${canShowCheckin ? 'mt-16' : 'mt-4'}`}>
          <Text className="text-xl font-bold text-neutral-800 mb-4">Recent Check-Ins</Text>
          {checkIns.map(item => <CheckInCard key={item.id} item={item} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddScreen;







