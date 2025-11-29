import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../lib/providers/UserProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScreenTimeScreen = () => {
  const { user } = useUser();
  
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Mock data - replace with real analytics
  const screenTimeData = {
    daily: {
      totalTime: '2h 45m',
      categories: [
        { name: 'Learning Content', time: '1h 30m', percentage: 55, color: '#4CAF50' },
        { name: 'Social Feeds', time: '45m', percentage: 27, color: '#2196F3' },
        { name: 'Shorts/Reels', time: '20m', percentage: 12, color: '#FF9800' },
        { name: 'Opportunities', time: '10m', percentage: 6, color: '#9C27B0' },
      ],
      comparison: '+15% from yesterday',
      goal: '3 hours',
      goalProgress: 75,
    },
    weekly: {
      totalTime: '18h 20m',
      categories: [
        { name: 'Learning Content', time: '10h 15m', percentage: 56, color: '#4CAF50' },
        { name: 'Social Feeds', time: '5h 30m', percentage: 30, color: '#2196F3' },
        { name: 'Shorts/Reels', time: '2h 15m', percentage: 12, color: '#FF9800' },
        { name: 'Opportunities', time: '20m', percentage: 2, color: '#9C27B0' },
      ],
      comparison: '-5% from last week',
      goal: '20 hours',
      goalProgress: 92,
    },
    monthly: {
      totalTime: '78h 45m',
      categories: [
        { name: 'Learning Content', time: '45h 20m', percentage: 58, color: '#4CAF50' },
        { name: 'Social Feeds', time: '25h 15m', percentage: 32, color: '#2196F3' },
        { name: 'Shorts/Reels', time: '6h 30m', percentage: 8, color: '#FF9800' },
        { name: 'Opportunities', time: '1h 40m', percentage: 2, color: '#9C27B0' },
      ],
      comparison: '+12% from last month',
      goal: '80 hours',
      goalProgress: 98,
    },
  };

  const currentData = screenTimeData[timeRange];

  const TimeRangeButton = ({ range, label }: { range: 'daily' | 'weekly' | 'monthly'; label: string }) => (
    <TouchableOpacity
      style={[
        styles.timeRangeButton,
        timeRange === range && styles.timeRangeButtonActive,
      ]}
      onPress={() => setTimeRange(range)}
    >
      <Text
        style={[
          styles.timeRangeText,
          timeRange === range && styles.timeRangeTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <View style={styles.progressBarBackground}>
      <View
        style={[
          styles.progressBarFill,
          { width: `${percentage}%`, backgroundColor: color },
        ]}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Screen Time Analytics</Text>
        <Text style={styles.subtitle}>
          Understand how you spend time on EduGram
        </Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <TimeRangeButton range="daily" label="Today" />
        <TimeRangeButton range="weekly" label="This Week" />
        <TimeRangeButton range="monthly" label="This Month" />
      </View>

      {/* Total Time Card */}
      <View style={styles.totalTimeCard}>
        <Text style={styles.totalTimeLabel}>Total Screen Time</Text>
        <Text style={styles.totalTime}>{currentData.totalTime}</Text>
        <Text style={styles.comparison}>{currentData.comparison}</Text>
        
        {/* Goal Progress */}
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>Daily Goal: {currentData.goal}</Text>
            <Text style={styles.goalPercentage}>{currentData.goalProgress}%</Text>
          </View>
          <ProgressBar percentage={currentData.goalProgress} color={Colors.blueColor} />
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time by Category</Text>
        <View style={styles.categoriesContainer}>
          {currentData.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryTime}>{category.time}</Text>
              </View>
              <ProgressBar percentage={category.percentage} color={category.color} />
              <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>📚</Text>
            <Text style={styles.insightText}>
              You spent most time on learning content - great job!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>⏰</Text>
            <Text style={styles.insightText}>
              Your most active time is between 7-9 PM
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🎯</Text>
            <Text style={styles.insightText}>
              You&apos;re {currentData.goalProgress}% towards your daily goal
            </Text>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for Better Digital Wellbeing</Text>
        <Text style={styles.tip}>• Take 5-minute breaks every hour</Text>
        <Text style={styles.tip}>• Set specific learning goals each day</Text>
        <Text style={styles.tip}>• Use Focus Mode during study sessions</Text>
        <Text style={styles.tip}>• Review your progress weekly</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.blueColor,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryColor,
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  totalTimeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalTimeLabel: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  comparison: {
    fontSize: 14,
    color: Colors.greenColor,
    marginBottom: 16,
  },
  goalContainer: {
    marginTop: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.mobileSearchColor,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.primaryColor,
    fontWeight: '500',
  },
  categoryTime: {
    fontSize: 14,
    color: Colors.secondaryColor,
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 12,
    color: Colors.secondaryColor,
    marginTop: 4,
    textAlign: 'right',
  },
  insightsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightEmoji: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryColor,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: Colors.primaryColor,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ScreenTimeScreen;