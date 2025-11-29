// app/index.tsx - SIMPLE VERSION
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  console.log('🏠 Root index - redirecting to login');
  return <Redirect href="/splash" />;
}