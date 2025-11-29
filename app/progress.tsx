// app/progress.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProgressScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Learning Progress</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Courses Completed</Text>
          <Text style={styles.cardValue}>2</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hours Studied</Text>
          <Text style={styles.cardValue}>56</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <Text style={styles.cardValue}>8</Text>
        </View>
        
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
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 16, color: '#666' },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#667EEA' },
  backButton: { backgroundColor: '#667EEA', padding: 15, borderRadius: 10, marginTop: 20 },
  backButtonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});