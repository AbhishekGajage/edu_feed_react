// app/(tabs)/authenticator-moderation.tsx
import { Colors } from '@/constants/color';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../lib/providers/UserProvider';

const AuthenticatorModeration = () => {
  const { user } = useUser();
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    accuracy: 95,
  });

  useEffect(() => {
    loadPendingPosts();
  }, []);

  const loadPendingPosts = async () => {
    setRefreshing(true);
    
    // Mock data - replace with actual Firebase queries
    const mockPendingPosts = [
      {
        id: '1',
        username: 'John Student',
        userAvatar: '👦',
        description: 'Just learned about quantum physics! The double-slit experiment shows how particles can behave like waves. Amazing stuff!',
        imageUrl: 'https://picsum.photos/400/300?random=1',
        category: 'study',
        postedTime: '2 hours ago',
        educationalScore: 85,
      },
      {
        id: '2', 
        username: 'Jane Learner',
        userAvatar: '👧',
        description: 'Check out this cool meme I found! 😂',
        imageUrl: 'https://picsum.photos/400/300?random=2',
        category: 'other',
        postedTime: '1 hour ago',
        educationalScore: 25,
      },
      {
        id: '3',
        username: 'Mike Scholar', 
        userAvatar: '👦',
        description: 'Mathematical proof of Pythagorean theorem using geometry and algebra concepts.',
        imageUrl: 'https://picsum.photos/400/300?random=3',
        category: 'study',
        postedTime: '30 minutes ago',
        educationalScore: 92,
      },
    ];

    setPendingPosts(mockPendingPosts);
    setModerationStats({
      pending: mockPendingPosts.length,
      approved: 124,
      rejected: 18,
      accuracy: 95,
    });
    setRefreshing(false);
  };

  const approvePost = async (postId: string) => {
    Alert.alert(
      'Approve Post',
      'Mark this post as educational content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            // Update in Firebase
            setPendingPosts(prev => prev.filter(post => post.id !== postId));
            Alert.alert('Approved', 'Post marked as educational content');
          }
        }
      ]
    );
  };

  const rejectPost = async (postId: string, reason: string) => {
    Alert.alert(
      'Reject Post',
      `Reject this post? Reason: ${reason}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            // Update in Firebase
            setPendingPosts(prev => prev.filter(post => post.id !== postId));
            Alert.alert('Rejected', 'Post has been removed');
          }
        }
      ]
    );
  };

  const deletePost = async (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Permanently delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Delete from Firebase
            setPendingPosts(prev => prev.filter(post => post.id !== postId));
            Alert.alert('Deleted', 'Post has been permanently deleted');
          }
        }
      ]
    );
  };

  const getEducationalScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getEducationalScoreText = (score: number) => {
    if (score >= 80) return 'Highly Educational';
    if (score >= 60) return 'Moderately Educational';
    return 'Not Educational';
  };

  const StatCard = ({ title, value, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadPendingPosts} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Content Moderation</Text>
        <Text style={styles.subtitle}>Ensuring educational quality</Text>
        <Text style={styles.roleBadge}>🔍 Authenticator</Text>
      </View>

      {/* Moderation Stats */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Pending Review" 
          value={moderationStats.pending} 
          color="#FF9800" 
        />
        <StatCard 
          title="Approved" 
          value={moderationStats.approved} 
          color="#4CAF50" 
        />
        <StatCard 
          title="Rejected" 
          value={moderationStats.rejected} 
          color="#F44336" 
        />
        <StatCard 
          title="Accuracy" 
          value={`${moderationStats.accuracy}%`} 
          color="#2196F3" 
        />
      </View>

      {/* Pending Posts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Pending Review ({pendingPosts.length})
          </Text>
          <TouchableOpacity onPress={loadPendingPosts}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {pendingPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>No posts pending review</Text>
          </View>
        ) : (
          pendingPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userAvatar}>{post.userAvatar}</Text>
                  <View>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.postedTime}>{post.postedTime}</Text>
                  </View>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={[
                    styles.scoreText,
                    { color: getEducationalScoreColor(post.educationalScore) }
                  ]}>
                    {post.educationalScore}%
                  </Text>
                  <Text style={styles.scoreLabel}>
                    {getEducationalScoreText(post.educationalScore)}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              <Text style={styles.postDescription}>{post.description}</Text>
              
              {post.imageUrl && (
                <Image 
                  source={{ uri: post.imageUrl }} 
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}

              {/* Category */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Text>
              </View>

              {/* Moderation Actions */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => approvePost(post.id)}
                >
                  <Text style={styles.approveButtonText}>✓ Approve</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => rejectPost(post.id, 'Not educational content')}
                >
                  <Text style={styles.rejectButtonText}>✗ Reject</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deletePost(post.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Quick Rejection Reasons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Rejection Reasons</Text>
        <View style={styles.rejectionReasons}>
          <TouchableOpacity 
            style={styles.reasonButton}
            onPress={() => Alert.alert('Reason', 'Not educational content')}
          >
            <Text style={styles.reasonText}>Not educational content</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reasonButton}
            onPress={() => Alert.alert('Reason', 'Inappropriate content')}
          >
            <Text style={styles.reasonText}>Inappropriate content</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reasonButton}
            onPress={() => Alert.alert('Reason', 'Spam or advertising')}
          >
            <Text style={styles.reasonText}>Spam or advertising</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reasonButton}
            onPress={() => Alert.alert('Reason', 'Low quality content')}
          >
            <Text style={styles.reasonText}>Low quality content</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  refreshText: {
    color: Colors.blueColor,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.secondaryColor,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#F8F9FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    fontSize: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryColor,
    marginBottom: 2,
  },
  postedTime: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  scoreBadge: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.secondaryColor,
  },
  postDescription: {
    fontSize: 14,
    color: Colors.primaryColor,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.blueColor,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  deleteButton: {
    backgroundColor: '#757575',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  rejectionReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reasonButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    width: '48%',
  },
  reasonText: {
    fontSize: 12,
    color: Colors.primaryColor,
    textAlign: 'center',
  },
});

export default AuthenticatorModeration;