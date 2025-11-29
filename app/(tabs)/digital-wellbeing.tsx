// app/(tabs)/digital-wellbeing.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/color';
import { useUser } from '../lib/providers/UserProvider';

const DigitalWellbeingScreen = () => {
  const { user, setTimeLimit, resetDailyTime, updateScreenTime } = useUser();
  const router = useRouter();
  const [weeklyStats, setWeeklyStats] = useState({
    averageDailyUsage: 0,
    totalWeeklyUsage: 0,
    daysExceeded: 0
  });

  const [customLimit, setCustomLimit] = useState(user?.timeLimit || 120);

  // Real-time updates when user data changes
  useEffect(() => {
    calculateWeeklyStats();
    setCustomLimit(user?.timeLimit || 120);
  }, [user]);

  const calculateWeeklyStats = () => {
    const last7Days = user?.sessionHistory?.filter((session: any) => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }) || [];

    const dailyUsage: { [key: string]: number } = {};
    last7Days.forEach((session: any) => {
      dailyUsage[session.date] = (dailyUsage[session.date] || 0) + session.duration;
    });

    const usages = Object.values(dailyUsage);
    const average = usages.length > 0 ? usages.reduce((a: number, b: number) => a + b, 0) / usages.length : 0;
    const total = usages.reduce((a: number, b: number) => a + b, 0);
    const exceeded = usages.filter(usage => usage > (user?.timeLimit || 120)).length;

    setWeeklyStats({
      averageDailyUsage: Math.round(average),
      totalWeeklyUsage: total,
      daysExceeded: exceeded
    });
  };

  const getWellbeingScore = () => {
    const avgUsage = weeklyStats.averageDailyUsage;
    const userLimit = user?.timeLimit || 120;
    
    if (avgUsage === 0) return { score: 100, status: 'No Data', color: '#666' };
    if (avgUsage <= userLimit * 0.5) return { score: 90, status: 'Excellent', color: '#4CAF50' };
    if (avgUsage <= userLimit * 0.8) return { score: 75, status: 'Good', color: '#8BC34A' };
    if (avgUsage <= userLimit) return { score: 60, status: 'Moderate', color: '#FFC107' };
    return { score: 40, status: 'Needs Improvement', color: '#F44336' };
  };

  const handleSetTimeLimit = async (minutes: number) => {
    try {
      await setTimeLimit?.(minutes);
      setCustomLimit(minutes);
      
      Alert.alert(
        '✅ Limit Updated',
        `Daily time limit set to ${minutes} minutes`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to update time limit');
    }
  };

  const handleCustomLimit = () => {
    Alert.prompt(
      'Custom Time Limit',
      'Enter daily time limit in minutes:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: (value: string | undefined) => { // Fixed: Added type annotation
            const minutes = parseInt(value || '0');
            if (minutes > 0 && minutes <= 480) { // Max 8 hours
              handleSetTimeLimit(minutes);
            } else {
              Alert.alert('Invalid', 'Please enter a value between 1-480 minutes');
            }
          },
        },
      ],
      'plain-text',
      String(customLimit),
      'number-pad'
    );
  };

  const handleResetToday = async () => {
    try {
      await resetDailyTime?.();
      Alert.alert('✅ Reset', "Today's usage has been reset");
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to reset daily time');
    }
  };

  const handleAddTestTime = (minutes: number) => {
    Alert.alert(
      'Add Test Time',
      `Add ${minutes} minutes to today's usage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try {
              await updateScreenTime?.(minutes);
              Alert.alert('✅ Added', `${minutes} minutes added to today's usage`);
            } catch (error) {
              Alert.alert('❌ Error', 'Failed to add time');
            }
          },
        },
      ]
    );
  };

  const getProgressPercentage = () => {
    const used = user?.dailyScrollTime || 0;
    const limit = user?.timeLimit || 120;
    return Math.min(100, (used / limit) * 100);
  };

  const getRemainingTime = () => {
    const used = user?.dailyScrollTime || 0;
    const limit = user?.timeLimit || 120;
    return Math.max(0, limit - used);
  };

  const getTimeUsageColor = () => {
    const percentage = getProgressPercentage();
    if (percentage < 50) return '#4CAF50';
    if (percentage < 80) return '#FF9800';
    return '#F44336';
  };

  const wellbeing = getWellbeingScore();
  const progressPercentage = getProgressPercentage();
  const remainingTime = getRemainingTime();
  const timeUsageColor = getTimeUsageColor();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Digital Wellbeing</Text>
        <Text style={styles.subtitle}>Balance your screen time habits</Text>
      </View>

      {/* Current Status with Progress Bar */}
      <View style={styles.currentStatus}>
        <Text style={styles.statusTitle}>Today&amos;s Usage</Text>
        <Text style={styles.statusTime}>{user?.dailyScrollTime || 0} minutes</Text>
        <Text style={styles.statusRemaining}>
          {remainingTime} minutes remaining
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: timeUsageColor
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progressPercentage)}% of daily limit used
          </Text>
        </View>
      </View>

      {/* Wellbeing Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.score, { color: wellbeing.color }]}>
            {wellbeing.score}
          </Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={[styles.status, { color: wellbeing.color }]}>
            {wellbeing.status}
          </Text>
          <Text style={styles.statusDescription}>
            Based on your usage patterns from the last 7 days
          </Text>
          <Text style={styles.limitInfo}>
            Current limit: {user?.timeLimit || 120} minutes
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => handleAddTestTime(15)}
        >
          <Text style={styles.statNumber}>{user?.dailyScrollTime || 0}</Text>
          <Text style={styles.statLabel}>Used Today</Text>
          <Text style={styles.statHint}>(Tap to +15min)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statCard}
          onPress={handleCustomLimit}
        >
          <Text style={styles.statNumber}>{user?.timeLimit || 120}</Text>
          <Text style={styles.statLabel}>Daily Limit</Text>
          <Text style={styles.statHint}>(Tap to customize)</Text>
        </TouchableOpacity>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{weeklyStats.averageDailyUsage}</Text>
          <Text style={styles.statLabel}>Daily Avg</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{weeklyStats.daysExceeded}</Text>
          <Text style={styles.statLabel}>Over Limit</Text>
        </View>
      </View>

      {/* Time Limit Settings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Time Limits</Text>
          <TouchableOpacity onPress={handleCustomLimit}>
            <Text style={styles.customizeText}>Custom</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.limitButtons}>
          <TouchableOpacity 
            style={[
              styles.limitButton,
              user?.timeLimit === 30 && styles.limitButtonActive
            ]}
            onPress={() => handleSetTimeLimit(30)}
          >
            <Text style={[
              styles.limitText,
              user?.timeLimit === 30 && styles.limitTextActive
            ]}>30 min</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.limitButton,
              user?.timeLimit === 60 && styles.limitButtonActive
            ]}
            onPress={() => handleSetTimeLimit(60)}
          >
            <Text style={[
              styles.limitText,
              user?.timeLimit === 60 && styles.limitTextActive
            ]}>1 hour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.limitButton,
              user?.timeLimit === 120 && styles.limitButtonActive
            ]}
            onPress={() => handleSetTimeLimit(120)}
          >
            <Text style={[
              styles.limitText,
              user?.timeLimit === 120 && styles.limitTextActive
            ]}>2 hours</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.limitButton,
              user?.timeLimit === 180 && styles.limitButtonActive
            ]}
            onPress={() => handleSetTimeLimit(180)}
          >
            <Text style={[
              styles.limitText,
              user?.timeLimit === 180 && styles.limitTextActive
            ]}>3 hours</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.currentLimit}>
          <Text style={styles.currentLimitText}>
            Current Limit: <Text style={styles.currentLimitValue}>{user?.timeLimit || 120} minutes</Text>
          </Text>
        </View>
      </View>

      {/* Weekly Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Overview</Text>
        <View style={styles.weeklyStats}>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyStatNumber}>{weeklyStats.totalWeeklyUsage}</Text>
            <Text style={styles.weeklyStatLabel}>Total Minutes</Text>
          </View>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyStatNumber}>
              {user?.sessionHistory?.filter((s: any) => new Date(s.date).toDateString() === new Date().toDateString()).length || 0}
            </Text>
            <Text style={styles.weeklyStatLabel}>Sessions Today</Text>
          </View>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyStatNumber}>
              {Math.round((user?.sessionHistory?.reduce((acc: number, session: any) => acc + session.duration, 0) || 0) / Math.max(user?.sessionHistory?.length || 1, 1))}
            </Text>
            <Text style={styles.weeklyStatLabel}>Avg Session</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleResetToday}
        >
          <Text style={styles.actionButtonText}>🔄 Reset Today&amoss Time</Text>
        </TouchableOpacity>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.smallButton]}
            onPress={() => handleAddTestTime(30)}
          >
            <Text style={styles.actionButtonText}>+30min</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.smallButton, styles.secondaryButton]}
            onPress={() => router.push('../(tabs)/break-screen')}
          >
            <Text style={styles.secondaryButtonText}>⏸️ Take Break</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Usage Tips */}
      <View style={styles.tips}>
        <Text style={styles.sectionTitle}>💡 Healthy Habits</Text>
        <View style={styles.tip}>
          <Text style={styles.tipEmoji}>⏰</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>Set realistic daily goals</Text>
            <Text style={styles.tipSubtext}>Current: {user?.timeLimit || 120} minutes</Text>
          </View>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipEmoji}>🔄</Text>
          <Text style={styles.tipText}>Take regular breaks every 45-60 minutes</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipEmoji}>📵</Text>
          <Text style={styles.tipText}>Schedule screen-free time daily</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipEmoji}>🎯</Text>
          <Text style={styles.tipText}>Track progress towards your {user?.timeLimit || 120}-minute goal</Text>
        </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  currentStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginBottom: 8,
  },
  statusTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  statusRemaining: {
    fontSize: 14,
    color: Colors.secondaryColor,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.mobileSearchColor,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreCircle: {
    alignItems: 'center',
    marginRight: 20,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  scoreInfo: {
    flex: 1,
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.secondaryColor,
    lineHeight: 18,
    marginBottom: 4,
  },
  limitInfo: {
    fontSize: 12,
    color: Colors.blueColor,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 2,
  },
  statHint: {
    fontSize: 10,
    color: Colors.blueColor,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  customizeText: {
    color: Colors.blueColor,
    fontSize: 14,
    fontWeight: '500',
  },
  limitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  limitButton: {
    backgroundColor: Colors.mobileSearchColor,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  limitButtonActive: {
    backgroundColor: Colors.blueColor,
  },
  limitText: {
    color: Colors.secondaryColor,
    fontSize: 14,
    fontWeight: '500',
  },
  limitTextActive: {
    color: '#FFFFFF',
  },
  currentLimit: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.mobileSearchColor,
  },
  currentLimitText: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  currentLimitValue: {
    color: Colors.blueColor,
    fontWeight: '600',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weeklyStat: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  actions: {
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.blueColor,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.blueColor,
  },
  secondaryButtonText: {
    color: Colors.blueColor,
    fontSize: 14,
    fontWeight: '600',
  },
  tips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    color: Colors.primaryColor,
    flex: 1,
    marginBottom: 2,
  },
  tipSubtext: {
    fontSize: 12,
    color: Colors.blueColor,
    fontStyle: 'italic',
  },
});

export default DigitalWellbeingScreen;