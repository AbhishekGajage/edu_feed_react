// components/StudyGroups.tsx
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/color';

const StudyGroups = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  const studyGroups = [
    {
      id: 1,
      name: 'Math Wizards 🧙‍♂️',
      members: 24,
      online: 8,
      subject: 'Mathematics',
      topic: 'Calculus & Algebra',
      activity: 'Live problem solving',
      emoji: '📐',
    },
    {
      id: 2,
      name: 'Code Masters 💻',
      members: 42,
      online: 15,
      subject: 'Programming',
      topic: 'React Native & Firebase',
      activity: 'Project collaboration',
      emoji: '⚡',
    },
    {
      id: 3,
      name: 'Science Explorers 🔬',
      members: 18,
      online: 5,
      subject: 'Science',
      topic: 'Physics & Chemistry',
      activity: 'Experiment discussions',
      emoji: '🧪',
    },
  ];

  const liveSessions = [
    {
      id: 1,
      title: 'Advanced JavaScript Patterns',
      host: 'Sarah Chen',
      viewers: 156,
      subject: 'Programming',
      emoji: '🚀',
    },
    {
      id: 2,
      title: 'Quantum Physics Simplified',
      host: 'Dr. Alex Kumar',
      viewers: 89,
      subject: 'Physics',
      emoji: '⚛️',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Study Together</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups, subjects, topics..."
          placeholderTextColor={Colors.secondaryColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'live' && styles.tabActive]}
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabText, activeTab === 'live' && styles.tabTextActive]}>
            Live Sessions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
            My Groups
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'discover' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Study Groups</Text>
          {studyGroups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupEmoji}>{group.emoji}</Text>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupSubject}>{group.subject}</Text>
                </View>
                <View style={styles.memberCount}>
                  <Text style={styles.memberText}>{group.members} members</Text>
                  <Text style={styles.onlineText}>{group.online} online</Text>
                </View>
              </View>
              <Text style={styles.groupTopic}>{group.topic}</Text>
              <Text style={styles.groupActivity}>🎯 {group.activity}</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Group</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeTab === 'live' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Learning Sessions</Text>
          {liveSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.liveCard}>
              <View style={styles.liveHeader}>
                <Text style={styles.liveEmoji}>{session.emoji}</Text>
                <View style={styles.liveInfo}>
                  <Text style={styles.liveTitle}>{session.title}</Text>
                  <Text style={styles.liveHost}>Hosted by {session.host}</Text>
                </View>
                <View style={styles.viewerCount}>
                  <Text style={styles.viewerText}>👁️ {session.viewers}</Text>
                </View>
              </View>
              <View style={styles.liveActions}>
                <TouchableOpacity style={styles.watchButton}>
                  <Text style={styles.watchButtonText}>▶️ Watch Live</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.remindButton}>
                  <Text style={styles.remindButtonText}>⏰ Remind Me</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionEmoji}>🎤</Text>
          <Text style={styles.quickActionText}>Start Live</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionEmoji}>👥</Text>
          <Text style={styles.quickActionText}>Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionEmoji}>📅</Text>
          <Text style={styles.quickActionText}>Schedule</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.primaryColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.blueColor,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryColor,
  },
  tabTextActive: {
    color: '#FFFFFF',
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
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 2,
  },
  groupSubject: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  memberCount: {
    alignItems: 'flex-end',
  },
  memberText: {
    fontSize: 12,
    color: Colors.primaryColor,
    marginBottom: 2,
  },
  onlineText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  groupTopic: {
    fontSize: 14,
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  groupActivity: {
    fontSize: 12,
    color: Colors.blueColor,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: Colors.blueColor,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  liveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  liveInfo: {
    flex: 1,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 2,
  },
  liveHost: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  viewerCount: {
    alignItems: 'flex-end',
  },
  viewerText: {
    fontSize: 12,
    color: Colors.primaryColor,
  },
  liveActions: {
    flexDirection: 'row',
    gap: 8,
  },
  watchButton: {
    flex: 2,
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  remindButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  remindButtonText: {
    color: Colors.primaryColor,
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryColor,
    textAlign: 'center',
  },
});

export default StudyGroups;