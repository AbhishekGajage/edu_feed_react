// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { useUser } from '../lib/providers/UserProvider';

export default function TabLayout() {
  const { user } = useUser();

  console.log('📱 Tabs layout - User:', user?.username, 'Role:', user?.role);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="shorts" options={{ title: 'Shorts' }} />
      
      {/* Conditionally show teacher tab */}
      <Tabs.Screen 
        name="teacher-dashboard" 
        options={{
          title: 'Teacher',
          href: user?.role === 'teacher' ? '/teacher-dashboard' : null
        }}
      />
      
      {/* Conditionally show authenticator tab */}
      <Tabs.Screen 
        name="authenticator-moderation" 
        options={{
          title: 'Moderate',
          href: user?.role === 'authenticator' ? '/authenticator-moderation' : null
        }}
      />
      
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}