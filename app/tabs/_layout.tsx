import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * This is the layout for the main tab navigator.
 * It defines the tabs, their order, icons, and appearance.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // CHANGE 1: This line removes the header that says "tabs"
        headerShown: false, 
        
        tabBarActiveTintColor: '#2A62CC',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* CHANGE 2: The order of these blocks now determines the order in the UI. */}

      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />

      {/* 2. Add Tab (Now a standard icon) */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Check In', // We give it a title now
          // CHANGE 3: We use a standard tabBarIcon, not a custom button.
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={28} color={color} />,
        }}
      />

      {/* 3. Insights Tab */}
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />

      {/* 4. Forums Tab */}
      <Tabs.Screen
        name="forums"
        options={{
          title: 'Forums',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="forum" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // We no longer need the custom button styles, so the code is much cleaner!
});