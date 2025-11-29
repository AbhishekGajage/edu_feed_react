// app/(tabs)/profile.tsx
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/color';
import { useUser } from '../lib/providers/UserProvider';
import { cloudinaryService } from '../lib/services/cloudinaryService';

const ProfileScreen = () => {
  const { user, updateUserProfile } = useUser();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(user?.followers?.length || 0);
  const [followingCount, setFollowingCount] = useState(user?.following?.length || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'saved'

  // Mock Data Setup
  useEffect(() => {
    if (!user?.uid) return;

    const mockPosts = [
      {
        id: '1',
        description: 'Just completed my Flutter project! 🎉',
        createdAt: new Date(),
        likes: 15,
        comments: 3,
        imageUrl: 'https://picsum.photos/300/200?random=1',
      },
      {
        id: '2',
        description: 'Learning React Native has been an amazing journey!',
        createdAt: new Date(),
        likes: 25,
        comments: 7,
        imageUrl: 'https://picsum.photos/300/200?random=2',
      },
      {
        id: '3',
        description: 'Built a cool mobile app today! #coding',
        createdAt: new Date(),
        likes: 42,
        comments: 12,
        imageUrl: 'https://picsum.photos/300/200?random=3',
      },
    ];

    setUserPosts(mockPosts);
    setPostCount(mockPosts.length);
    setFollowersCount(user.followers?.length || 0);
    setFollowingCount(user.following?.length || 0);
  }, [user]);

  // Handle Profile Picture Update
  const handleUpdateProfilePicture = useCallback(async () => {
    if (!user?.uid) {
      Alert.alert('Not logged in', 'Please log in to update your profile.');
      return;
    }

    setUploading(true);

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      const uploadResult = await cloudinaryService.uploadProfilePicture(
        result.assets[0].uri,
        user.uid
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      await updateUserProfile({ photoUrl: uploadResult.url });
      Alert.alert('✅ Success', 'Profile picture updated!');
    } catch (error: any) {
      console.error('Profile picture update error:', error);
      Alert.alert('❌ Error', error.message || 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  }, [user, updateUserProfile]);

  // Interactive Handlers
  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'What would you like to edit?',
      [
        { text: 'Change Username', onPress: () => Alert.alert('Coming Soon', 'Username change feature') },
        { text: 'Update Bio', onPress: () => Alert.alert('Coming Soon', 'Bio update feature') },
        { text: 'Add Interests', onPress: () => Alert.alert('Coming Soon', 'Interests update feature') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        setFollowersCount(prev => prev - 1);
        Alert.alert('Unfollowed', `You unfollowed ${user?.username}`);
      } else {
        setFollowersCount(prev => prev + 1);
        Alert.alert('Followed', `You are now following ${user?.username}`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
    }
  };

  const handleMessage = () => {
    Alert.alert('Message', `Starting conversation with ${user?.username}`);
  };

  const handleAddPost = () => {
    router.push('/add-posts');
  };

  const handleStatPress = (label: string) => {
    Alert.alert(
      `${label}`,
      `You have ${label === 'Posts' ? postCount : label === 'Followers' ? followersCount : followingCount} ${label.toLowerCase()}`,
      [{ text: 'OK' }]
    );
  };

  const handlePostPress = (post: any) => {
    Alert.alert(
      'Post Options',
      post.description,
      [
        { text: 'Like Post', onPress: () => handleLikePost(post.id) },
        { text: 'View Comments', onPress: () => handleViewComments(post.id) },
        { text: 'Share Post', onPress: () => handleSharePost(post) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLikePost = (postId: string) => {
    Alert.alert('Liked!', `You liked post ${postId}`);
  };

  const handleViewComments = (postId: string) => {
    Alert.alert('Comments', `Viewing comments for post ${postId}`);
  };

  const handleSharePost = (post: any) => {
    Alert.alert('Share', `Sharing: "${post.description}"`);
  };

  const handleInterestPress = (interest: string) => {
    Alert.alert('Interest', `Posts related to ${interest}`, [
      { text: 'View Posts', onPress: () => setActiveTab('posts') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    Alert.alert('Tab Changed', `Now viewing ${tab}`);
  };

  const buildStatColumn = (num: number, label: string) => (
    <TouchableOpacity style={styles.statColumn} onPress={() => handleStatPress(label)}>
      <Text style={styles.statNumber}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const buildActionButton = (text: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  const isCurrentUser = true;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleUpdateProfilePicture}
            disabled={uploading}
          >
            <Image
              source={{
                uri: user?.photoUrl || 'https://via.placeholder.com/80?text=No+Photo',
              }}
              style={styles.avatar}
            />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {buildStatColumn(postCount, 'Posts')}
              {buildStatColumn(followersCount, 'Followers')}
              {buildStatColumn(followingCount, 'Following')}
            </View>
            <View style={styles.actionsRow}>
              {isCurrentUser ? (
                <>
                  {buildActionButton('Edit Profile', handleEditProfile)}
                  <TouchableOpacity style={styles.addPostButton} onPress={handleAddPost}>
                    <Text style={styles.addPostIcon}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, isFollowing && styles.unfollowButton]}
                    onPress={handleFollow}
                  >
                    <Text style={styles.actionButtonText}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                    <Text style={styles.messageIcon}>💬</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.userDetails}>
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.username}>{user?.username || 'User'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Bio', 'Tap to edit your bio')}>
            <Text style={styles.bio}>{user?.bio || 'No bio yet. Tap to add one!'}</Text>
          </TouchableOpacity>
          <Text style={styles.userType}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
          </Text>
        </View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {user.interests.map((interest: string, index: number) => (
              <TouchableOpacity key={index} style={styles.interestChip} onPress={() => handleInterestPress(interest)}>
                <Text style={styles.interestText}>{interest}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.interestChip, styles.addInterestChip]} onPress={handleEditProfile}>
              <Text style={styles.interestText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
          onPress={() => handleTabPress('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]} 
          onPress={() => handleTabPress('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'posts' ? (
          userPosts.length > 0 ? (
            userPosts.map(post => (
              <TouchableOpacity key={post.id} style={styles.postPreview} onPress={() => handlePostPress(post)}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <View style={styles.postContent}>
                  <Text style={styles.postText}>{post.description}</Text>
                  <Text style={styles.postStats}>
                    ❤️ {post.likes} • 💬 {post.comments}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <TouchableOpacity style={styles.createFirstPostButton} onPress={handleAddPost}>
                <Text style={styles.createFirstPostText}>Create Your First Post</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved content</Text>
            <Text style={styles.emptyStateSubtext}>Save posts you like to see them here</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  header: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 20,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  statColumn: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.webBackgroundColor,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    marginRight: 8,
  },
  unfollowButton: {
    backgroundColor: Colors.blueColor,
  },
  actionButtonText: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addPostButton: {
    padding: 6,
    backgroundColor: Colors.blueColor,
    borderRadius: 4,
    marginLeft: 8,
  },
  addPostIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButton: {
    padding: 6,
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    marginLeft: 8,
  },
  messageIcon: {
    fontSize: 18,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 20,
    marginLeft: 8,
  },
  settingsIcon: {
    fontSize: 18,
  },
  userDetails: {
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  bio: {
    color: Colors.secondaryColor,
    marginBottom: 4,
    lineHeight: 20,
  },
  userType: {
    color: Colors.blueColor,
    fontWeight: 'bold',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: Colors.webBackgroundColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  addInterestChip: {
    backgroundColor: Colors.blueColor,
  },
  interestText: {
    color: Colors.primaryColor,
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryColor,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.blueColor,
  },
  tabText: {
    color: Colors.secondaryColor,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.blueColor,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  postPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 12,
  },
  postText: {
    fontSize: 14,
    color: Colors.primaryColor,
    marginBottom: 8,
  },
  postStats: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: Colors.secondaryColor,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  createFirstPostButton: {
    backgroundColor: Colors.blueColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  createFirstPostText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;