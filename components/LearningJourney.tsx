// components/LearningJourney.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';

const LearningJourney = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  const levels = [
    { level: 1, xpRequired: 0, title: "Beginner Explorer", color: "#FF6B6B" },
    { level: 2, xpRequired: 100, title: "Curious Learner", color: "#4ECDC4" },
    { level: 3, xpRequired: 300, title: "Knowledge Seeker", color: "#45B7D1" },
    { level: 4, xpRequired: 600, title: "Wisdom Collector", color: "#96CEB4" },
    { level: 5, xpRequired: 1000, title: "Master Scholar", color: "#FFEAA7" },
  ];

  const achievementsList = [
    { id: 1, name: "First Post", emoji: "📝", description: "Share your first learning", unlocked: true },
    { id: 2, name: "Week Warrior", emoji: "⚔️", description: "7-day learning streak", unlocked: streak >= 7 },
    { id: 3, name: "Social Scholar", emoji: "👥", description: "Get 50 likes", unlocked: false },
    { id: 4, name: "Topic Master", emoji: "🎯", description: "Master 5 subjects", unlocked: false },
    { id: 5, name: "Night Owl", emoji: "🦉", description: "Learn after midnight", unlocked: false },
  ];

  useEffect(() => {
    // Calculate level and progress
    const currentLevel = levels.find(l => xp >= l.xpRequired && xp < (levels[levels.indexOf(l) + 1]?.xpRequired || Infinity));
    if (currentLevel) {
      setLevel(currentLevel.level);
      const nextLevel = levels[levels.indexOf(currentLevel) + 1];
      const progress = nextLevel ? (xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired) * 100 : 100;
      setProgress(progress);
    }
  }, [xp]);

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
    // Trigger celebration for significant milestones
    if ((xp + amount) % 100 === 0) {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    // This would trigger confetti or other celebrations
    console.log("🎉 Level up celebration!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Journey</Text>
        <Text style={styles.subtitle}>Level {level} • {xp} XP</Text>
      </View>

      {/* Level Progress */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>{levels[level-1]?.title}</Text>
          <Text style={styles.levelXp}>{xp} XP</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: levels[level-1]?.color
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}% to Level {level + 1}
          </Text>
        </View>

        <View style={styles.xpActions}>
          <TouchableOpacity 
            style={styles.xpButton}
            onPress={() => addXp(25)}
          >
            <Text style={styles.xpButtonText}>+25 XP</Text>
            <Text style={styles.xpButtonSubtext}>Complete Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.xpButton}
            onPress={() => addXp(50)}
          >
            <Text style={styles.xpButtonText}>+50 XP</Text>
            <Text style={styles.xpButtonSubtext}>Share Knowledge</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Streak Counter */}
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.streakCount}>{streak} days</Text>
        <Text style={styles.streakLabel}>Learning Streak</Text>
        <View style={styles.streakProgress}>
          {[...Array(7)].map((_, i) => (
            <View 
              key={i}
              style={[
                styles.streakDay,
                i < streak && styles.streakDayActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievementsList.map((achievement) => (
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
              {achievement.unlocked && (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Daily Challenges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        <View style={styles.challengesList}>
          <View style={styles.challenge}>
            <Text style={styles.challengeEmoji}>📚</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Read 3 Articles</Text>
              <Text style={styles.challengeReward}>+15 XP</Text>
            </View>
            <TouchableOpacity style={styles.challengeButton}>
              <Text style={styles.challengeButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.challenge}>
            <Text style={styles.challengeEmoji}>💬</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Comment on 2 Posts</Text>
              <Text style={styles.challengeReward}>+10 XP</Text>
            </View>
            <TouchableOpacity style={styles.challengeButton}>
              <Text style={styles.challengeButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  levelCard: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  levelXp: {
    fontSize: 16,
    color: Colors.secondaryColor,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  xpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpButton: {
    flex: 1,
    backgroundColor: Colors.blueColor,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  xpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  xpButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  streakEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.secondaryColor,
    marginBottom: 12,
  },
  streakProgress: {
    flexDirection: 'row',
    gap: 4,
  },
  streakDay: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  streakDayActive: {
    backgroundColor: '#FF6B6B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
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
  challengesList: {
    gap: 12,
  },
  challenge: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  challengeEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 2,
  },
  challengeReward: {
    fontSize: 12,
    color: Colors.blueColor,
    fontWeight: '500',
  },
  challengeButton: {
    backgroundColor: Colors.blueColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default LearningJourney;