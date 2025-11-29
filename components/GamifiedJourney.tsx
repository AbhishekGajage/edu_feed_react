// components/GamifiedJourney.tsx
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';

const GamifiedJourney = () => {
  const { user } = useUser();
  const [xp, setXp] = useState(user.xp || 0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(user.streak || 0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const levels = [
    { level: 1, xpRequired: 0, title: "New Explorer", color: "#FF6B6B", reward: "🎒 Starter Pack" },
    { level: 2, xpRequired: 100, title: "Curious Learner", color: "#4ECDC4", reward: "📚 Study Kit" },
    { level: 3, xpRequired: 300, title: "Knowledge Seeker", color: "#45B7D1", reward: "🔍 Explorer Badge" },
    { level: 4, xpRequired: 600, title: "Wisdom Collector", color: "#96CEB4", reward: "💡 Insight Unlocked" },
    { level: 5, xpRequired: 1000, title: "Master Scholar", color: "#FFEAA7", reward: "🏆 Master Badge" },
    { level: 6, xpRequired: 1500, title: "Grand Mentor", color: "#DDA0DD", reward: "👑 Mentor Crown" },
  ];

  const achievements = [
    { id: 1, name: "First Steps", emoji: "👣", description: "Complete your first lesson", xp: 50, unlocked: xp >= 50 },
    { id: 2, name: "Week Warrior", emoji: "⚔️", description: "7-day learning streak", xp: 100, unlocked: streak >= 7 },
    { id: 3, name: "Social Butterfly", emoji: "🦋", description: "Join 3 study groups", xp: 75, unlocked: false },
    { id: 4, name: "Night Owl", emoji: "🦉", description: "Learn after midnight", xp: 25, unlocked: false },
    { id: 5, name: "Early Bird", emoji: "🐦", description: "Learn before 6 AM", xp: 25, unlocked: false },
    { id: 6, name: "Bookworm", emoji: "📖", description: "Read 100 pages", xp: 150, unlocked: false },
    { id: 7, name: "Math Wizard", emoji: "🧙‍♂️", description: "Solve 50 math problems", xp: 200, unlocked: false },
    { id: 8, name: "Coding Master", emoji: "💻", description: "Complete coding challenges", xp: 300, unlocked: false },
  ];

  useEffect(() => {
    // Calculate current level
    const currentLevel = levels.find(l => xp >= l.xpRequired && xp < (levels[levels.indexOf(l) + 1]?.xpRequired || Infinity));
    if (currentLevel && currentLevel.level !== level) {
      setLevel(currentLevel.level);
      triggerLevelUp();
    }
  }, [xp]);

  const triggerLevelUp = () => {
    setShowLevelUp(true);
    Vibration.vibrate(500);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setShowLevelUp(false), 3000);
  };

  const addXp = (amount: number, activity: string) => {
    setXp(prev => {
      const newXp = prev + amount;
      // Save to user profile
      // updateUserProfile({ xp: newXp });
      return newXp;
    });
    
    // Show XP gain animation
    triggerXpAnimation(amount, activity);
  };

  const triggerXpAnimation = (amount: number, activity: string) => {
    // This would show a floating +XP animation
    console.log(`+${amount} XP for ${activity}`);
  };

  const getCurrentLevel = () => levels.find(l => l.level === level) || levels[0];
  const getNextLevel = () => levels.find(l => l.level === level + 1);
  
  const progress = getNextLevel() 
    ? ((xp - getCurrentLevel().xpRequired) / (getNextLevel().xpRequired - getCurrentLevel().xpRequired)) * 100
    : 100;

  return (
    <View style={styles.container}>
      {/* Level Up Celebration */}
      {showLevelUp && (
        <View style={styles.levelUpOverlay}>
          <Animated.Text style={[styles.levelUpText, { transform: [{ scale: scaleAnim }] }]}>
            🎉 Level {level} Unlocked! 🎉
          </Animated.Text>
          <Text style={styles.levelUpSubtext}>{getCurrentLevel().title}</Text>
          <Text style={styles.rewardText}>Reward: {getCurrentLevel().reward}</Text>
        </View>
      )}

      {/* Main Progress */}
      <View style={styles.progressCard}>
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelTitle}>Level {level}</Text>
            <Text style={styles.levelName}>{getCurrentLevel().title}</Text>
          </View>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: getCurrentLevel().color
                }
              ]} 
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>{getCurrentLevel().xpRequired} XP</Text>
            <Text style={styles.progressLabel}>
              {getNextLevel() ? `${getNextLevel().xpRequired} XP` : 'MAX'}
            </Text>
          </View>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakSection}>
          <Text style={styles.streakTitle}>🔥 {streak} Day Streak</Text>
          <View style={styles.streakDays}>
            {[...Array(7)].map((_, i) => (
              <View 
                key={i}
                style={[
                  styles.streakDay,
                  i < streak && styles.streakDayActive
                ]}
              >
                <Text style={styles.streakDayText}>{i + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Quick XP Actions */}
      <View style={styles.xpActions}>
        <Text style={styles.sectionTitle}>Earn XP</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.xpAction}
            onPress={() => addXp(25, 'Completed Lesson')}
          >
            <Text style={styles.xpActionEmoji}>📚</Text>
            <Text style={styles.xpActionText}>Complete Lesson</Text>
            <Text style={styles.xpAmount}>+25 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.xpAction}
            onPress={() => addXp(50, 'Shared Knowledge')}
          >
            <Text style={styles.xpActionEmoji}>💬</Text>
            <Text style={styles.xpActionText}>Share Post</Text>
            <Text style={styles.xpAmount}>+50 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.xpAction}
            onPress={() => addXp(75, 'Helped Peer')}
          >
            <Text style={styles.xpActionEmoji}>🤝</Text>
            <Text style={styles.xpActionText}>Help Others</Text>
            <Text style={styles.xpAmount}>+75 XP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.xpAction}
            onPress={() => addXp(100, 'Daily Challenge')}
          >
            <Text style={styles.xpActionEmoji}>🎯</Text>
            <Text style={styles.xpActionText}>Daily Challenge</Text>
            <Text style={styles.xpAmount}>+100 XP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View 
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.unlocked && styles.achievementUnlocked
              ]}
            >
              <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementXp}>+{achievement.xp} XP</Text>
              {achievement.unlocked && (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
    padding: 16,
  },
  levelUpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  levelUpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  levelUpSubtext: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  levelName: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  xpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blueColor,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  streakSection: {
    marginTop: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 12,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDayActive: {
    backgroundColor: '#FF6B6B',
  },
  streakDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  xpActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  xpAction: {
    width: '48%',
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  xpActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  xpActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 4,
  },
  xpAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.blueColor,
  },
  achievementsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    opacity: 0.6,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  achievementEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 10,
    color: Colors.secondaryColor,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementXp: {
    fontSize: 10,
    color: Colors.blueColor,
    fontWeight: 'bold',
  },
  unlockedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default GamifiedJourney;