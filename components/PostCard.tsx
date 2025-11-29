// components/PostCard.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';
import GlassCard from './GlassCard';

// Define the interface for PostCard props
interface PostCardProps {
  snap?: any;
  post?: any;
  onDelete?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
}

const PostCard = ({ snap, post, onDelete, onCommentPress }: PostCardProps) => {
  // Use snap if provided, otherwise use post (for backward compatibility)
  const postData = snap || post;
  
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(postData?.likes || 0);
  const [imageLoading, setImageLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(postData?.comments || 0);

  // Mock database service functions (replace with actual implementation)
  const databaseService = {
    unlikePost: async (postId: string, userId: string) => {
      console.log('Unlike post:', postId, userId);
    },
    likePost: async (postId: string, userId: string) => {
      console.log('Like post:', postId, userId);
    },
    unsavePost: async (postId: string, userId: string) => {
      console.log('Unsave post:', postId, userId);
    },
    savePost: async (postId: string, userId: string) => {
      console.log('Save post:', postId, userId);
    },
    deletePost: async (postId: string, userId: string) => {
      console.log('Delete post:', postId, userId);
    }
  };

  useEffect(() => {
    if (postData) {
      setIsLiked(postData.likedBy?.includes(user?.uid) || false);
      setIsSaved(user?.savedPosts?.includes(postData.id) || false);
      setLikeCount(postData.likes || 0);
      setCommentCount(postData.comments || 0);
    }
  }, [postData, user]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await databaseService.unlikePost(postData.id, user?.uid || '');
        setLikeCount((prev: number) => prev - 1);
      } else {
        await databaseService.likePost(postData.id, user?.uid || '');
        setLikeCount((prev: number) => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await databaseService.unsavePost(postData.id, user?.uid || '');
      } else {
        await databaseService.savePost(postData.id, user?.uid || '');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      Alert.alert('Error', 'Failed to save post');
    }
  };

  const handleComment = () => {
    if (onCommentPress) {
      onCommentPress(postData.id);
    } else {
      Alert.alert('Comments', 'Comment functionality would open here');
    }
  };

  const handleShare = async () => {
    try {
      Alert.alert('Share', 'Share post with others');
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const deletePost = () => {
    const isOwnPost = postData.userId === user?.uid;
    const canDeleteAny = user?.role === 'admin' || user?.role === 'authenticator';
    
    if (isOwnPost || canDeleteAny) {
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              try {
                await databaseService.deletePost(postData.id, user?.uid || '');
                onDelete?.(postData.id);
                Alert.alert('Success', 'Post deleted successfully');
              } catch (error) {
                Alert.alert('Error', 'Failed to delete post');
              }
            }
          },
        ]
      );
    } else {
      Alert.alert('Permission Denied', 'You can only delete your own posts.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const difference = now.getTime() - date.getTime();

    if (difference > 365 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(difference / (365 * 24 * 60 * 60 * 1000))}y ago`;
    } else if (difference > 30 * 24 * 60 * 60 * 1000) {
      return `${Math.floor(difference / (30 * 24 * 60 * 60 * 1000))}mo ago`;
    } else if (difference > 24 * 60 * 60 * 1000) {
      return `${Math.floor(difference / (24 * 60 * 60 * 1000))}d ago`;
    } else if (difference > 60 * 60 * 1000) {
      return `${Math.floor(difference / (60 * 60 * 1000))}h ago`;
    } else if (difference > 60 * 1000) {
      return `${Math.floor(difference / (60 * 1000))}m ago`;
    } else {
      return 'Just now';
    }
  };

  const formatCategory = (category: string) => {
    return category ? category[0].toUpperCase() + category.substring(1) : 'Study';
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'study': return '📚';
      case 'internship': return '💼';
      case 'scholarship': return '🎓';
      case 'achievement': return '🏆';
      default: return '📝';
    }
  };

  const buildEngagementButton = (icon: string, color: string, label: string, onPress: () => void) => (
    <TouchableOpacity style={styles.engagementButton} onPress={onPress}>
      <Text style={[styles.engagementIcon, { color }]}>{icon}</Text>
      <Text style={styles.engagementLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const calculateEducationalScore = (post: any) => {
    let score = 50;
    const educationalKeywords = ['learn', 'study', 'education', 'knowledge', 'teaching', 'school', 'college', 'university'];
    const postText = (post?.description || '').toLowerCase();
    
    educationalKeywords.forEach(keyword => {
      if (postText.includes(keyword)) score += 10;
    });
    
    if (post?.category === 'study') score += 20;
    if ((post?.description || '').length < 10) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  };

  const renderModerationBadge = () => {
    if (user?.role === 'authenticator' || user?.role === 'admin') {
      const educationalScore = calculateEducationalScore(postData);
      
      return (
        <View style={[
          styles.moderationBadge,
          { 
            backgroundColor: educationalScore >= 80 ? '#4CAF50' : 
                           educationalScore >= 60 ? '#FF9800' : '#F44336'
          }
        ]}>
          <Text style={styles.moderationText}>
            {educationalScore}% Educational
          </Text>
        </View>
      );
    }
    return null;
  };

  const isOwnPost = postData?.userId === user?.uid;

  // If no post data, return null or a placeholder
  if (!postData) {
    return (
      <GlassCard style={styles.card}>
        <Text>No post data available</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.card}>
      {renderModerationBadge()}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {postData.userPhoto ? (
            <Image 
              source={{ uri: postData.userPhoto }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {postData.username?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{postData.username || 'User'}</Text>
          <Text style={styles.userDetails}>
            {getCategoryEmoji(postData.category)} {formatCategory(postData.category)}
          </Text>
        </View>
        {(isOwnPost || user?.role === 'admin' || user?.role === 'authenticator') && (
          <TouchableOpacity onPress={deletePost}>
            <Text style={styles.moreButton}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      {postData.description && (
        <Text style={styles.description}>{postData.description}</Text>
      )}

      {/* Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={handleLike}>
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator color={Colors.blueColor} />
          </View>
        )}
        <Image
          source={{ uri: postData.imageUrl || 'https://via.placeholder.com/600x400/667EEA/FFFFFF?text=Educational+Content' }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        {isLiked && (
          <View style={styles.likeOverlay}>
            <Text style={styles.likeIcon}>❤️</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Engagement Bar */}
      <View style={styles.engagementBar}>
        <View style={styles.engagementRow}>
          {buildEngagementButton(
            isLiked ? '❤️' : '🤍',
            isLiked ? '#FF0000' : Colors.secondaryColor,
            likeCount.toString(),
            handleLike
          )}
          {buildEngagementButton(
            '💬',
            Colors.secondaryColor,
            commentCount.toString(),
            handleComment
          )}
          {buildEngagementButton(
            '↗️',
            Colors.secondaryColor,
            'Share',
            handleShare
          )}
          <View style={styles.spacer} />
          {buildEngagementButton(
            isSaved ? '🔖' : '📑',
            isSaved ? Colors.blueColor : Colors.secondaryColor,
            'Save',
            handleSave
          )}
        </View>

        {/* Tags */}
        {postData.tags && postData.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {postData.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Post Info */}
        <View style={styles.postInfo}>
          <Text style={styles.postInfoText}>
            {postData.estimatedReadTime || 5} min read
          </Text>
          <Text style={styles.postInfoText}>
            {formatDate(postData.createdAt)}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.blueColor}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.blueColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryColor,
  },
  userDetails: {
    fontSize: 12,
    color: Colors.secondaryColor,
    marginTop: 4,
  },
  moreButton: {
    fontSize: 20,
    color: Colors.secondaryColor,
    fontWeight: 'bold',
  },
  description: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    color: Colors.primaryColor,
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mobileBackgroundColor,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 80,
  },
  engagementBar: {
    padding: 16,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  engagementIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  engagementLabel: {
    fontSize: 12,
    color: Colors.secondaryColor,
  },
  spacer: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: `${Colors.blueColor}1A`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.blueColor,
    fontSize: 12,
    fontWeight: '500',
  },
  postInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  postInfoText: {
    fontSize: 12,
    color: Colors.secondaryColor,
    marginRight: 12,
  },
  moderationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  moderationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PostCard;