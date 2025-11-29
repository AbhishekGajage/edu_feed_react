// components/LearningEnvironments.tsx
import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../constants/color';

const LearningEnvironments = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');

  const environments = [
    {
      id: 'space',
      name: 'Cosmic Library',
      emoji: '🚀',
      background: require('../assets/images/space-bg.jpg'), // You'll need these images
      description: 'Study among stars and galaxies',
      subjects: ['Astronomy', 'Physics', 'Mathematics'],
      ambientSound: 'space',
    },
    {
      id: 'forest',
      name: 'Ancient Forest',
      emoji: '🌳',
      background: require('../assets/images/forest-bg.jpg'),
      description: 'Learn in peaceful natural surroundings',
      subjects: ['Biology', 'Ecology', 'Literature'],
      ambientSound: 'forest',
    },
    {
      id: 'ocean',
      name: 'Deep Sea Lab',
      emoji: '🐠',
      background: require('../assets/images/ocean-bg.jpg'),
      description: 'Explore knowledge in ocean depths',
      subjects: ['Marine Biology', 'Chemistry', 'Geography'],
      ambientSound: 'ocean',
    },
    {
      id: 'future',
      name: 'Neon City 2084',
      emoji: '🏙️',
      background: require('../assets/images/future-bg.jpg'),
      description: 'High-tech learning in futuristic city',
      subjects: ['Technology', 'Programming', 'AI'],
      ambientSound: 'future',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Learning Environments</Text>
      <Text style={styles.subtitle}>Choose your perfect study atmosphere</Text>

      {environments.map((env) => (
        <TouchableOpacity 
          key={env.id}
          style={styles.environmentCard}
          onPress={() => setSelectedEnvironment(env.id)}
        >
          <ImageBackground 
            source={env.background}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
          >
            <View style={styles.overlay}>
              <Text style={styles.environmentEmoji}>{env.emoji}</Text>
              <Text style={styles.environmentName}>{env.name}</Text>
              <Text style={styles.environmentDescription}>{env.description}</Text>
              
              <View style={styles.subjects}>
                {env.subjects.map((subject, index) => (
                  <View key={index} style={styles.subjectTag}>
                    <Text style={styles.subjectText}>{subject}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.features}>
                <Text style={styles.feature}>🌙 Ambient Sounds</Text>
                <Text style={styles.feature}>🎵 Focus Music</Text>
                <Text style={styles.feature}>⏰ Pomodoro Timer</Text>
              </View>

              <TouchableOpacity style={styles.enterButton}>
                <Text style={styles.enterButtonText}>Enter Environment</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    textAlign: 'center',
    marginBottom: 24,
  },
  environmentCard: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  environmentEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  environmentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  environmentDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
  },
  subjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  subjectTag: {
    backgroundColor: Colors.blueColor,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  feature: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  enterButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LearningEnvironments;