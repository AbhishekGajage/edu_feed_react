// // app/(tabs)/feed.tsx
// import { Colors } from '@/constants/color';
// import * as ImagePicker from 'expo-image-picker';
// import { LinearGradient } from 'expo-linear-gradient';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import GlassCard from '../../components/GlassCard';
// import PostCard from '../../components/PostCard';
// import StoryWidget from '../../components/StoryWidget';
// import { Images } from '../../constants/images';
// import { useUser } from '../lib/providers/UserProvider';
// import { cloudinaryService } from '../lib/services/cloudinaryService';
// import { databaseService } from '../lib/services/databaseService';

// // Extend cloudinaryService with helper (if not already added)
// if (!cloudinaryService.uploadImage) {
//   (cloudinaryService as any).uploadImage = async (
//     uri: string,
//     userId: string
//   ): Promise<{ success: boolean; url?: string; error?: string }> => {
//     try {
//       const url = await cloudinaryService.uploadImage(
//         uri,
//         `edu_feed/posts/${userId}`
//       );
//       if (!url) throw new Error('Upload returned no URL');
//       return { success: true, url };
//     } catch (error: any) {
//       return { success: false, error: error.message || 'Upload failed' };
//     }
//   };
// }

// const FeedScreen = () => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [posts, setPosts] = useState<any[]>([]);
//   const [stories, setStories] = useState<any[]>([]);
//   const [creatingPost, setCreatingPost] = useState(false);
//   const { user } = useUser();

//   // ─── Mock Data Initialization ─────────────────────────────────────────────
//   useEffect(() => {
//     const mockPosts = [
//       {
//         id: '1',
//         userId: 'abc123',
//         username: 'John Doe',
//         description: 'Just learned about quantum physics! Amazing stuff!',
//         imageUrl: 'https://picsum.photos/400/300?random=1',
//         likes: 15,
//         comments: 3,
//         createdAt: new Date(),
//       },
//       {
//         id: '2',
//         userId: 'def456',
//         username: 'Jane Smith',
//         description: 'Check out this cool programming trick!',
//         imageUrl: 'https://picsum.photos/400/300?random=2',
//         likes: 25,
//         comments: 7,
//         createdAt: new Date(),
//       },
//     ];

//     setPosts(mockPosts);
    
//     setStories([
//       { id: '1', username: 'Your Story', userId: user?.uid, isOwnStory: true },
//       { id: '2', username: 'Flutter Community', hasNewStories: true },
//       { id: '3', username: 'Tech News', hasNewStories: true },
//       { id: '4', username: 'Study Tips' },
//       { id: '5', username: 'Career Advice' },
//       { id: '6', username: 'Alumni Stories' },
//     ]);
//   }, [user?.uid]);

//   // ─── Refresh Handler ───────────────────────────────────────────────────────
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     // Later: replace with actual data fetch
//     setTimeout(() => setRefreshing(false), 1000);
//   }, []);

//   // ─── Post Actions ──────────────────────────────────────────────────────────
//   const handlePostDelete = (postId: string) => {
//     if (!user?.uid) return;

//     Alert.alert(
//       'Delete Post',
//       'Are you sure you want to delete this post?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             const result = await databaseService.deletePost(postId, user.uid);
//             if (result.success) {
//               setPosts(prev => prev.filter(p => p.id !== postId));
//             } else {
//               Alert.alert('Error', result.error || 'Failed to delete post');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleCommentPress = (postId: string) => {
//     console.log('Navigate to comments for post:', postId);
//     // Later: navigation.navigate('Comments', { postId });
//   };

//   // ─── Helper: Input Description ─────────────────────────────────────────────
//   const showDescriptionInput = (): Promise<string | null> => {
//     return new Promise((resolve) =>
//       Alert.prompt(
//         'New Post',
//         'What would you like to share?',
//         [
//           { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
//           {
//             text: 'Post',
//            onPress: (text: string | undefined) => resolve((text || '').trim()),
//           },
//         ],
//         'plain-text',
//         '',
//         'default'
//       )
//     );
//   };

//   // ─── Create Post Logic ─────────────────────────────────────────────────────
//   const handleCreatePost = useCallback(async () => {
//     if (!user?.uid || !user.username) {
//       Alert.alert('Not logged in', 'Please log in to create a post.');
//       return;
//     }

//     setCreatingPost(true);

//     try {
//       // 1. Get description
//       const description = await showDescriptionInput();
//       if (!description || description.length === 0) return;

//       // 2. Request permission & pick image
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Allow access to your photos.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 0.8,
//         allowsEditing: true,
//         aspect: [4, 3],
//       });

//       if (result.canceled || !result.assets?.[0]?.uri) return;

//       // 3. Upload to Cloudinary (uses your preset: edugram_upload & cloud: dfbrweqii)
//       const uploadResult = await (cloudinaryService as any).uploadPostImage(
//         result.assets[0].uri,
//         user.uid
//       );

//       if (!uploadResult.success) {
//         throw new Error(uploadResult.error || 'Upload failed');
//       }

//       // 4. Save to Firestore
//       const createResult = await databaseService.createPost({
//         userId: user.uid,
//         username: user.username,
//         description,
//         imageUrl: uploadResult.url!,
//         type: 'image',
//         category: 'study',
//         tags: ['learning'],
//       });

//       if (!createResult.success) {
//         throw new Error(createResult.error || 'Failed to save post');
//       }

//       Alert.alert('✅ Success', 'Your post is live!');
//     } catch (error: any) {
//       console.error('Create post error:', error);
//       Alert.alert('❌ Error', error.message || 'Failed to create post');
//     } finally {
//       setCreatingPost(false);
//     }
//   }, [user]);

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* App Bar */}
//         <LinearGradient
//           colors={['#667EEA', '#764BA2']}
//           style={styles.appBar}
//         >
//           <View style={styles.appBarContent}>
//             <Text style={styles.appBarTitle}>EduGram Feed</Text>
//             <Text style={styles.appBarSubtitle}>Discover educational content</Text>
//           </View>
//         </LinearGradient>

//         {/* Stories */}
//         <View style={styles.storiesSection}>
//           <FlatList
//             horizontal
//             data={stories}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.storiesList}
//             renderItem={({ item }) => (
//               <StoryWidget
//                 username={item.username}
//                 imageUrl={Images.defaultAvatar}
//                 isOwnStory={item.isOwnStory}
//                 hasNewStories={item.hasNewStories}
//               />
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         </View>

//         {/* Posts */}
//         <View style={styles.postsContainer}>
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <View key={post.id} style={styles.postWrapper}>
//                 <GlassCard style={styles.postCard}>
//                   <PostCard
//                     post={post}
//                     onDelete={() => handlePostDelete(post.id)}
//                     onCommentPress={() => handleCommentPress(post.id)}
//                   />
//                 </GlassCard>
//               </View>
//             ))
//           ) : (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyStateText}>No posts yet</Text>
//               <Text style={styles.emptyStateSubtext}>Be the first to share something!</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Floating Create Button */}
//       {user && (
//         <TouchableOpacity
//           style={[
//             styles.createPostButton,
//             creatingPost && styles.createPostButtonDisabled,
//           ]}
//           onPress={handleCreatePost}
//           disabled={creatingPost}
//         >
//           <Text style={styles.createPostText}>
//             {creatingPost ? '⋯' : '+'}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.mobileBackgroundColor,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   appBar: {
//     height: 200,
//     justifyContent: 'flex-end',
//     paddingBottom: 30,
//     paddingLeft: 20,
//   },
//   appBarContent: {
//     marginTop: 60,
//   },
//   appBarTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   appBarSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.7)',
//   },
//   storiesSection: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//   },
//   storiesList: {
//     paddingHorizontal: 15,
//   },
//   postsContainer: {
//     padding: 16,
//   },
//   postWrapper: {
//     marginVertical: 8,
//   },
//   postCard: {
//     padding: 0,
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 18,
//     color: Colors.secondaryColor,
//     marginBottom: 8,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: Colors.secondaryColor,
//   },
//   createPostButton: {
//     position: 'absolute',
//     bottom: 80,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#667EEA',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     zIndex: 10,
//   },
//   createPostButtonDisabled: {
//     opacity: 0.6,
//   },
//   createPostText: {
//     color: '#FFFFFF',
//     fontSize: 32,
//     fontWeight: 'bold',
//     lineHeight: 32,
//   },
// });

// export default FeedScreen;

// app/(tabs)/feed.tsx
import { Colors } from '@/constants/color';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import GlassCard from '../../components/GlassCard';
import PostCard from '../../components/PostCard';
import StoryWidget from '../../components/StoryWidget';
import { Images } from '../../constants/images';
import { useUser } from '../lib/providers/UserProvider';
import { cloudinaryService } from '../lib/services/cloudinaryService';
import { databaseService } from '../lib/services/databaseService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Extend cloudinaryService with helper
if (!cloudinaryService.uploadImage) {
  (cloudinaryService as any).uploadImage = async (
    uri: string,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const url = await cloudinaryService.uploadImage(
        uri,
        `edu_feed/posts/${userId}`
      );
      if (!url) throw new Error('Upload returned no URL');
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' };
    }
  };
}

const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const { user } = useUser();

  // Mock Data Initialization
  useEffect(() => {
    const mockPosts = [
      {
        id: '1',
        userId: 'abc123',
        username: 'John Doe',
        description: 'Just learned about quantum physics! Amazing stuff! The double-slit experiment shows how particles can behave like waves.',
        imageUrl: 'https://picsum.photos/400/300?random=1',
        likes: 15,
        comments: 3,
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: 'def456',
        username: 'Jane Smith',
        description: 'Check out this cool programming trick! Learning React Native has been an amazing journey so far.',
        imageUrl: 'https://picsum.photos/400/300?random=2',
        likes: 25,
        comments: 7,
        createdAt: new Date(),
      },
      {
        id: '3',
        userId: 'ghi789',
        username: 'Mike Johnson',
        description: 'Mathematical proof of Pythagorean theorem using geometry and algebra concepts. So fascinating!',
        imageUrl: 'https://picsum.photos/400/300?random=3',
        likes: 42,
        comments: 12,
        createdAt: new Date(),
      },
      {
        id: '4',
        userId: 'jkl012',
        username: 'Sarah Wilson',
        description: 'Built my first Flutter app today! The hot reload feature makes development so much faster.',
        imageUrl: 'https://picsum.photos/400/300?random=4',
        likes: 38,
        comments: 8,
        createdAt: new Date(),
      },
    ];

    setPosts(mockPosts);
    
    setStories([
      { id: '1', username: 'Your Story', userId: user?.uid, isOwnStory: true },
      { id: '2', username: 'Flutter Community', hasNewStories: true },
      { id: '3', username: 'Tech News', hasNewStories: true },
      { id: '4', username: 'Study Tips' },
      { id: '5', username: 'Career Advice' },
      { id: '6', username: 'Alumni Stories' },
    ]);
  }, [user?.uid]);

  // Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Post Actions
  const handlePostDelete = (postId: string) => {
    if (!user?.uid) return;

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await databaseService.deletePost(postId, user.uid);
            if (result.success) {
              setPosts(prev => prev.filter(p => p.id !== postId));
            } else {
              Alert.alert('Error', result.error || 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const handleCommentPress = (postId: string) => {
    console.log('Navigate to comments for post:', postId);
  };

  // Helper: Input Description
  const showDescriptionInput = (): Promise<string | null> => {
    return new Promise((resolve) =>
      Alert.prompt(
        'New Post',
        'What would you like to share?',
        [
          { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
          {
            text: 'Post',
           onPress: (text: string | undefined) => resolve((text || '').trim()),
          },
        ],
        'plain-text',
        '',
        'default'
      )
    );
  };

  // Create Post Logic
  const handleCreatePost = useCallback(async () => {
    if (!user?.uid || !user.username) {
      Alert.alert('Not logged in', 'Please log in to create a post.');
      return;
    }

    setCreatingPost(true);

    try {
      // 1. Get description
      const description = await showDescriptionInput();
      if (!description || description.length === 0) return;

      // 2. Request permission & pick image
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      // 3. Upload to Cloudinary
      const uploadResult = await (cloudinaryService as any).uploadPostImage(
        result.assets[0].uri,
        user.uid
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // 4. Save to Firestore
      const createResult = await databaseService.createPost({
        userId: user.uid,
        username: user.username,
        description,
        imageUrl: uploadResult.url!,
        type: 'image',
        category: 'study',
        tags: ['learning'],
      });

      if (!createResult.success) {
        throw new Error(createResult.error || 'Failed to save post');
      }

      Alert.alert('✅ Success', 'Your post is live!');
    } catch (error: any) {
      console.error('Create post error:', error);
      Alert.alert('❌ Error', error.message || 'Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  }, [user]);

  // Reverse scroll container
  const ReverseScrollContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.reverseContainer}>
      <View style={styles.reverseContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* App Bar - Fixed at Bottom */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.appBar}
      >
        <View style={styles.appBarContent}>
          <Text style={styles.appBarTitle}>EduGram Feed</Text>
          <Text style={styles.appBarSubtitle}>Discover educational content</Text>
        </View>
      </LinearGradient>

      {/* Main Content with Reverse Scroll */}
      <View style={styles.mainContent}>
        {/* Stories at Bottom */}
        <View style={styles.storiesSection}>
          <FlatList
            horizontal
            data={stories}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
            renderItem={({ item }) => (
              <StoryWidget
                username={item.username}
                imageUrl={Images.defaultAvatar}
                isOwnStory={item.isOwnStory}
                hasNewStories={item.hasNewStories}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Posts with Reverse Scroll */}
        <ReverseScrollContainer>
          <FlatList
            data={posts}
            inverted // This reverses the scroll direction
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.postsContainer}
            renderItem={({ item, index }) => (
              <View key={item.id} style={[
                styles.postWrapper,
                { marginTop: index === 0 ? 0 : 8 }
              ]}>
                <GlassCard style={styles.postCard}>
                  <PostCard
                    post={item}
                    onDelete={() => handlePostDelete(item.id)}
                    onCommentPress={() => handleCommentPress(item.id)}
                  />
                </GlassCard>
              </View>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No posts yet</Text>
                <Text style={styles.emptyStateSubtext}>Be the first to share something!</Text>
              </View>
            }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#667EEA']}
                tintColor="#667EEA"
              />
            }
          />
        </ReverseScrollContainer>
      </View>

      {/* Floating Create Button - Now at Top */}
      {user && (
        <TouchableOpacity
          style={[
            styles.createPostButton,
            creatingPost && styles.createPostButtonDisabled,
          ]}
          onPress={handleCreatePost}
          disabled={creatingPost}
        >
          <Text style={styles.createPostText}>
            {creatingPost ? '⋯' : '+'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mobileBackgroundColor,
  },
  // Reverse scroll styles
  reverseContainer: {
    flex: 1,
    transform: [{ scaleY: -1 }], // This flips the container
  },
  reverseContent: {
    transform: [{ scaleY: -1 }], // This flips the content back to normal
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column-reverse', // This puts stories at bottom
  },
  // App Bar at Bottom
  appBar: {
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  appBarContent: {
    marginTop: 10,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appBarSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Stories at Bottom (above app bar)
  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.mobileSearchColor,
  },
  storiesList: {
    paddingHorizontal: 15,
  },
  // Posts container
  postsContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for app bar
  },
  postWrapper: {
    marginVertical: 8,
  },
  postCard: {
    padding: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    transform: [{ scaleY: -1 }], // Fix empty state orientation
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
  // Create button at Top
  createPostButton: {
    position: 'absolute',
    top: 50, // Changed from bottom to top
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667EEA',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  createPostButtonDisabled: {
    opacity: 0.6,
  },
  createPostText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
});

export default FeedScreen;