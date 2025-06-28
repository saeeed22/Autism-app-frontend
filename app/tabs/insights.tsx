import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator, // Added for loading states
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- API Configuration ---
const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// --- Types ---
type Answer = 'Yes' | 'No' | null;
type ViewMode = 'insightsReport' | 'startAssessment' | 'questions' | 'summary';

type AssessmentItem = {
  id: string;
  date: string;
  summary: string;
  status: 'Completed' | 'Pending Analysis';
};

type Question = {
  id: string;
  text: string;
};

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
  }[];
};

// --- Helper: Centralized Fetch Logic with Auth ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
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


// --- UI Components (No major changes) ---

const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <View className="flex-row justify-between items-center px-4 pt-6 pb-2 z-10">
    {onBack ? (
      <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
        <Ionicons name="chevron-back" size={28} color="#1F2937" />
      </TouchableOpacity>
    ) : <View className="w-9" />}
    <View className="flex-row items-center space-x-4">
      <TouchableOpacity className="relative bg-white rounded-full p-2 shadow-sm">
        <Ionicons name="notifications-outline" size={22} color="#1F2937" />
        <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} className="w-10 h-10 rounded-full ml-2" />
      </TouchableOpacity>
    </View>
  </View>
);

const RecentAssessmentCard: React.FC<{ item: AssessmentItem }> = ({ item }) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/25 mb-4 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1">
      <Image source={require('../../assets/images/recent_assessment.png')} className="w-16 h-16 mr-2" resizeMode="contain" />
      <View className="flex-1 p-2">
        <Text className="text-xl font-bold text-black">{item.date}</Text>
        <Text className="text-sm text-black pb-1 font-medium">Summary: {item.summary}</Text>
        <Text className={`text-sm font-medium ${item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>Status: {item.status}</Text>
        <TouchableOpacity disabled={item.status !== 'Completed'} className={`${item.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-400'} rounded-lg py-2 px-4 self-start mt-2`}>
          <Text className="text-white text-center font-bold text-sm">VIEW REPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const LearnMoreCard: React.FC = () => (
  <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-3">
    <Image source={require('../../assets/images/eton.png')} className="w-16 h-16 mr-3" resizeMode="contain" />
    <View className="flex-1">
      <Text className="text-base font-bold text-neutral-800">Eton Psychiatrists</Text>
      <Text className="text-sm text-neutral-500" numberOfLines={2}>A thorough assessment is the first step in gaining clarity, understanding strengths and...</Text>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---
const InsightsScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('insightsReport');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  // Data state
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Network state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);
        setViewMode('insightsReport');
        try {
          const [assessmentsRes, chartRes] = await Promise.all([
            fetchWithAuth('/assessments'),
            fetchWithAuth('/assessments/chart-summary')
          ]);
          setAssessments(assessmentsRes);
          const formattedChartData = {
            labels: chartRes.labels,
            datasets: chartRes.datasets.map((ds: { data: number[]; colorName: string }) => ({
              data: ds.data,
              color: (opacity = 1) => {
                if (ds.colorName === 'red') return `rgba(239, 68, 68, ${opacity})`;
                if (ds.colorName === 'yellow') return `rgba(250, 204, 21, ${opacity})`;
                return `rgba(59, 130, 246, ${opacity})`;
              },
            })),
          };
          setChartData(formattedChartData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      loadInitialData();
    }, [])
  );
  
  const handleBeginAssessment = async () => {
    setIsLoading(true);
    try {
      const fetchedQuestions = await fetchWithAuth('/assessments/questions');
      setQuestions(fetchedQuestions);
      const initialAnswers = fetchedQuestions.reduce((acc: any, q: Question) => ({...acc, [q.id]: null }), {});
      setAnswers(initialAnswers);
      setCurrentQuestionIndex(0);
      setViewMode('questions');
    } catch (err: any) {
      alert(`Failed to load questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))
      };
      await fetchWithAuth('/assessments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setViewMode('summary');
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (questionId: string, answer: Answer) => setAnswers(prev => ({ ...prev, [questionId]: answer }));
  const handleBack = () => currentQuestionIndex > 0 ? setCurrentQuestionIndex(p => p - 1) : setViewMode('startAssessment');
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  // --- RENDER LOGIC ---
  if (viewMode === 'insightsReport') {
    if (isLoading) {
      return <SafeAreaView className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></SafeAreaView>;
    }
    if (error) {
      return <SafeAreaView className="flex-1 justify-center items-center"><Text className="text-red-500">{error}</Text></SafeAreaView>;
    }
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
        <AppHeader />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-2">
            <Text className="text-3xl font-extrabold text-neutral-800 tracking-tight">INSIGHT REPORTS</Text>
            <Text className="text-base text-neutral-500 mt-1">Track and understand your child's developmental milestones.</Text>
            <TouchableOpacity onPress={() => setViewMode('startAssessment')} className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 mt-6 w-11/12 mx-auto">
              <MaterialCommunityIcons name="file-document-outline" size={22} color="white" />
              <Text className="text-white font-bold text-base tracking-wider">START NEW ASSESSMENT</Text>
            </TouchableOpacity>
          </View>
          <View className="px-5 mt-8">
            <Text className="text-xl font-bold text-neutral-800 mb-3">Recent Assessments</Text>
            {assessments.length > 0 ? assessments.map(item => <RecentAssessmentCard key={item.id} item={item} />) : <Text className="text-center text-gray-500">No recent assessments found.</Text>}
          </View>
          <View className="px-5 mt-6">
            <Text className="text-xl font-bold text-neutral-800 mb-3">Developmental Insights</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <View className="flex-row justify-between items-center mb-4"><Text className="font-bold text-neutral-700">INSIGHTS SUMMARY</Text><Text className="text-sm text-neutral-500 font-medium">Last 30 days</Text></View>
              {chartData && (
                <LineChart
                  data={chartData} width={Dimensions.get('window').width - 60} height={180}
                  withHorizontalLabels={false} withVerticalLines={false} withInnerLines={false} withOuterLines={false}
                  chartConfig={{ backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff', decimalPlaces: 0, color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`, propsForDots: { r: "0" }, strokeWidth: 2.5 }}
                  bezier style={{ marginLeft: -15 }}
                />
              )}
              <View className="flex-row justify-center space-x-4 mt-4">
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1" /><Text className="text-xs text-neutral-500">Communicational</Text></View>
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-yellow-400 rounded-full mr-1 ml-1" /><Text className="text-xs text-neutral-500">Social Interaction</Text></View>
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-1 ml-1" /><Text className="text-xs text-neutral-500">Behavioral</Text></View>
              </View>
            </View>
          </View>
          <View className="px-5 mt-8"><Text className="text-xl font-bold text-neutral-800 mb-3">Learn More</Text><LearnMoreCard /><LearnMoreCard /></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'startAssessment') {
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF] ">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={() => setViewMode('insightsReport')} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View className="items-center px-8 pt-4">
            <Text className="text-5xl font-bold text-neutral-800">Start A New Assessment </Text>
            <Text className="text-base text-neutral-600 mt-4">This short assessment will help us analyze key behavior patterns to provide insights tailored for your child. It's quick and easy to complete.</Text>
            <View className="mt-8 w-full"><Text className="font-bold text-neutral-700 text-lg mb-3">What to expect</Text><Text className="text-base text-neutral-600 mb-2">• 8-10 Yes/No questions</Text><Text className="text-base text-neutral-600 mb-2">• Takes less than 2 minutes</Text><Text className="text-base text-neutral-600 mb-2">• Personalized insights report at the end</Text></View>
            <Image source={require('../../assets/images/illustration.png')} className="w-72 h-72 rounded-md" resizeMode="contain" />
          </View>
          <View className="p-6 items-center">
            <TouchableOpacity onPress={handleBeginAssessment} disabled={isLoading} className="bg-blue-500 rounded-lg w-5/6 py-4 shadow-lg shadow-blue-500/30 items-center justify-center">
              {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold text-lg">BEGIN ASSESSMENT</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'questions') {
    if (questions.length === 0) return null;
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={handleBack} />
        <View className="flex-1 justify-between">
          <View className="flex-1 px-8 mt-8">
            <Text className="text-4xl font-bold text-neutral-800 text-center">Question {currentQuestionIndex + 1} of {questions.length}</Text>
            <Text className="text-lg text-neutral-600 text-center mt-6 mb-8">{currentQuestion.text}</Text>
            <View className="items-center">
              <View className="w-4/5">
                <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'Yes')} className={`py-4 rounded-2xl border-2 mb-4 bg-white ${answers[currentQuestion.id] === 'Yes' ? 'border-blue-500' : 'border-gray-300'}`}><Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'Yes' ? 'text-blue-500' : 'text-neutral-800'}`}>Yes</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnswer(currentQuestion.id, 'No')} className={`py-4 rounded-2xl border-2 bg-white ${answers[currentQuestion.id] === 'No' ? 'border-blue-500' : 'border-gray-300'}`}><Text className={`text-center font-bold text-lg ${answers[currentQuestion.id] === 'No' ? 'text-blue-500' : 'text-neutral-800'}`}>No</Text></TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-center items-center space-x-2 mt-12">
              {questions.map((_, index) => ( <View key={index} className={`w-2.5 h-2.5 rounded-full ${index <= currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />))}
            </View>
          </View>
          <View className="flex-row p-6 pb-8">
            <TouchableOpacity onPress={handleBack} className="flex-1 mr-2 py-4 rounded-2xl border-2 border-gray-300 bg-white items-center justify-center"><Text className="font-bold text-lg text-neutral-800">BACK</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleNext} disabled={!answers[currentQuestion.id] || isSubmitting} className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${(!answers[currentQuestion.id] || isSubmitting) && 'opacity-50'}`}>
              {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="font-bold text-lg text-white">{currentQuestionIndex === questions.length - 1 ? 'SUBMIT' : 'NEXT'}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

   if (viewMode === 'summary') {
    const ProgressIndicator = () => ( <View className="w-full max-w-sm px-2 mt-12"><Text className="text-center text-sm font-semibold text-gray-500 mb-4">This usually takes up to 5 mins</Text><View className="flex-row items-start justify-center"><View className="flex-1 items-center"><View className="w-6 h-6 bg-blue-500 rounded-md justify-center items-center"><Ionicons name="checkmark-sharp" size={18} color="white" /></View><Text className="text-[10px] font-semibold text-gray-700 mt-2 text-center">Questionnaire{'\n'}Review</Text></View><View className="flex-1 h-0.5 bg-gray-300 mt-3 mx-[-10px]"><View className="w-1/2 h-full bg-blue-500" /></View><View className="flex-1 items-center"><View className="w-6 h-6 rounded-full bg-gray-300" /><Text className="text-[10px] font-semibold text-gray-500 mt-2 text-center">Deep{'\n'}Analysis</Text></View><View className="flex-1 h-0.5 bg-gray-300 mt-3 mx-[-10px]" /><View className="flex-1 items-center"><View className="w-6 h-6 rounded-full bg-gray-300" /><Text className="text-[10px] font-semibold text-gray-500 mt-2 text-center">Report{'\n'}Generation</Text></View></View></View>);
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={() => setViewMode('insightsReport')} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="items-center mt-5 px-5">
            <Image source={require('../../assets/images/family.png')} className="w-48 h-44" resizeMode="contain" />
            <Text className="text-3xl font-bold text-neutral-800 text-center mt-4">Assessment submitted successfully</Text>
            <Text className="text-base text-neutral-500 text-center mt-4 mx-4">We've received your child's questionnaire response. Our AI and expert-backed analysis is underway to create a personalized insight report.</Text>
            <ProgressIndicator />
          </View>
        </ScrollView>
        <View className="px-6 pt-4 pb-6 bg-white/0 items-center">
          <TouchableOpacity onPress={() => router.push('/')} className="bg-blue-500 w-5/6 py-4 rounded-lg shadow-lg shadow-blue-500/30"><Text className="text-white text-center font-bold text-base">GO TO HOME</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode('insightsReport')} className="bg-white w-5/6 py-4 rounded-lg mt-3 border border-gray-300"><Text className="text-neutral-800 text-center font-bold text-base">VIEW PREVIOUS REPORTS</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}

export default InsightsScreen;