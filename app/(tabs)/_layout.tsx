// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useUser } from '../lib/providers/UserProvider';

export default function TabLayout() {
  const { user } = useUser();

  console.log('📱 Tabs layout - User:', user?.username, 'Role:', user?.role);

  const getTabIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'home':
        return `🏠`;
      case 'search':
        return `🔍`;
      case 'shorts':
        return `🎬`;
      case 'opportunities':
        return `💼`;
      case 'teacher-dashboard':
        return `👨‍🏫`;
      case 'authenticator-moderation':
        return `✅`;
      case 'profile':
        return `👤`;
      default:
        return `📱`;
    }
  };

  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        return (
          <Text style={{ fontSize: 24, color: focused ? '#007AFF' : '#8E8E93' }}>
            {getTabIcon(route.name, focused)}
          </Text>
        );
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    })}>
      {/* Essential tabs for everyone */}
      <Tabs.Screen 
        name="home" 
        options={{ title: 'Home' }} 
      />
      
      <Tabs.Screen 
        name="search" 
        options={{ title: 'Search' }} 
      />
      
      <Tabs.Screen 
        name="shorts" 
        options={{ title: 'Shorts' }} 
      />
      
      <Tabs.Screen 
        name="opportunities" 
        options={{ title: 'Opportunities' }} 
      />
      
      {/* Teacher tab - only for teachers */}
      <Tabs.Screen 
        name="teacher-dashboard" 
        options={{
          title: 'Teacher',
          href: user?.role === 'teacher' ? '/teacher-dashboard' : null
        }}
      />
      
      {/* Authenticator tab - only for authenticators */}
      <Tabs.Screen 
        name="authenticator-moderation" 
        options={{
          title: 'Moderate',
          href: user?.role === 'authenticator' ? '/authenticator-moderation' : null
        }}
      />
      
      {/* Profile for everyone */}
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile' }} 
      />

      {/* Hide unnecessary tabs */}
      <Tabs.Screen 
        name="index" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="digital-wellbeing" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="learning-progress" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="screen-time" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="settings" 
        options={{ href: null }} 
      />
    </Tabs>
  );
}