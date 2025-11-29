// components/AICompanion.tsx
import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';

const AICompanion = () => {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [bounceAnim] = useState(new Animated.Value(0));
  const [currentMood, setCurrentMood] = useState<'happy' | 'curious' | 'excited' | 'proud'>('happy');

  const companionMessages = {
    happy: [
      "Hey there! Ready to learn something amazing today? 🚀",
      "Your progress is looking fantastic! Keep it up! 🌟",
      "I found a cool fact you might like! Did you know...",
      "You're doing great! Want to explore a new topic?",
    ],
    curious: [
      "I'm curious about what you're learning! Tell me more! 🤔",
      "That's an interesting topic! Want to dive deeper?",
      "I have a question for you... what excites you most about this?",
      "Let's explore this together! I love discovering new things!",
    ],
    excited: [
      "Wow! You just achieved something incredible! 🎉",
      "This is so exciting! Your learning journey is amazing!",
      "You're on fire! Ready for the next challenge?",
      "I'm so proud of your progress! Celebrate this moment!",
    ],
    proud: [
      "Look how far you've come! I'm so proud of you! 🏆",
      "Your dedication is inspiring! Keep shining!",
      "You've mastered something new! That's incredible!",
      "I knew you could do it! You're unstoppable!",
    ]
  };

  useEffect(() => {
    // Randomly show companion with personality
    const randomAppearance = setTimeout(() => {
      setIsVisible(true);
      triggerBounceAnimation();
      Vibration.vibrate(100);
      
      // Set mood based on user activity
      const moods: ('happy' | 'curious' | 'excited' | 'proud')[] = 
        ['happy', 'curious', 'excited', 'proud'];
      setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
      
      // Add random message
      const moodMessages = companionMessages[currentMood];
      const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
      setMessages([randomMessage]);
    }, 30000); // Appear every 30 seconds

    return () => clearTimeout(randomAppearance);
  }, []);

  const triggerBounceAnimation = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.spring(bounceAnim, {
        toValue: 0,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getCompanionEmoji = () => {
    switch(currentMood) {
      case 'happy': return '😊';
      case 'curious': return '🤔';
      case 'excited': return '🎉';
      case 'proud': return '🏆';
      default: return '🌟';
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{
            scale: bounceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1]
            })
          }]
        }
      ]}
    >
      <View style={styles.companionCard}>
        <View style={styles.companionHeader}>
          <Text style={styles.companionEmoji}>{getCompanionEmoji()}</Text>
          <Text style={styles.companionName}>Study Buddy</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
        
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message}
          </Text>
        ))}
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Tell me more!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Share progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
  },
  companionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#667EEA',
  },
  companionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  companionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: Colors.secondaryColor,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: Colors.primaryColor,
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.blueColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AICompanion;