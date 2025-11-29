// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { UserProvider } from './lib/providers/UserProvider';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </UserProvider>
  );
}