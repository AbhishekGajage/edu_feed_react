// app/about.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About EduGram</Text>
        <Text style={styles.subtitle}>Your Learning Companion</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is EduGram?</Text>
          <Text style={styles.description}>
            EduGram is a social learning platform designed to help students 
            connect, share knowledge, and grow together in their educational journey.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.feature}>• Share educational content</Text>
          <Text style={styles.feature}>• Connect with peers</Text>
          <Text style={styles.feature}>• Discover opportunities</Text>
          <Text style={styles.feature}>• Track learning progress</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#667EEA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});