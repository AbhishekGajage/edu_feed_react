// app/opportunities/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/color';
import { useUser } from '../lib/providers/UserProvider';

const OpportunityDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;

      try {
        // 🔁 Later: replace with real Firestore fetch
        // const result = await databaseService.getOpportunityById(id);
        // if (result.success) setOpportunity(result.data);
        const mockOpportunities = [
        {
            id: 'int-1',
            type: 'Internship',
            title: 'Software Engineering Intern',
            company: 'Google',
            duration: '12 weeks',
            stipend: '$8,000/month',
            deadline: '2025-12-01',
            description: 'Work on cutting-edge AI products.',
            tags: ['AI', 'Software', 'Remote'],
        },
        {
            id: 'sch-1',
            type: 'Scholarship',
            title: 'Google Generation Scholarship',
            company: 'Google',
            amount: '$10,000',
            deadline: '2026-03-01',
            description: 'For underrepresented CS students.',
            tags: ['Diversity', 'CS', 'Global'],
        },
        {
            id: 'ach-1',
            type: 'Achievement',
            title: '100-Day Coding Streak',
            company: 'EduGram',
            deadline: 'Ongoing',
            description: 'Code every day for 100 days.',
            tags: ['Consistency', 'Badge', 'Motivation'],
        },
        ];
        // For now: mock lookup
        const mockOpp = mockOpportunities.find((opp: any) => opp.id === id);
        if (mockOpp) {
          setOpportunity(mockOpp);
        } else {
          Alert.alert('Not Found', 'Opportunity not found.');
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load opportunity.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to apply.');
      return;
    }

    try {
      // 🔁 Later: real Firestore application
      // await databaseService.applyForOpportunity(id, user.uid, { appliedAt: new Date() });

      Alert.alert('✅ Success', `Application submitted for "${opportunity.title}"!`);
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to apply. Please try again.');
    }
  };

  if (loading || !opportunity) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.company}>{opportunity.company}</Text>
        <Text style={styles.typeBadge}>{opportunity.type}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>📅 Deadline</Text>
        <Text style={styles.deadline}>{opportunity.deadline}</Text>
      </View>

      {opportunity.duration && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>⏱️ Duration</Text>
          <Text style={styles.info}>{opportunity.duration}</Text>
        </View>
      )}

      {opportunity.stipend && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>💰 Stipend</Text>
          <Text style={styles.info}>{opportunity.stipend}</Text>
        </View>
      )}

      {opportunity.amount && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>💵 Amount</Text>
          <Text style={styles.info}>{opportunity.amount}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>📝 Description</Text>
        <Text style={styles.description}>{opportunity.description}</Text>
      </View>

      <View style={styles.tags}>
        {opportunity.tags.map((tag: string, i: number) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>✅ Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 18,
    color: Colors.secondaryColor,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    color: Colors.blueColor,
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: Colors.blueColor,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondaryColor,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4444',
  },
  info: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primaryColor,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.blueColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
  },
  applyButton: {
    backgroundColor: Colors.blueColor,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OpportunityDetailScreen;