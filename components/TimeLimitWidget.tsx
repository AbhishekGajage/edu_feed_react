// components/TimeLimitWidget.tsx
import * as BackgroundFetch from 'expo-background-fetch';
import { useRouter } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';

const TIME_LIMIT_TASK = 'TIME_LIMIT_TASK';

// Register background task (Expo only)
TaskManager.defineTask(TIME_LIMIT_TASK, () => {
  console.log('Background time check');
  return BackgroundFetch.BackgroundFetchResult.NewData as any;
});

interface TimeLimitWidgetProps {
  remainingTime?: number;
  onTimeUpdate?: (newTime: number) => void;
  showDetails?: boolean;
  onPress?: () => void;
}

const TimeLimitWidget = ({ 
  remainingTime, 
  onTimeUpdate, 
  showDetails = false, 
  onPress 
}: TimeLimitWidgetProps) => {
  const { user, updateUserProfile, updateScreenTime } = useUser();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(remainingTime || user.timeLimit || 120);
  const [todayUsage, setTodayUsage] = useState(user.todaysUsage || 0);
  const [appActiveTime, setAppActiveTime] = useState(0);
  const [lastActiveTime, setLastActiveTime] = useState<number | null>(null);

  // Track app usage time
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setLastActiveTime(Date.now());
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (lastActiveTime) {
          const timeSpent = Math.floor((Date.now() - lastActiveTime) / (60 * 1000));
          if (timeSpent > 0) {
            const newTimeLeft = Math.max(0, timeLeft - timeSpent);
            setTimeLeft(newTimeLeft);
            setAppActiveTime(prev => prev + timeSpent);
            setTodayUsage(prev => prev + timeSpent);
            
            updateUserProfile({ 
              timeLimit: newTimeLeft,
              dailyScrollTime: (user.dailyScrollTime || 0) + timeSpent,
              todaysUsage: (user.todaysUsage || 0) + timeSpent
            });
            
            onTimeUpdate?.(newTimeLeft);
          }
        }
        setLastActiveTime(null);
      }
    });

    return () => subscription.remove();
  }, [lastActiveTime, timeLeft, user]);

  // Initialize background fetch
  useEffect(() => {
    const registerBackgroundFetch = async () => {
      try {
        await BackgroundFetch.registerTaskAsync(TIME_LIMIT_TASK, {
          minimumInterval: 60 * 15,
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (err) {
        console.log('Background fetch failed to register');
      }
    };

    registerBackgroundFetch();
  }, []);

  // Sync with user data
  useEffect(() => {
    if (remainingTime !== undefined) {
      setTimeLeft(remainingTime);
    } else {
      setTimeLeft(user.timeLimit || 120);
    }
    setTodayUsage(user.todaysUsage || 0);
  }, [user.timeLimit, user.todaysUsage, remainingTime]);

  // Time limit warnings
  useEffect(() => {
    if (timeLeft === 10) {
      Alert.alert('⏰ Time Alert', 'Only 10 minutes remaining today!');
    } else if (timeLeft === 5) {
      Alert.alert('⏰ Time Alert', 'Only 5 minutes left! Finish up what you\'re doing.');
    } else if (timeLeft === 0) {
      Alert.alert('🎯 Time Limit Reached', 'Great job using your time wisely today! Take a break.');
      router.push('../break-screen');
    }
  }, [timeLeft]);

  const getBackgroundColor = () => {
    if (timeLeft < 10) return '#FF6B6B';
    if (timeLeft < 30) return '#FFA726';
    return Colors.blueColor;
  };

  const getStatusMessage = () => {
    if (timeLeft < 10) return 'Almost done!';
    if (timeLeft < 30) return 'Time running low';
    return 'Good time management';
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('../(tabs)/digital-wellbeing');
    }
  };

  if (showDetails) {
    return (
      <TouchableOpacity style={styles.detailedContainer} onPress={handlePress}>
        <View style={styles.detailedHeader}>
          <Text style={styles.detailedTitle}>Daily Time Limit</Text>
          <Text style={[styles.detailedTime, { color: getBackgroundColor() }]}>
            {timeLeft}m left
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(100, (todayUsage / 120) * 100)}%`,
                backgroundColor: getBackgroundColor()
              }
            ]} 
          />
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.stat}>
            Used: <Text style={styles.statValue}>{todayUsage}m</Text>
          </Text>
          <Text style={styles.stat}>
            Status: <Text style={styles.statValue}>{getStatusMessage()}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() }
      ]}
      onPress={handlePress}
    >
      <Text style={styles.timerIcon}>⏱️</Text>
      <Text style={styles.timeText}>{timeLeft}m</Text>
      {timeLeft < 30 && (
        <Text style={styles.warningIcon}>⚠️</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  timerIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningIcon: {
    marginLeft: 4,
    fontSize: 12,
  },
  detailedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  detailedTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  statValue: {
    fontWeight: '600',
    color: Colors.primaryColor,
  },
});

export default TimeLimitWidget;