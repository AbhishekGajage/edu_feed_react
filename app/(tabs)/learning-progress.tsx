import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const LearningProgressScreen = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const learningData = {
    weekly: {
      coursesCompleted: 1,
      skillsLearned: 0,
      timeSpent: '3h 30m',
      progress: 65,
      achievements: [
        { name: 'Flutter Basics', progress: 100 },
        { name: 'Dart Programming', progress: 80 },
        { name: 'React Native', progress: 45 },
        { name: 'UI/UX Design', progress: 30 },
      ],
    },
    monthly: {
      coursesCompleted: 2,
      skillsLearned: 3,
      timeSpent: '10h 15m',
      progress: 78,
      achievements: [
        { name: 'Flutter Basics', progress: 100 },
        { name: 'Dart Programming', progress: 100 },
        { name: 'React Native', progress: 75 },
        { name: 'UI/UX Design', progress: 60 },
      ],
    },
    yearly: {
      coursesCompleted: 3,
      skillsLearned: 5,
      timeSpent: '118h 45m',
      progress: 85,
      achievements: [
        { name: 'Flutter Basics', progress: 100 },
        { name: 'Dart Programming', progress: 100 },
        { name: 'React Native', progress: 100 },
        { name: 'UI/UX Design', progress: 95 },
      ],
    },
  };

  const currentData = learningData[timeRange];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Progress</Text>
        <Text style={styles.subtitle}>Track your educational journey</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <Text 
          style={[styles.timeRangeText, timeRange === 'weekly' && styles.timeRangeActive]}
          onPress={() => setTimeRange('weekly')}
        >
          Weekly
        </Text>
        <Text 
          style={[styles.timeRangeText, timeRange === 'monthly' && styles.timeRangeActive]}
          onPress={() => setTimeRange('monthly')}
        >
          Monthly
        </Text>
        <Text 
          style={[styles.timeRangeText, timeRange === 'yearly' && styles.timeRangeActive]}
          onPress={() => setTimeRange('yearly')}
        >
          Yearly
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentData.coursesCompleted}</Text>
          <Text style={styles.statLabel}>Courses Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentData.skillsLearned}</Text>
          <Text style={styles.statLabel}>Skills Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentData.timeSpent}</Text>
          <Text style={styles.statLabel}>Learning Time</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentData.progress}%</Text>
          <Text style={styles.statLabel}>Overall Progress</Text>
        </View>
      </View>

      {/* Course Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Progress</Text>
        {currentData.achievements.map((course, index) => (
          <View key={index} style={styles.courseItem}>
            <View style={styles.courseHeader}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.coursePercentage}>{course.progress}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${course.progress}%`, backgroundColor: Colors.greenColor },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timeRangeActive: {
    color: Colors.blueColor,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  courseItem: {
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 14,
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  coursePercentage: {
    fontSize: 14,
    color: Colors.secondaryColor,
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.mobileSearchColor,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default LearningProgressScreen;