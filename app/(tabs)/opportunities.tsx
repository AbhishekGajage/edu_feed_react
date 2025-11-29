// app/(tabs)/opportunities.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OpportunityCard from '../../components/OpportunityCard';
import { Colors } from '../../constants/color';

// 🔁 Later: replace with databaseService.getOpportunitiesRealtime()
// For now: rich mock data
const mockOpportunities = [
  // Internships (8)
  { id: 'int-1', type: 'Internship', title: 'Software Engineering Intern', company: 'Google', duration: '12 weeks', stipend: '$8,000/month', deadline: '2025-12-01', description: 'Work on cutting-edge AI products.', tags: ['AI', 'Software', 'Remote'] },
  { id: 'int-2', type: 'Internship', title: 'Frontend Developer Intern', company: 'Meta', duration: '10 weeks', stipend: '$7,500/month', deadline: '2025-11-15', description: 'Build next-gen React UIs.', tags: ['React', 'UI/UX', 'Remote'] },
  { id: 'int-3', type: 'Internship', title: 'Data Science Intern', company: 'Microsoft', duration: '12 weeks', stipend: '$7,200/month', deadline: '2025-10-30', description: 'Analyze big data & build ML models.', tags: ['Python', 'ML', 'On-site'] },
  { id: 'int-4', type: 'Internship', title: 'Mobile Dev Intern (React Native)', company: 'EduGram', duration: '8 weeks', stipend: '$3,000', deadline: '2026-01-15', description: 'Help build the future of EduGram!', tags: ['React Native', 'Startup', 'Hybrid'] },
  { id: 'int-5', type: 'Internship', title: 'Cybersecurity Intern', company: 'Cisco', duration: '12 weeks', stipend: '$6,800/month', deadline: '2025-12-10', description: 'Secure enterprise networks.', tags: ['Security', 'Networking', 'On-site'] },
  { id: 'int-6', type: 'Internship', title: 'Game Dev Intern', company: 'Unity', duration: '10 weeks', stipend: '$6,500/month', deadline: '2026-02-01', description: 'Create games with Unity engine.', tags: ['C#', '3D', 'Remote'] },
  { id: 'int-7', type: 'Internship', title: 'DevOps Intern', company: 'Amazon AWS', duration: '12 weeks', stipend: '$8,200/month', deadline: '2025-11-01', description: 'Automate cloud infrastructure.', tags: ['AWS', 'CI/CD', 'Linux'] },
  { id: 'int-8', type: 'Internship', title: 'Product Management Intern', company: 'Netflix', duration: '10 weeks', stipend: '$7,000/month', deadline: '2025-12-20', description: 'Shape streaming product strategy.', tags: ['PM', 'Analytics', 'Remote'] },

  // Scholarships (6)
  { id: 'sch-1', type: 'Scholarship', title: 'Google Generation Scholarship', company: 'Google', amount: '$10,000', deadline: '2026-03-01', description: 'For underrepresented CS students.', tags: ['Diversity', 'CS', 'Global'] },
  { id: 'sch-2', type: 'Scholarship', title: 'Women in Tech Scholarship', company: 'AnitaB.org', amount: '$5,000', deadline: '2026-04-15', description: 'Supporting women in computing.', tags: ['Women', 'STEM', 'USA'] },
  { id: 'sch-3', type: 'Scholarship', title: 'AWS Cloud Scholarship', company: 'Amazon', amount: '$7,500', deadline: '2026-01-30', description: 'For students pursuing cloud certifications.', tags: ['Cloud', 'Certification', 'Global'] },
  { id: 'sch-4', type: 'Scholarship', title: 'EduGram Future Leader Award', company: 'EduGram Foundation', amount: '$2,500', deadline: '2026-05-01', description: 'For students with community impact.', tags: ['Leadership', 'Community', 'Global'] },
  { id: 'sch-5', type: 'Scholarship', title: 'AI Research Grant', company: 'DeepMind', amount: '$15,000', deadline: '2026-02-28', description: 'Fund undergraduate AI research.', tags: ['AI', 'Research', 'PhD Track'] },
  { id: 'sch-6', type: 'Scholarship', title: 'Open Source Contributor Grant', company: 'GitHub', amount: '$3,000', deadline: 'Rolling', description: 'For active open-source contributors.', tags: ['Open Source', 'GitHub', 'Global'] },

  // Achievements (5)
  { id: 'ach-1', type: 'Achievement', title: '100-Day Coding Streak', company: 'EduGram', deadline: 'Ongoing', description: 'Code every day for 100 days.', tags: ['Consistency', 'Badge', 'Motivation'] },
  { id: 'ach-2', type: 'Achievement', title: 'Algorithm Master', company: 'EduGram', deadline: 'Ongoing', description: 'Solve 50+ DSA problems.', tags: ['DSA', 'LeetCode', 'Badge'] },
  { id: 'ach-3', type: 'Achievement', title: 'Community Helper', company: 'EduGram', deadline: 'Ongoing', description: 'Help 20+ peers via comments.', tags: ['Mentorship', 'Badge', 'Community'] },
  { id: 'ach-4', type: 'Achievement', title: 'Content Creator', company: 'EduGram', deadline: 'Ongoing', description: 'Publish 10 high-quality posts.', tags: ['Content', 'Educator', 'Badge'] },
  { id: 'ach-5', type: 'Achievement', title: 'Google Summer of Code 2026', company: 'Google', deadline: '2026-03-15 (Expected)', description: 'Contribute to open source & get paid.', tags: ['GSoC', 'Open Source', 'Paid Internship'] },
];

const OpportunitiesScreen = () => {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    setInternships(mockOpportunities.filter(opp => opp.type === 'Internship'));
    setScholarships(mockOpportunities.filter(opp => opp.type === 'Scholarship'));
    setAchievements(mockOpportunities.filter(opp => opp.type === 'Achievement'));
  }, []);

  const handlePress = (id: string) => {
    router.push(`../opportunities/${id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Internships */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Internships ({internships.length})</Text>
          {internships.map(opp => (
            <TouchableOpacity key={opp.id} onPress={() => handlePress(opp.id)}>
              <OpportunityCard {...opp} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Scholarships */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 Scholarships ({scholarships.length})</Text>
          {scholarships.map(opp => (
            <TouchableOpacity key={opp.id} onPress={() => handlePress(opp.id)}>
              <OpportunityCard {...opp} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements ({achievements.length})</Text>
          {achievements.map(opp => (
            <TouchableOpacity key={opp.id} onPress={() => handlePress(opp.id)}>
              <OpportunityCard {...opp} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
});

export default OpportunitiesScreen;