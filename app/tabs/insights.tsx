import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';


type AssessmentItemType = {
  id: string;
  date: string;
  summary: string;
  status: string;
};

const DUMMY_ASSESSMENTS: AssessmentItemType[] = [
  { id: '1', date: 'May 25, 2025', summary: 'Brief overview of findings', status: 'Completed' },
];

const QUESTIONS = [
  { id: 'q1', text: 'Did your child respond to their name when called?' },
  { id: 'q2', text: 'Did your child make eye contact with you today?' },
  { id: 'q3', text: 'Did your child engage in imaginative play?' },
  { id: 'q4', text: 'Was your child easily comforted when upset?' },
  { id: 'q5', text: 'Did your child show interest in other children?' },
  { id: 'q6', text: 'Did your child use gestures to communicate?' },
  { id: 'q7', text: 'Did your child exhibit any repetitive behaviors?' },
  { id: 'q8', text: 'Did your child seem happy and content for most of the day?' },
];

type Answer = 'Yes' | 'No' | null;
type ViewMode = 'insightsReport' | 'startAssessment' | 'questions' | 'summary';



// Header
const AppHeader: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <View className="flex-row justify-between items-center px-4 pt-6 pb-2 z-10">
    {onBack ? (
      <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
        <Ionicons name="chevron-back" size={28} color="#1F2937" />
      </TouchableOpacity>
    ) : (
      <View className="w-9" /> // Space for alignment
    )}


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

// Assessment card
const RecentAssessmentCard: React.FC<{ item: AssessmentItemType }> = ({ item }) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/25 mb-4 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1">
      <View className="p-2 mr-1">
        {/* <MaterialCommunityIcons name="file-document-outline" size={24} color="#0EA5E9" /> */}
        <Image
          source={require('../../assets/images/recent_assessment.png')}
          className="w-17 h-17 mr-1"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 p-2">
        <Text className="text-xl font-bold text-black">{item.date}</Text>
        <Text className="text-sm text-black pb-1 font-medium">Summary: {item.summary}</Text>
        <Text className="text-sm text-black font-medium">Summary: {item.status}</Text>
        <TouchableOpacity className="bg-blue-500 rounded-lg py-2 px-4 self-start mt-2">
          <Text className="text-white text-center font-bold text-sm">VIEW REPORT</Text>
        </TouchableOpacity>
      </View>
    </View>

  </View>
);

const LearnMoreCard: React.FC = () => (
  <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-3">
    <View className="bg-blue-100 p-2 rounded-lg mr-4">
      <Image
        source={require('../../assets/images/eton.png')}
        className="w-14 h-14 mr-1"
        resizeMode="contain"
      />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-neutral-800">Eton Psychiatrists</Text>
      <Text className="text-sm text-neutral-500" numberOfLines={2}>
        A thorough assessment is the first step in gaining clarity, understanding strengths and...
      </Text>
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---
const InsightsScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('insightsReport');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useFocusEffect(
    React.useCallback(() => {
      setViewMode('insightsReport');
      setCurrentQuestionIndex(0);
      setAnswers({});
    }, [])
  );

  const handleAnswer = (questionId: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setViewMode('summary');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setViewMode('startAssessment');
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // --- RENDER LOGIC ---

  if (viewMode === 'insightsReport') {
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
        <AppHeader />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-2">
            <Text className="text-3xl font-extrabold text-neutral-800 tracking-tight">INSIGHT REPORTS</Text>
            <Text className="text-base text-neutral-500 mt-1">
              Track and understand your child's developmental milestones.
            </Text>

            <TouchableOpacity
              onPress={() => setViewMode('startAssessment')}
              // Add w-11/12 (or similar) and mx-auto
              className="bg-blue-500 rounded-lg py-4 flex-row justify-center items-center space-x-3 shadow-lg shadow-blue-500/30 mt-6 w-11/12 mx-auto"
            >
              <MaterialCommunityIcons name="file-document-outline" size={22} className='mr-1' color="white" />
              <Text className="text-white font-bold text-base tracking-wider">START NEW ASSESSMENT</Text>
            </TouchableOpacity>
          </View>

          <View className="px-5 mt-8">
            <Text className="text-xl font-bold text-neutral-800 mb-3">Recent Assessments</Text>
            {DUMMY_ASSESSMENTS.map(item => <RecentAssessmentCard key={item.id} item={item} />)}
          </View>

          <View className="px-5 mt-6">
            <Text className="text-xl font-bold text-neutral-800 mb-3">Developmental Insights</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-bold text-neutral-700">INSIGHTS SUMMARY</Text>
                <Text className="text-sm text-neutral-500 font-medium">Last 30 days</Text>
              </View>
              <LineChart
                data={{
                  labels: ["May 2", "May 7", "May 12", "May 17", "May 22", "May 27"],
                  datasets: [
                    { data: [20, 45, 28, 55, 39, 43], color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})` }, // Red
                    { data: [30, 25, 50, 40, 60, 55], color: (opacity = 1) => `rgba(250, 204, 21, ${opacity})` }, // Yellow
                    { data: [50, 40, 60, 35, 52, 29], color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})` }  // Blue
                  ]
                }}
                width={Dimensions.get('window').width - 60}
                height={180}
                withHorizontalLabels={false}
                withVerticalLines={false}
                withInnerLines={false}
                withOuterLines={false}
                chartConfig={{
                  backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff', decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                  propsForDots: { r: "0", strokeWidth: "0" }, strokeWidth: 2.5,
                }}
                bezier style={{ marginLeft: -15 }}
              />
              <View className="flex-row justify-center space-x-4 mt-4">
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1" /><Text className="text-xs text-neutral-500">Communicational</Text></View>
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-yellow-400 rounded-full mr-1 ml-1" /><Text className="text-xs text-neutral-500">Social Interaction</Text></View>
                <View className="flex-row items-center"><View className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-1 ml-1" /><Text className="text-xs text-neutral-500">Behavioral</Text></View>
              </View>
            </View>
          </View>

          <View className="px-5 mt-8">
            <Text className="text-xl font-bold text-neutral-800 mb-3">Learn More</Text>
            <LearnMoreCard />
            <LearnMoreCard />
          </View>
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
            <Text className="text-base text-neutral-600 mt-4">
              This short assessment will help us analyze key behavior patterns to provide insights tailored for your child. It's quick and easy to complete.
            </Text>
            <View className="mt-8 w-full">
              <Text className="font-bold text-neutral-700 text-lg mb-3">What to expect</Text>
              <Text className="text-base text-neutral-600 mb-2">• 8-10 Yes/No questions</Text>
              <Text className="text-base text-neutral-600 mb-2">• Takes less than 2 minutes</Text>
              <Text className="text-base text-neutral-600">• Personalized insights report at the end</Text>
            </View>
            <View className="mt-8">
              <Image
                source={require('../../assets/images/illustration.png')}
                className="w-70 h-70 rounded-md"
                resizeMode="contain"
              />
            </View>
          </View>
          <View className="p-6 items-center">
            <TouchableOpacity
              onPress={() => { setViewMode('questions'); setCurrentQuestionIndex(0); }}
              className="bg-blue-500 rounded-lg w-5/6 py-4 shadow-lg shadow-blue-500/30"
            >
              <Text className="text-white text-center font-bold text-lg">BEGIN ASSESSMENT</Text>

            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'questions') {
    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={handleBack} />

        {/* ## CHANGE 4: Question page layout updated to exact specification ## */}
        <View className="flex-1 justify-between">
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

            <View className="flex-row justify-center items-center space-x-2 mt-12">
              {QUESTIONS.map((_, index) => (
                <View key={index} className={`w-2.5 h-2.5 rounded-full ${index <= currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />
              ))}
            </View>
          </View>

          <View className="flex-row p-6 pb-8">
            <TouchableOpacity onPress={handleBack} className="flex-1 mr-2 py-4 rounded-2xl border-2 border-gray-300 bg-white items-center justify-center">
              <Text className="font-bold text-lg text-neutral-800">BACK</Text>
            </TouchableOpacity>
            {/* ## CHANGE 3: Button style updated ## */}
            <TouchableOpacity
              onPress={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`flex-1 ml-2 py-4 rounded-2xl bg-blue-500 items-center justify-center ${!answers[currentQuestion.id] && 'opacity-50'}`}
            >
              <Text className="font-bold text-lg text-white">{currentQuestionIndex === QUESTIONS.length - 1 ? 'SUBMIT' : 'NEXT'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

   if (viewMode === 'summary') {
    // A reusable component for the 3-step progress indicator, matching the design.
    const ProgressIndicator = () => (
      <View className="w-full max-w-sm px-2 mt-12">
        <Text className="text-center text-sm font-semibold text-gray-500 mb-4">
          This usually takes up to 5 mins
        </Text>
        <View className="flex-row items-start justify-center">
            {/* Step 1: Completed */}
            <View className="flex-1 items-center">
                <View className="w-6 h-6 bg-blue-500 rounded-md justify-center items-center">
                    <Ionicons name="checkmark-sharp" size={18} color="white" />
                </View>
                <Text className="text-[10px] font-semibold text-gray-700 mt-2 text-center">Questionnaire{'\n'}Review</Text>
            </View>
            
            {/* Connecting line (partially filled) */}
            <View className="flex-1 h-0.5 bg-gray-300 mt-3 mx-[-10px]">
              <View className="w-1/2 h-full bg-blue-500" />
            </View>

            {/* Step 2: Pending */}
            <View className="flex-1 items-center">
                <View className="w-6 h-6 rounded-full bg-gray-300" />
                <Text className="text-[10px] font-semibold text-gray-500 mt-2 text-center">Deep{'\n'}Analysis</Text>
            </View>

            {/* Connecting line (empty) */}
            <View className="flex-1 h-0.5 bg-gray-300 mt-3 mx-[-10px]" />

            {/* Step 3: Pending */}
            <View className="flex-1 items-center">
                <View className="w-6 h-6 rounded-full bg-gray-300" />
                <Text className="text-[10px] font-semibold text-gray-500 mt-2 text-center">Report{'\n'}Generation</Text>
            </View>
        </View>
      </View>
    );

    return (
      <SafeAreaView className="flex-1 bg-[#F0F8FF]">
        <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <AppHeader onBack={() => setViewMode('insightsReport')} />
        
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="items-center mt-5 px-5">
            <Image
              source={require('../../assets/images/family.png')} // Make sure this path is correct
              className="w-38 h-33"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-neutral-800 text-center mt-4">
              Assessment submitted successfully
            </Text>
            <Text className="text-base text-neutral-500 text-center mt-4 mx-4">
              We've received your child's questionnaire response. Our AI and expert-backed analysis is underway to create a personalized insight report.
            </Text>
            
            <ProgressIndicator />
          </View>
        </ScrollView>
        
        {/* Action Buttons Container */}
        <View className="px-6 pt-4 pb-6 bg-white/0 items-center">
          {/* --- MODIFIED THIS BUTTON --- */}
          <TouchableOpacity 
             onPress={() => router.push('./')} // Navigates to index.tsx
             className="bg-blue-500 w-5/6 py-4 rounded-lg shadow-lg shadow-blue-500/30"
          >
            <Text className="text-white text-center font-bold text-base">GO TO HOME</Text>
          </TouchableOpacity>
          
          {/* --- THIS BUTTON'S LOGIC IS CORRECT --- */}
          <TouchableOpacity 
            onPress={() => setViewMode('insightsReport')} // Switches back to the main view of insights.tsx
            className="bg-white w-5/6 py-4 rounded-lg mt-3 border border-gray-300"
          >
            <Text className="text-neutral-800 text-center font-bold text-base">VIEW PREVIOUS REPORTS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

export default InsightsScreen;