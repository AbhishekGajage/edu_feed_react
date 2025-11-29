import { Colors } from '@/constants/color';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AppLogo from '../../components/AppLogo';
import GlassCard from '../../components/GlassCard';
import StoryWidget from '../../components/StoryWidget';
import { Images } from '../../constants/images';
import { useUser } from '../lib/providers/UserProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const opportunities = [
    {
      id: '1',
      title: 'Flutter Masterclass',
      type: 'Course',
      duration: '6 weeks',
    },
    {
      id: '2',
      title: 'Google Internship 2024',
      type: 'Internship',
      deadline: '15 days left',
    },
  ];

  const stories = [
    { id: '1', username: 'Your Story', isOwnStory: true },
    { id: '2', username: 'Tech Mentor', hasNewStories: true },
    { id: '3', username: 'Study Group', hasNewStories: true },
  ];

  const gridItems = [
    {
      id: '1',
      icon: '🎓',
      title: 'Scholarships',
      route: '../(tabs)/opportunities',
      color: '#667EEA'
    },
    {
      id: '2',
      icon: '💼',
      title: 'Internships',
      route: '../(tabs)/opportunities',
      color: '#FF6B6B'
    },
    {
      id: '3',
      icon: '📚',
      title: 'Study Material',
      route: '../app/goals',
      color: '#4ECDC4'
    },
    {
      id: '4',
      icon: '🏆',
      title: 'Achievements',
      route: '../(tabs)/learning-progress',
      color: '#FFD166'
    },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Updated', 'Content refreshed!');
    }, 1500);
  }, []);

  const handleFeaturePress = (item: any) => {
    if (item.route) {
      router.push(item.route as any);
    } else {
      Alert.alert(item.title, `Navigate to ${item.title}`);
    }
  };

  const FeatureGrid = () => (
    <View style={styles.featuresGrid}>
      {gridItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.featureItem}
          onPress={() => handleFeaturePress(item)}
        >
          <View style={[styles.featureIcon, { backgroundColor: `${item.color}20` }]}>
            <Text style={styles.featureIconText}>{item.icon}</Text>
          </View>
          <Text style={styles.featureTitle}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const FeaturedContent = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
    >
      {opportunities.map((item) => (
        <TouchableOpacity 
          key={item.id}
          onPress={() => Alert.alert(item.title, `Learn about ${item.type}`)}
        >
          <GlassCard style={styles.featuredCard}>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredType}>{item.type}</Text>
              <Text style={styles.featuredDetails}>
                {item.duration || item.deadline}
              </Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={Colors.blueColor}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back, {user?.username || 'Student'}! 👋</Text>
            <Text style={styles.welcomeSubtitle}>Ready to continue learning?</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.2K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <FeatureGrid />
          </View>

          {/* Featured Content */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Opportunities</Text>
              <TouchableOpacity onPress={() => router.push('../(tabs)/opportunities' as any)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FeaturedContent />
          </View>

          {/* Daily Motivation */}
          <TouchableOpacity onPress={() => Alert.alert('Daily Motivation', 'Keep learning!')}>
            <GlassCard style={styles.motivationCard}>
              <View style={styles.motivationContent}>
                <Text style={styles.motivationIcon}>💡</Text>
                <Text style={styles.motivationTitle}>Today&apos;s Inspiration</Text>
                <Text style={styles.motivationText}>
                  &quote;Education is the most powerful weapon which you can use to change the world.&quote;
                </Text>
                <Text style={styles.motivationAuthor}>- Nelson Mandela</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>

          {/* Spacer for bottom header */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* Stories Section - Fixed at bottom above header */}
      <View style={styles.storiesContainer}>
        <FlatList
          horizontal
          data={stories}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Alert.alert('Story', `Viewing ${item.username}'s story`)}>
              <StoryWidget
                username={item.username}
                imageUrl={Images.defaultAvatar}
                isOwnStory={item.isOwnStory}
                hasNewStories={item.hasNewStories}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Bottom Header */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.bottomHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>EduGram</Text>
              <Text style={styles.headerSubtitle}>Learning Platform</Text>
            </View>
            <AppLogo size={40} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 180, // Space for stories and header
  },
  // Welcome Section
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
  },
  // Stats Section
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  seeAllText: {
    color: Colors.blueColor,
    fontWeight: '500',
  },
  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
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
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  // Featured Content
  horizontalScroll: {
    marginHorizontal: -4,
  },
  featuredCard: {
    width: 160,
    marginHorizontal: 8,
    padding: 16,
  },
  featuredContent: {
    alignItems: 'flex-start',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  featuredType: {
    fontSize: 14,
    color: Colors.blueColor,
    fontWeight: '500',
    marginBottom: 4,
  },
  featuredDetails: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  // Motivation Card
  motivationCard: {
    marginBottom: 20,
  },
  motivationContent: {
    alignItems: 'center',
    padding: 20,
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  motivationText: {
    color: Colors.secondaryColor,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  motivationAuthor: {
    color: Colors.blueColor,
    fontSize: 12,
    fontWeight: '500',
  },
  // Stories Section
  storiesContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.mobileSearchColor,
    zIndex: 10,
  },
  storiesList: {
    paddingHorizontal: 15,
  },
  // Bottom Header
  bottomHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default HomeScreen;