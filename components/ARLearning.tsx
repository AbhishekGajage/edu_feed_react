// components/ARLearning.tsx
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/color';

const ARLearning = () => {
  const [showAR, setShowAR] = useState(false);
  const [currentLesson, setCurrentLesson] = useState('');

  const arLessons = [
    {
      title: "3D Solar System",
      emoji: "🪐",
      description: "Explore planets in your space",
      topic: "Astronomy"
    },
    {
      title: "Human Anatomy",
      emoji: "🦴",
      description: "See organs in 3D",
      topic: "Biology"
    },
    {
      title: "Molecular Structures",
      emoji: "⚛️",
      description: "Build molecules in AR",
      topic: "Chemistry"
    },
    {
      title: "Historical Monuments",
      emoji: "🏛️",
      description: "Place monuments in your room",
      topic: "History"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Learning Lab</Text>
      <Text style={styles.subtitle}>Learn in 3D with Augmented Reality</Text>
      
      <View style={styles.lessonsGrid}>
        {arLessons.map((lesson, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.lessonCard}
            onPress={() => {
              setCurrentLesson(lesson.title);
              setShowAR(true);
            }}
          >
            <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonTopic}>{lesson.topic}</Text>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
            <View style={styles.arBadge}>
              <Text style={styles.arText}>AR</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showAR} animationType="slide">
        <View style={styles.arContainer}>
          <Text style={styles.arTitle}>AR Mode: {currentLesson}</Text>
          <Text style={styles.arInstruction}>
            Point your camera at a flat surface to place the 3D model
          </Text>
          
          {/* This would integrate with ARKit/ARCore in a real implementation */}
          <View style={styles.arPlaceholder}>
            <Text style={styles.arPlaceholderText}>🎯</Text>
            <Text style={styles.arPlaceholderText}>AR Camera View</Text>
            <Text style={styles.arHint}>Move around to explore from different angles</Text>
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowAR(false)}
          >
            <Text style={styles.closeButtonText}>Exit AR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  lessonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lessonCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lessonEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 4,
  },
  lessonTopic: {
    fontSize: 12,
    color: Colors.blueColor,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 12,
    color: Colors.secondaryColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  arBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  arText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  arTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  arInstruction: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  arPlaceholder: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  arPlaceholderText: {
    fontSize: 48,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  arHint: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ARLearning;