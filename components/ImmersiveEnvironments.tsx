// components/ImmersiveEnvironments.tsx
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { Colors } from '../constants/color';

const ImmersiveEnvironments = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [ambientSound, setAmbientSound] = useState(false);
  const [focusMusic, setFocusMusic] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();

  const environments = [
    {
      id: 'space',
      name: 'Cosmic Library 🚀',
      description: 'Study among stars and galaxies with cosmic ambient sounds',
      background: '#0A0F2D',
      gradient: ['#0A0F2D', '#1A237E'],
      emoji: '🌌',
      sound: 'space',
      subjects: ['Astronomy', 'Physics', 'Mathematics'],
      features: ['Twinkling Stars', 'Cosmic Sounds', 'Infinite Space']
    },
    {
      id: 'forest',
      name: 'Ancient Forest 🌳',
      description: 'Learn in peaceful natural surroundings with forest sounds',
      background: '#1B5E20',
      gradient: ['#1B5E20', '#4CAF50'],
      emoji: '🍃',
      sound: 'forest',
      subjects: ['Biology', 'Ecology', 'Literature'],
      features: ['Bird Sounds', 'Rustling Leaves', 'Peaceful Atmosphere']
    },
    {
      id: 'ocean',
      name: 'Deep Sea Lab 🌊',
      description: 'Explore knowledge in ocean depths with calming waves',
      background: '#01579B',
      gradient: ['#01579B', '#4FC3F7'],
      emoji: '🐠',
      sound: 'ocean',
      subjects: ['Marine Biology', 'Chemistry', 'Geography'],
      features: ['Wave Sounds', 'Marine Life', 'Blue Depths']
    },
    {
      id: 'future',
      name: 'Neon City 2084 🏙️',
      description: 'High-tech learning in futuristic city with synth sounds',
      background: '#1A237E',
      gradient: ['#1A237E', '#7B1FA2'],
      emoji: '🔮',
      sound: 'future',
      subjects: ['Technology', 'Programming', 'AI'],
      features: ['Synth Sounds', 'Neon Lights', 'Future Tech']
    },
    {
      id: 'mountain',
      name: 'Zen Mountain 🏔️',
      description: 'Find focus in serene mountain peaks with wind sounds',
      background: '#37474F',
      gradient: ['#37474F', '#78909C'],
      emoji: '⛰️',
      sound: 'mountain',
      subjects: ['Philosophy', 'Meditation', 'Creative Writing'],
      features: ['Wind Sounds', 'Peaceful Silence', 'Mountain Views']
    },
    {
      id: 'library',
      name: 'Grand Library 📚',
      description: 'Classic study environment with fireplace sounds',
      background: '#3E2723',
      gradient: ['#3E2723', '#5D4037'],
      emoji: '🕯️',
      sound: 'library',
      subjects: ['History', 'Literature', 'Research'],
      features: ['Fireplace', 'Page Turns', 'Classical Music']
    }
  ];

  useEffect(() => {
  return () => {
    if (sound) {
      sound.unloadAsync();
    }
  };
}, [sound]);

  const playAmbientSound = async (soundType: string) => {
    if (sound) {
      await sound.unloadAsync();
    }

    // In a real app, you would play actual sound files
    // This is a simulation
    console.log(`Playing ${soundType} ambient sounds`);
    Vibration.vibrate(100);
  };

  const enterEnvironment = (env: any) => {
    setSelectedEnvironment(env.id);
    if (ambientSound) {
      playAmbientSound(env.sound);
    }
  };

  const EnvironmentCard = ({ env }: { env: any }) => (
    <TouchableOpacity 
      style={[styles.environmentCard, { backgroundColor: env.gradient[0] }]}
      onPress={() => enterEnvironment(env)}
    >
      <View style={[styles.gradient, { 
        backgroundColor: env.gradient[1],
        opacity: 0.3 
      }]} />
      
      <View style={styles.environmentContent}>
        <Text style={styles.environmentEmoji}>{env.emoji}</Text>
        <Text style={styles.environmentName}>{env.name}</Text>
        <Text style={styles.environmentDescription}>{env.description}</Text>
        
        <View style={styles.features}>
          {env.features.map((feature: string, index: number) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>✨ {feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.subjects}>
          {env.subjects.map((subject: string, index: number) => (
            <View key={index} style={styles.subjectTag}>
              <Text style={styles.subjectText}>{subject}</Text>
            </View>
          ))}
        </View>

        <View style={styles.activeIndicator}>
          <Text style={styles.activeText}>
            {selectedEnvironment === env.id ? '🎧 ACTIVE' : 'TAP TO ENTER'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Immersive Environments</Text>
      <Text style={styles.subtitle}>Choose your perfect study atmosphere</Text>

      {/* Sound Controls */}
      <View style={styles.controls}>
        <View style={styles.controlItem}>
          <Text style={styles.controlLabel}>🌊 Ambient Sounds</Text>
          <Switch
            value={ambientSound}
            onValueChange={setAmbientSound}
            trackColor={{ false: '#767577', true: Colors.blueColor }}
          />
        </View>
        <View style={styles.controlItem}>
          <Text style={styles.controlLabel}>🎵 Focus Music</Text>
          <Switch
            value={focusMusic}
            onValueChange={setFocusMusic}
            trackColor={{ false: '#767577', true: Colors.blueColor }}
          />
        </View>
      </View>

      {/* Environments Grid */}
      <ScrollView 
        style={styles.environmentsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.environmentsGrid}>
          {environments.map((env) => (
            <EnvironmentCard key={env.id} env={env} />
          ))}
        </View>
      </ScrollView>

      {/* Currently Active Environment */}
      {selectedEnvironment && (
        <View style={styles.activeEnvironment}>
          <Text style={styles.activeTitle}>
            Currently in {environments.find(e => e.id === selectedEnvironment)?.name}
          </Text>
          <TouchableOpacity 
            style={styles.exitButton}
            onPress={() => setSelectedEnvironment('')}
          >
            <Text style={styles.exitButtonText}>Exit Environment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  controls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlItem: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  environmentsScroll: {
    flex: 1,
  },
  environmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  environmentCard: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  environmentContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  environmentEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  environmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  environmentDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  features: {
    marginBottom: 8,
  },
  featureTag: {
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  subjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  activeEnvironment: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 12,
  },
  exitButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ImmersiveEnvironments;