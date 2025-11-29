// app/goals.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GoalsScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Daily Goals</Text>
        
        <View style={styles.goalCard}>
          <Text style={styles.goalText}>🎯 Study for 2 hours</Text>
          <Text style={styles.goalStatus}>Completed ✅</Text>
        </View>
        
        <View style={styles.goalCard}>
          <Text style={styles.goalText}>📚 Complete 1 chapter</Text>
          <Text style={styles.goalStatus}>In Progress 🔄</Text>
        </View>
        
        <View style={styles.goalCard}>
          <Text style={styles.goalText}>💻 Practice coding</Text>
          <Text style={styles.goalStatus}>Not Started ⏳</Text>
        </View>
        
        <TouchableOpacity style={styles.addGoalButton}>
          <Text style={styles.addGoalText}>+ Add New Goal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  goalCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  goalText: { fontSize: 16, fontWeight: '500' },
  goalStatus: { fontSize: 14, color: '#666' },
  addGoalButton: { 
    backgroundColor: '#667EEA', 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 20,
    alignItems: 'center'
  },
  addGoalText: { color: 'white', fontWeight: '600' },
  backButton: { backgroundColor: '#666', padding: 15, borderRadius: 10, marginTop: 10 },
  backButtonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});