import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Test


type CheckInItemType = {
  id: string;
  date: string;
  status: string;
};

const DUMMY_CHECK_INS: CheckInItemType[] = [
  { id: '1', date: 'June 4', status: 'All answers were positive' },
  { id: '2', date: 'June 4', status: 'All answers were positive' },
  { id: '3', date: 'June 4', status: 'All answers were positive' },
  { id: '4', date: 'June 4', status: 'All answers were positive' },
];

const QUESTIONS = [
  { id: 'q1', text: 'Did your child seem active and energetic today?' },
  { id: 'q2', text: 'Did your child respond to their name when called?' },
  { id: 'q3', text: 'Did your child engage in any repetitive behaviors today?' },
];

type Answer = 'Yes' | 'No' | null;


const CheckInCard: React.FC<{ item: CheckInItemType }> = ({ item }) => (
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

// Place this inside your add.tsx file, replacing the old AppHeader component

const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  // Using the exact layout and padding from your home screen header
  <View className="flex-row justify-between items-center px-4 pt-6 pb-2">
    
    {/* This part handles the conditional logic for the left side */}
    {onBack ? (
      // If onBack exists, show the back button
      <TouchableOpacity onPress={onBack} className="p-1">
        <Ionicons name="chevron-back" size={28} color="#1F2937" />
      </TouchableOpacity>
    ) : (
      // If onBack doesn't exist, render an invisible spacer to keep the right side aligned correctly
      <View className="w-8" />
    )}

    {/* This is the right side, copied directly from your home screen header for a perfect match */}
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

  const [viewMode, setViewMode] = useState<'main' | 'quiz' | 'summary'>('main');
  const [canShowCheckin, setCanShowCheckin] = useState(true); // Always true for testing
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({ q1: null, q2: null, q3: null });

  useFocusEffect(
    React.useCallback(() => {
      if (viewMode !== 'main') {
        setViewMode('main');
        setCurrentQuestionIndex(0);
        setAnswers({ q1: null, q2: null, q3: null });
      }
    }, [])
  );

  const handleAnswer = (questionId: string, answer: Answer) => setAnswers(prev => ({ ...prev, [questionId]: answer }));
  const handleNext = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, QUESTIONS.length - 1));
  const handleBack = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  const handleSubmit = async () => {
    setViewMode('summary');
  };

  // --- RENDER LOGIC ---
  if (viewMode === 'quiz') {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={() => currentQuestionIndex === 0 ? setViewMode('main') : handleBack()} />
        
        <View className="flex-1 px-8 mt-8">
            <Text className="text-4xl font-bold text-neutral-800 text-center">
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </Text>
            <Text className="text-lg text-neutral-600 text-center mt-6 mb-8">{currentQuestion.text}</Text>
            
            <View className="items-center">
                <View className="w-4/5">
                    <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'Yes')} className={`py-4 rounded-2xl border-2 mb-4 bg-white ${answers[currentQuestion.id] === 'Yes' ? 'border-blue-500' : 'border-gray-300'}`}>
                        <Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'Yes' ? 'text-blue-500' : 'text-neutral-800'}`}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'No')} className={`py-4 rounded-2xl border-2 bg-white ${answers[currentQuestion.id] === 'No' ? 'border-blue-500' : 'border-gray-300'}`}>
                        <Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'No' ? 'text-blue-500' : 'text-neutral-800'}`}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* PRogress Dots */}
            <View className="flex-row justify-center items-center space-x-2 mt-8">
                {QUESTIONS.map((_, index) => (
                    <View key={index} className={`w-2.5 h-2.5 rounded-full ${index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />
                ))}
            </View>
        </View>

        <View className="flex-row p-6">
            <TouchableOpacity onPress={() => currentQuestionIndex === 0 ? setViewMode('main') : handleBack()} className="flex-1 mr-2 py-4 rounded-2xl border-2 border-gray-300 bg-white items-center justify-center">
                <Text className="font-bold text-lg text-neutral-800">BACK</Text>
            </TouchableOpacity>
            {currentQuestionIndex === QUESTIONS.length - 1 ? (
                <TouchableOpacity onPress={handleSubmit} disabled={!answers[currentQuestion.id]} className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${!answers[currentQuestion.id] && 'opacity-50'}`}>
                    <Text className="font-bold text-lg text-white">SUBMIT</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleNext} disabled={!answers[currentQuestion.id]} className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${!answers[currentQuestion.id] && 'opacity-50'}`}>
                    <Text className="font-bold text-lg text-white">NEXT</Text>
                </TouchableOpacity>
            )}
        </View>
      </SafeAreaView>
    );
  }

  if (viewMode === 'summary') {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <AppHeader />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
            <Text className="text-4xl font-bold text-neutral-800 text-center mb-8">Summary</Text>
            <View className="space-y-4 mb-8">
                {QUESTIONS.map((q, i) => (
                    <View key={q.id}>
                        <Text className="text-lg font-bold text-neutral-700 leading-6">Q{i + 1}: {q.text}</Text>
                        <Text className="text-base text-neutral-800">Answer: {answers[q.id] || 'Not answered'}</Text>
                    </View>
                ))}
            </View>
            <View className="w-full h-[1px] bg-gray-300 my-4" />
            <View>
                <Text className="text-xl font-bold text-neutral-800 mb-2">Insight: Tip</Text>
                <Text className="text-lg text-neutral-700 leading-6">
                    It's great to see your child staying active! If repetitive behavior continues, consider introducing calm-down activities.
                </Text>
            </View>
        </ScrollView>
        <View className="p-6">
            <TouchableOpacity onPress={() => router.push('./')} className="w-full py-4 rounded-2xl bg-blue-500 mb-4">
                <Text className="text-center font-bold text-lg text-white">GO TO HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('main')} className="w-full py-4 rounded-2xl border-2 border-gray-300 bg-white">
                <Text className="text-center font-bold text-lg text-neutral-800">VIEW PAST CHECK-INS</Text>
            </TouchableOpacity>
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
                Track your child's mood and behavior daily to understand patterns and provide better care.
              </Text>
            </View>
            <View className="px-6 mt-8 items-center">
              <TouchableOpacity onPress={() => setViewMode('quiz')} className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 w-5/6">
                <MaterialCommunityIcons name="calendar-check" size={24} color="white" className='mr-1' />
                <Text className="text-white font-bold text-base tracking-wider">START TODAY'S CHECK-IN</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : <View className="h-4" /> }

        <View className={`px-4 pb-6 ${canShowCheckin ? 'mt-16' : 'mt-4'}`}>
          <Text className="text-xl font-bold text-neutral-800 mb-4">Recent Check-Ins</Text>
          {DUMMY_CHECK_INS.map(item => <CheckInCard key={item.id} item={item} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddScreen;