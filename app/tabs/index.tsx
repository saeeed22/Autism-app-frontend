import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
  TextInput,
  Modal,
  ActivityIndicator, // Added for loading state
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

// --- API Configuration ---
const API_BASE_URL = 'https://your-backend-api.com/api'; // <-- IMPORTANT: REPLACE WITH YOUR API

// --- Types and Constants ---

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: ImageSourcePropType; // This will need to be handled, assuming backend sends a URL
  rating: number;
  reviews: number;
  patients: string;
  experience: string;
  about: string;
  workingTime: string;
  education: string;
  areaOfFocus: string[];
};

type Appointment = {
  id: string;
  doctorId: string;
  datetime: Date; // Note: API will send this as a string, we need to convert it
  status: 'upcoming' | 'completed';
};

// DUMMY DATA IS REMOVED as it will be fetched from the API.

const TIME_SLOTS = [
  '09.00 AM', '09.30 AM', '10.00 AM', '10.30 AM',
  '11.00 AM', '11.30 AM', '03.00 PM', '03.30 PM',
  '04.00 PM', '04.30 PM', '05.00 PM', '05.30 PM',
];

const figmaBlueGradient = ['#3B82F6', '#2563EB'] as const;

// --- Helper Functions ---

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) +
  ' - ' +
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

// --- Home Screen Component (No changes here) ---

const HomeScreenHeader = () => (
    <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
      <View>
        <Text className="text-blue-500 text-base">Good Morning!</Text>
        <Text className="text-2xl font-bold text-gray-800">Saeed!</Text>
      </View>
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

const QuickToolButton: React.FC<{ iconSource: ImageSourcePropType; label: string; onPress: () => void; }> = ({ iconSource, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 rounded-2xl p-3 items-center justify-center aspect-square shadow-sm overflow-hidden"
    >
      <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
      <Image source={iconSource} className="w-10 h-10" resizeMode="contain" />
      <Text className="text-white font-bold text-center mt-2 text-sm leading-tight">{label}</Text>
    </TouchableOpacity>
);

const HomeScreen: React.FC<{ onNavigateToAppointments: () => void; }> = ({ onNavigateToAppointments }) => {
    const router = useRouter();
  
    return (
      <SafeAreaView className="flex-1 bg-[#E0F2FE]">
        <LinearGradient colors={['#E0F2FE', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
        <HomeScreenHeader />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="px-4 mt-4">
            {/* Daily Check-in Card */}
            <View className="rounded-3xl p-5 shadow-lg shadow-blue-400/30 overflow-hidden">
              <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
              <View className="flex-row items-center">
                <Image source={require('../../assets/images/recording_icon.png')} className="w-20 h-20 mr-4" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold">Daily Check-In</Text>
                  <Text className="text-white/90 text-sm mt-1 leading-5">Captures your child's day with photos or videos</Text>
                  <TouchableOpacity onPress={() => router.push('/tabs/add')} className="bg-white rounded-full py-3 px-8 mt-4 self-start">
                    <Text className="text-blue-500 font-bold text-sm tracking-wider uppercase">Check-in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  
            {/* Insight Reports Card */}
            <View className="rounded-3xl p-5 mt-4 shadow-lg shadow-blue-400/30 overflow-hidden">
              <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
              <View className="flex-row items-center">
                <Image source={require('../../assets/images/insights_icon.png')} className="w-20 h-20 mr-4" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold">Insight Reports</Text>
                  <Text className="text-white/90 text-sm mt-1 leading-5">Get expert-level insights by answering questions...</Text>
                  <TouchableOpacity onPress={() => router.push('/tabs/insights')} className="bg-white rounded-full py-3 px-8 mt-4 self-start">
                    <Text className="text-blue-500 font-bold text-sm tracking-wider uppercase">Start Assessment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  
            {/* Forums and Appointment Cards */}
            <View className="flex-row mt-8 gap-4">
              <TouchableOpacity onPress={() => router.push('/tabs/forums')} className="flex-1 rounded-3xl py-4 px-4 shadow-lg shadow-blue-400/20 overflow-hidden items-center">
                <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
                <Image source={require('../../assets/images/consult_icon.png')} className="w-14 h-14" resizeMode="contain" />
                <Text className="text-white text-lg font-bold mt-2">Forums</Text>
                <Text className="text-white/90 text-xs text-center mt-1 leading-4">Community forums to share and learn</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onNavigateToAppointments} className="flex-1 rounded-3xl py-4 px-4 shadow-lg shadow-blue-400/20 overflow-hidden items-center">
                <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
                <Image source={require('../../assets/images/consult_icon.png')} className="w-14 h-14" resizeMode="contain" />
                <Text className="text-white text-lg font-bold mt-2">Appointment</Text>
                <Text className="text-white/90 text-xs text-center mt-1 leading-4">Get expert advice through online consultation</Text>
              </TouchableOpacity>
            </View>
  
            {/* Quick Tools */}
            <View className="bg-white rounded-3xl p-5 mt-8 shadow-md shadow-slate-300">
              <View className="flex-row items-center mb-4">
                <Ionicons name="settings-outline" size={24} color="#374151" />
                <Text className="text-xl font-bold text-gray-800 ml-2">Quick Tools</Text>
              </View>
              <Text className="text-gray-600 text-sm mb-5">Manage your child's behaviors, past stories, and learning activities</Text>
              <View className="flex-row gap-4">
                <QuickToolButton iconSource={require('../../assets/images/quicktool_1.png')} label={"Update\nBehaviours"} onPress={() => { }} />
                <QuickToolButton iconSource={require('../../assets/images/quicktool_2.png')} label="Story History" onPress={() => { }} />
                <QuickToolButton iconSource={require('../../assets/images/quicktool_3.png')} label="Daily Activities" onPress={() => { }} />
              </View>
            </View>
  
            {/* Activity Overview */}
            <View className="bg-white rounded-3xl p-5 mt-8 shadow-md shadow-slate-300">
              <View className="flex-row items-center mb-4">
                <Ionicons name="eye-outline" size={24} color="#374151" />
                <Text className="text-xl font-bold text-gray-800 ml-2">Activity Overview</Text>
              </View>
              <Text className="text-gray-600 text-sm mb-5">See how consistently you've shared stories and track your child's insight progress</Text>
              <View className="flex-row gap-4">
                <View className="flex-1 rounded-2xl p-3 shadow-sm overflow-hidden items-center">
                  <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
                  <Text className="text-white text-xl font-bold mb-1">0/30</Text>
                  <Text className="text-white font-bold text-base text-center">Daily Story Activity</Text>
                  <Text className="text-white/80 text-sm text-center mt-1">Days with story entries in the last 30 days</Text>
                </View>
                <View className="flex-1 rounded-2xl p-3 shadow-sm overflow-hidden items-center justify-center">
                  <LinearGradient colors={figmaBlueGradient} style={StyleSheet.absoluteFillObject} />
                  <Text className="text-white font-bold text-xl text-center">Activities Summary</Text>
                  <Text className="text-white/80 text-sm text-center mt-2">0 Daily activities completed</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
};
// --- Appointment Flow Components ---

type AppointmentFlowProps = { onGoBackToHome: () => void; };
type AppointmentViewMode = 'appointmentList' | 'doctorDetail' | 'selectDate' | 'myAppointments';

// --- Header Component ---
type AppointmentHeaderProps = {
  onBack?: () => void;
  title?: string;
};

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({ onBack, title }) => (
  <View className="flex-row justify-between items-center px-4 pt-8-2 h-16">
    <View className="w-1/3">
      {onBack && (
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} className="self-start">
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
      )}
    </View>
    <View className="w-1/3 items-center">
      {title && <Text className="text-xl font-bold text-neutral-800">{title}</Text>}
    </View>
    <View className="w-1/3 flex-row items-center justify-end space-x-4">
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

// --- Appointment List View ---
type AppointmentListProps = {
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onGoToMyAppointments: () => void;
  doctors: Doctor[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const AppointmentList: React.FC<AppointmentListProps> = ({ onBack, onSelectDoctor, onGoToMyAppointments, doctors, searchTerm, setSearchTerm }) => (
  <>
    <AppointmentHeader onBack={onBack} />
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-5">
        <Text className="text-5xl font-bold text-neutral-800 text-center">Book An{'\n'}Appointment</Text>
        <View className="w-full h-44 rounded-2xl mt-4 overflow-hidden relative bg-blue-500">
          <LinearGradient colors={['#3B82F6', '#2563EB']} style={StyleSheet.absoluteFillObject} />
          <View className="absolute left-0 top-0 bottom-0 justify-center p-5 w-3/5">
            <Text className="text-white text-2xl font-bold leading-tight">Looking For Specialist {'\n'} Doctors?</Text>
            <Text className="text-white/90 text-sm mt-2 leading-snug">"Schedule a session with a specialist to get expert advice and support for your child."</Text>
          </View>
          <Image source={require('../../assets/images/promo_doctor.png')} className="absolute -bottom-2 right-0 w-[80%] h-full" resizeMode="contain" />
        </View>
        <View className="py-4">
          <View className="bg-white rounded-full flex-row items-center px-4 py-3 shadow-sm border border-gray-200">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput value={searchTerm} onChangeText={setSearchTerm} placeholder="Search doctor..." className="flex-1 ml-2 text-base" />
          </View>
          <TouchableOpacity className="bg-blue-500 rounded-lg py-4 mt-4">
            <Text className="text-white font-bold text-center text-base">FIND A SPECIALIST</Text>
          </TouchableOpacity>
          <View className="flex-row justify-between items-center mt-4">
            <Text className="font-semibold text-neutral-700">{doctors.length} Found</Text>
            <TouchableOpacity><Text className="font-semibold text-blue-500">Sort By </Text></TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="px-5 pt-0">
        {doctors.map(doc => (
          <TouchableOpacity key={doc.id} onPress={() => onSelectDoctor(doc)} className="bg-white rounded-xl p-4 mb-4 shadow-md flex-row items-center">
             {/* Assuming avatar is a URL from the API */}
            <Image source={{ uri: doc.avatar as string }} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-neutral-800">{doc.name}</Text>
              <Text className="text-sm text-neutral-600">{doc.specialty}</Text>
              <Text className="text-xs text-neutral-500 mt-1">{doc.location}</Text>
              <Text className="text-xs text-blue-500 font-semibold mt-1">{doc.reviews} Reviews</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    <TouchableOpacity onPress={onGoToMyAppointments} className="absolute bottom-5 right-5 bg-blue-500 rounded-lg px-5 py-3 shadow-lg flex-row items-center">
      <Ionicons name="calendar-outline" size={20} color="white" />
      <Text className="text-white font-bold ml-2">View My Appointments</Text>
    </TouchableOpacity>
  </>
);

// --- Doctor Detail View ---
type DoctorDetailProps = {
  doctor: Doctor | null;
  onBack: () => void;
  onGoToBooking: () => void;
};

const DoctorDetail: React.FC<DoctorDetailProps> = ({ doctor, onBack, onGoToBooking }) => {
  if (!doctor) return null;
  return (
    <>
      <AppointmentHeader onBack={onBack} title="Doctor Details" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-5">
          <View className="bg-white rounded-xl p-4 shadow-md flex-row items-center">
            <Image source={{ uri: doctor.avatar as string }} className="w-20 h-20 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-xl font-bold text-neutral-800">{doctor.name}</Text>
              <Text className="text-base text-neutral-600">{doctor.specialty}</Text>
              <Text className="text-sm text-neutral-500 mt-1">{doctor.location}</Text>
            </View>
          </View>
          <View className="flex-row justify-around bg-blue-50 rounded-xl p-4 mt-4">
            <View className="items-center"><Text className="text-blue-600 font-bold text-lg">{doctor.patients}</Text><Text className="text-neutral-600 text-xs">patients</Text></View>
            <View className="items-center"><Text className="text-blue-600 font-bold text-lg">{doctor.experience}</Text><Text className="text-neutral-600 text-xs">experience</Text></View>
            <View className="items-center"><Text className="text-blue-600 font-bold text-lg">{doctor.rating}</Text><Text className="text-neutral-600 text-xs">rating</Text></View>
            <View className="items-center"><Text className="text-blue-600 font-bold text-lg">{doctor.reviews}</Text><Text className="text-neutral-600 text-xs">reviews</Text></View>
          </View>
          <View className="mt-6"><Text className="text-xl font-bold text-neutral-800 mb-2">About Me</Text><Text className="text-base text-neutral-600 leading-6">{doctor.about}</Text></View>
          <View className="mt-6"><Text className="text-xl font-bold text-neutral-800 mb-2">Working Time</Text><Text className="text-base text-neutral-600">{doctor.workingTime}</Text></View>
          <View className="mt-6"><Text className="text-xl font-bold text-neutral-800 mb-2">Education & Training</Text><Text className="text-base text-neutral-600 leading-6">{doctor.education}</Text></View>
          <View className="mt-6"><Text className="text-xl font-bold text-neutral-800 mb-2">Area Of Focus</Text><Text className="text-base text-neutral-600 leading-6">{doctor.areaOfFocus.join(', ')}</Text></View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 border-t border-gray-200">
        <TouchableOpacity onPress={onGoToBooking} className="bg-blue-500 rounded-lg py-4">
          <Text className="text-white font-bold text-center text-base">SELECT APPOINTMENT DATE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

// --- Date Selection View ---
type SelectDateProps = {
  onBack: () => void;
  onConfirm: () => void;
  currentCalendarDate: Date;
  setCurrentCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  selectedTime: string | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
};

const SelectDate: React.FC<SelectDateProps> = ({ onBack, onConfirm, currentCalendarDate, setCurrentCalendarDate, selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => {
    const monthName = currentCalendarDate.toLocaleString('default', { month: 'long' });
    const year = currentCalendarDate.getFullYear();
    const daysInMonth = new Date(year, currentCalendarDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, currentCalendarDate.getMonth(), 1).getDay();
    const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    const handleMonthChange = (direction: 'next' | 'prev') => {
      setCurrentCalendarDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
    };
  
    return (
      <>
        <AppointmentHeader onBack={onBack} title="Select Date" />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="p-5">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => handleMonthChange('prev')} className="p-2"><Ionicons name="chevron-back" size={24} color="black" /></TouchableOpacity>
              <Text className="text-lg font-bold">{monthName} {year}</Text>
              <TouchableOpacity onPress={() => handleMonthChange('next')} className="p-2"><Ionicons name="chevron-forward" size={24} color="black" /></TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {dayHeaders.map((day, index) => <Text key={`${day}-${index}`} className="w-1/7 text-center font-semibold text-gray-400 mb-2" style={{ width: '14.2%' }}>{day}</Text>)}
            </View>
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => (
                <View key={`day-${index}`} className="items-center justify-center p-1" style={{ width: '14.2%' }}>
                  {day && (
                    <TouchableOpacity
                      onPress={() => setSelectedDate(new Date(year, currentCalendarDate.getMonth(), day))}
                      className={`w-9 h-9 rounded-full items-center justify-center ${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentCalendarDate.getMonth() ? 'bg-blue-500' : ''}`}
                    >
                      <Text className={`${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentCalendarDate.getMonth() ? 'text-white' : 'text-black'} font-bold`}>{day}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            <Text className="text-xl font-bold text-neutral-800 mt-8 mb-4">Select Hour</Text>
            <View className="flex-row flex-wrap justify-between">
              {TIME_SLOTS.map(time => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`rounded-lg py-3 mb-3 border-2 ${selectedTime === time ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
                  style={{ width: '31%' }}
                >
                  <Text className={`text-center font-semibold ${selectedTime === time ? 'text-white' : 'text-neutral-700'}`}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <View className="p-5 bg-white/80 border-t border-gray-200">
          <TouchableOpacity
            onPress={onConfirm}
            disabled={!selectedDate || !selectedTime}
            className={`rounded-lg py-4 ${(!selectedDate || !selectedTime) ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-bold text-center text-base">CONFIRM APPOINTMENT</Text>
          </TouchableOpacity>
        </View>
      </>
    );
};
// --- My Appointments View ---
type MyAppointmentsHandlers = {
  handleCancelAppointment: (id: string) => void;
  handleReschedule: (app: Appointment) => void;
  handleRebook: (app: Appointment) => void;
  handleOpenRating: (app: Appointment) => void;
};
type MyAppointmentsProps = {
  onBack: () => void;
  appointments: Appointment[];
  doctors: Doctor[];
  handlers: MyAppointmentsHandlers;
};

const MyAppointments: React.FC<MyAppointmentsProps> = ({ onBack, appointments, doctors, handlers }) => {
  const { handleCancelAppointment, handleReschedule, handleRebook, handleOpenRating } = handlers;
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const filteredAppointments = appointments.filter(a => a.status === tab);

  const AppointmentCard: React.FC<{ app: Appointment }> = ({ app }) => {
    const doctor = doctors.find(doc => doc.id === app.doctorId);
    if (!doctor) return null;
    return (
      <View className="bg-white rounded-xl shadow-md p-4 mb-4">
        <Text className="font-semibold text-blue-600 mb-3">{formatDate(app.datetime)}</Text>
        <View className="flex-row items-center border-t border-gray-100 pt-3">
          <Image source={{ uri: doctor.avatar as string }} className="w-16 h-16 rounded-lg mr-4" />
          <View className="flex-1">
            <Text className="text-lg font-bold text-neutral-800">{doctor.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={14} color="gray" />
              <Text className="text-sm text-neutral-600 ml-1">{doctor.location}</Text>
            </View>
          </View>
        </View>
        {tab === 'upcoming' ? (
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity onPress={() => handleCancelAppointment(app.id)} className="flex-1 border border-gray-300 rounded-lg py-2 mr-2"><Text className="text-center font-bold text-neutral-700">CANCEL</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleReschedule(app)} className="flex-1 bg-blue-500 rounded-lg py-2 ml-2"><Text className="text-center font-bold text-white">RESCHEDULE</Text></TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity onPress={() => handleRebook(app)} className="flex-1 border border-gray-300 rounded-lg py-2 mr-2"><Text className="text-center font-bold text-neutral-700">RE-BOOK</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleOpenRating(app)} className="flex-1 bg-blue-500 rounded-lg py-2 ml-2"><Text className="text-center font-bold text-white">GIVE RATING</Text></TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <AppointmentHeader onBack={onBack} title="My Appointments" />
      <View className="flex-row p-5">
        <TouchableOpacity onPress={() => setTab('upcoming')} className="flex-1 pb-2 items-center border-b-2" style={{ borderColor: tab === 'upcoming' ? '#3B82F6' : 'transparent' }}>
          <Text className={`font-bold text-lg ${tab === 'upcoming' ? 'text-blue-600' : 'text-gray-500'}`}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('completed')} className="flex-1 pb-2 items-center border-b-2" style={{ borderColor: tab === 'completed' ? '#3B82F6' : 'transparent' }}>
          <Text className={`font-bold text-lg ${tab === 'completed' ? 'text-blue-600' : 'text-gray-500'}`}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(app => <AppointmentCard key={app.id} app={app} />)
        ) : (
          <Text className="text-center text-gray-500 mt-20">No {tab} appointments.</Text>
        )}
      </ScrollView>
    </>
  );
};

// --- Modal Components (No changes here) ---
type ConfirmationModalProps = {
    visible: boolean;
    onClose: () => void;
    onDone: () => void;
    doctor: Doctor | null;
    date: Date | null;
    time: string | null;
};
  
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ visible, onClose, onDone, doctor, date, time }) => (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 bg-white rounded-3xl p-6 items-center">
          <View className="bg-blue-500 rounded-full w-20 h-20 items-center justify-center mb-5">
            <Ionicons name="checkmark-sharp" size={50} color="white" />
          </View>
          <Text className="text-2xl font-bold text-neutral-800 text-center mb-2">Congratulations!</Text>
          <Text className="text-base text-neutral-600 text-center mb-6">
            Your appointment with {doctor?.name} is confirmed for {date?.toLocaleDateString()} at {time}.
          </Text>
          <TouchableOpacity onPress={onDone} className="bg-blue-500 rounded-lg w-full py-4">
            <Text className="text-white text-center font-bold">DONE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="mt-3">
            <Text className="text-blue-500 font-semibold">Edit your appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);
  
type RatingModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    doctor: Doctor | null;
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
};
  
const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onSubmit, doctor, rating, setRating }) => (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 bg-white rounded-3xl p-6 items-center">
          <Text className="text-2xl font-bold text-neutral-800 text-center mb-2">Give Your Rating!</Text>
          <Text className="text-base text-neutral-600 text-center mb-4">
            Please rate your experience with{'\n'}Dr. {doctor?.name}.
          </Text>
          <View className="flex-row space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons name="star" size={36} color={star <= rating ? '#FFC107' : '#E0E0E0'} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onSubmit} className="bg-blue-500 rounded-lg w-full py-4">
            <Text className="text-white text-center font-bold">SUBMIT RATING</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
);
// --- Main Appointment Flow Logic (MODIFIED) ---
const AppointmentFlow: React.FC<AppointmentFlowProps> = ({ onGoBackToHome }) => {
  const [viewMode, setViewMode] = useState<AppointmentViewMode>('appointmentList');
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  
  // State for data fetched from API
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch doctors and appointments in parallel
        const [doctorsResponse, appointmentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/doctors`),
          fetch(`${API_BASE_URL}/appointments`) // Assuming this fetches for the logged-in user
        ]);

        if (!doctorsResponse.ok || !appointmentsResponse.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const doctorsData = await doctorsResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        // Convert date strings from API to Date objects
        const processedAppointments = appointmentsData.map((app: any) => ({
          ...app,
          datetime: new Date(app.datetime),
        }));

        setDoctors(doctorsData);
        setAppointments(processedAppointments);

      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = useMemo(() =>
    doctors.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [doctors, searchTerm]
  );

  const handleSelectDoctor = (doctor: Doctor) => {
    setActiveDoctor(doctor);
    setViewMode('doctorDetail');
  };

  const handleGoToBooking = () => {
    if (activeAppointment) {
      setCurrentCalendarDate(activeAppointment.datetime);
      setSelectedDate(activeAppointment.datetime);
    } else {
      const today = new Date();
      setCurrentCalendarDate(today);
      setSelectedDate(today);
    }
    setViewMode('selectDate');
  };

  const handleConfirmAppointment = async () => {
    if (!activeDoctor || !selectedDate || !selectedTime) return;
    
    // Convert selected time to a full Date object
    const [time, period] = selectedTime.split(' ');
    let [h, m] = time.split('.').map(Number);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(h, m, 0, 0);

    const appointmentPayload = {
        doctorId: activeDoctor.id,
        datetime: finalDateTime.toISOString(), // Send as ISO string
    };

    try {
        let response;
        if (activeAppointment) { // This is a reschedule (UPDATE)
            response = await fetch(`${API_BASE_URL}/appointments/${activeAppointment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ datetime: appointmentPayload.datetime }),
            });
        } else { // This is a new booking (CREATE)
            response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentPayload),
            });
        }

        if (!response.ok) throw new Error('Failed to save appointment.');
        
        const savedAppointment = await response.json();
        // Update local state with the response from the server
        const updatedAppointment = { ...savedAppointment, datetime: new Date(savedAppointment.datetime) };

        if (activeAppointment) {
            setAppointments(p => p.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
        } else {
            setAppointments(p => [updatedAppointment, ...p]);
        }

        setConfirmationModalVisible(true);

    } catch (err: any) {
        alert(`Error: ${err.message}`);
    }
  };

  const myAppointmentHandlers: MyAppointmentsHandlers = {
    handleCancelAppointment: async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to cancel appointment.');
            setAppointments(p => p.filter(a => a.id !== id));
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    },
    handleReschedule: (app: Appointment) => {
      const doc = doctors.find(d => d.id === app.doctorId);
      if (doc) { setActiveAppointment(app); setActiveDoctor(doc); handleGoToBooking(); }
    },
    handleRebook: (app: Appointment) => {
      const doc = doctors.find(d => d.id === app.doctorId);
      if (doc) { setActiveAppointment(null); setActiveDoctor(doc); handleGoToBooking(); }
    },
    handleOpenRating: (app: Appointment) => {
      const doc = doctors.find(d => d.id === app.doctorId);
      if (doc) { setActiveAppointment(app); setActiveDoctor(doc); setCurrentRating(0); setRatingModalVisible(true); }
    },
  };

  const handleSubmitRating = async () => {
    if (!activeAppointment) return;
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${activeAppointment.id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: currentRating })
        });
        if (!response.ok) throw new Error('Failed to submit rating.');
        
        alert(`Thank you for rating Dr. ${activeDoctor?.name}!`);
        setRatingModalVisible(false);
    } catch (err: any) {
        alert(`Error: ${err.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#3B82F6" /><Text className="mt-4 text-gray-600">Loading appointments...</Text></View>;
    }
    if (error) {
        return <View className="flex-1 justify-center items-center"><Text className="text-red-500">{error}</Text></View>
    }

    switch (viewMode) {
      case 'appointmentList':
        return <AppointmentList
          onBack={onGoBackToHome}
          onSelectDoctor={handleSelectDoctor}
          onGoToMyAppointments={() => setViewMode('myAppointments')}
          doctors={filteredDoctors}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />;
      case 'doctorDetail':
        return <DoctorDetail
          doctor={activeDoctor}
          onBack={() => setViewMode('appointmentList')}
          onGoToBooking={handleGoToBooking}
        />;
      case 'selectDate':
        return <SelectDate
          onBack={() => setViewMode('doctorDetail')}
          onConfirm={handleConfirmAppointment}
          currentCalendarDate={currentCalendarDate}
          setCurrentCalendarDate={setCurrentCalendarDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />;
      case 'myAppointments':
        return <MyAppointments
          onBack={() => setViewMode('appointmentList')}
          appointments={appointments}
          doctors={doctors}
          handlers={myAppointmentHandlers}
        />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F8FF]">
      <LinearGradient colors={['#EBF5FF', '#FFFFFF']} locations={[0, 0.4]} style={StyleSheet.absoluteFill} />
      {renderContent()}
      <ConfirmationModal
        visible={isConfirmationModalVisible}
        onClose={() => setConfirmationModalVisible(false)}
        onDone={() => { setConfirmationModalVisible(false); setViewMode('myAppointments'); }}
        doctor={activeDoctor}
        date={selectedDate}
        time={selectedTime}
      />
      <RatingModal
        visible={isRatingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={handleSubmitRating}
        doctor={activeDoctor}
        rating={currentRating}
        setRating={setCurrentRating}
      />
    </SafeAreaView>
  );
};

// --- Main Page Component (No changes here) ---

const IndexPage = () => {
    const [viewMode, setViewMode] = useState<'home' | 'appointment'>('home');
  
    // Reset to home screen when the tab is focused
    useFocusEffect(React.useCallback(() => {
      setViewMode('home');
    }, []));
  
    if (viewMode === 'appointment') {
      return <AppointmentFlow onGoBackToHome={() => setViewMode('home')} />;
    }
  
    return <HomeScreen onNavigateToAppointments={() => setViewMode('appointment')} />;
};
  
export default IndexPage;