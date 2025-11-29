import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/color';
import { useUser } from './lib/providers/UserProvider';

const BreakScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const calculateTimeUntilReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    setTimeUntilReset(calculateTimeUntilReset());
    
    const interval = setInterval(() => {
      setTimeUntilReset(calculateTimeUntilReset());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const activities = [
    {
      emoji: '🚶',
      title: 'Take a Walk',
      description: 'Fresh air helps refresh your mind'
    },
    {
      emoji: '📚',
      title: 'Read a Book',
      description: 'Physical books are great for your eyes'
    },
    {
      emoji: '💪',
      title: 'Stretch',
      description: 'Loosen up those muscles'
    },
    {
      emoji: '🧘',
      title: 'Meditate',
      description: '5 minutes of mindfulness'
    },
    {
      emoji: '🎵',
      title: 'Listen to Music',
      description: 'Relax with your favorite tunes'
    },
    {
      emoji: '👨‍👩‍👧‍👦',
      title: 'Talk to Family/Friends',
      description: 'Connect with loved ones'
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>Daily Limit Reached!</Text>
        <Text style={styles.subtitle}>
          You&apos;ve used {user.todaysUsage || 0} minutes today
        </Text>
      </View>

      <View style={styles.resetInfo}>
        <Text style={styles.resetText}>
          Time resets in: <Text style={styles.resetTime}>{timeUntilReset}</Text>
        </Text>
      </View>

      <View style={styles.achievement}>
        <Text style={styles.achievementTitle}>🎉 Great Job!</Text>
        <Text style={styles.achievementText}>
          You&apos;re developing healthy digital habits by managing your screen time effectively.
        </Text>
      </View>

      <View style={styles.suggestions}>
        <Text style={styles.sectionTitle}>Break Time Activities</Text>
        <View style={styles.activitiesGrid}>
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.activityEmoji}>{activity.emoji}</Text>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tips}>
        <Text style={styles.sectionTitle}>Digital Wellbeing Tips</Text>
        <View style={styles.tip}>
          <Text style={styles.tipText}>• Take regular breaks every 45-60 minutes</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>• Maintain good posture while using devices</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>• Keep screens at eye level to reduce neck strain</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>• Use the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => router.push('../(tabs)/digital-wellbeing')}
      >
        <Text style={styles.settingsButtonText}>View Usage Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Return to App (Limited Time)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.secondaryColor,
  },
  resetInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  resetTime: {
    fontWeight: 'bold',
    color: Colors.blueColor,
  },
  achievement: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  suggestions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
    lineHeight: 16,
  },
  tips: {
    marginBottom: 30,
  },
  tip: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.primaryColor,
    lineHeight: 20,
  },
  settingsButton: {
    backgroundColor: Colors.blueColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.secondaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BreakScreen;