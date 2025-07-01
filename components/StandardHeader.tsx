// components/StandardHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- TYPES ---
type ViewMode =
  | 'home'
  | 'appointment'
  | 'checkinHistory'
  | 'parentTips'
  | 'profile'
  | 'settings'
  | 'faq'
  | 'notifications';

interface StandardHeaderProps {
  title: string;
  onBack: () => void;
  setViewMode: (mode: ViewMode) => void;
}

const DUMMY_USER = {
  name: 'Hazim Khan',
  email: 'hazimkhan@gmail.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=hazimkhan',
};

const StandardHeader: React.FC<StandardHeaderProps> = ({ title, onBack, setViewMode }) => {
  return (
    <View className="flex-row items-center justify-between px-4 h-20">
      <View className="w-1/3">
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="self-start"
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>
      <View className="w-1/3 items-center">
        <Text className="text-xl font-bold text-neutral-800">{title}</Text>
      </View>
      <View className="w-1/3 flex-row items-center justify-end space-x-2">
        <TouchableOpacity
          onPress={() => setViewMode('notifications')}
          className="relative bg-white rounded-full p-2 shadow-sm"
        >
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('profile')}>
          <Image source={{ uri: DUMMY_USER.avatarUrl }} className="w-10 h-10 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StandardHeader;
