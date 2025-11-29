// components/StoryWidget.tsx
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../app/lib/providers/UserProvider';
import { Colors } from '../constants/color';
import { Images } from '../constants/images';

interface StoryWidgetProps {
  username: string;
  imageUrl: any;
  isOwnStory?: boolean;
  onPress?: () => void;
  storyId?: string;
  hasNewStories?: boolean;
}

const StoryWidget = ({ 
  username, 
  imageUrl, 
  isOwnStory = false, 
  onPress, 
  storyId,
  hasNewStories = false 
}: StoryWidgetProps) => {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const handleAddStory = async () => {
    setIsUploading(true);
    try {
      Alert.alert('Add Story', 'Story creation would open here');
    } catch (error) {
      Alert.alert('Error', 'Failed to create story');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePress = () => {
    if (isOwnStory) {
      handleAddStory();
    } else if (onPress) {
      onPress();
    } else {
      Alert.alert(`${username}'s Story`, 'Story playback would open here');
    }
  };

  const truncateUsername = (name: string) => {
    if (name.length > 8) {
      return `${name.substring(0, 8)}...`;
    }
    return name;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} disabled={isUploading}>
      <View style={styles.storyCircle}>
        {/* Show indicator for new stories */}
        {hasNewStories && !isOwnStory && (
          <View style={styles.newStoryIndicator} />
        )}
        
        {/* Outer gradient circle */}
        {!isOwnStory && hasNewStories && (
          <View style={[styles.gradientCircle, styles.newStoryGradient]} />
        )}
        
        <View style={styles.backgroundCircle} />
        
        <View style={styles.profileCircle}>
          <Image 
            source={imageUrl} 
            style={styles.profileImage}
            defaultSource={Images.defaultAvatar}
          />
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <Text style={styles.uploadingText}>+</Text>
            </View>
          )}
        </View>
        
        {isOwnStory && (
          <View style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.username}>
        {isOwnStory ? 'Your Story' : truncateUsername(username)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  storyCircle: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F58529',
  },
  backgroundCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: Colors.mobileBackgroundColor,
    position: 'absolute',
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.mobileBackgroundColor,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.blueColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: Colors.primaryColor,
    fontSize: 15,
    fontWeight: 'bold',
  },
  username: {
    color: Colors.primaryColor,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  newStoryIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3040',
    borderWidth: 2,
    borderColor: Colors.mobileBackgroundColor,
    zIndex: 10,
  },
  newStoryGradient: {
    backgroundColor: '#F58529',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoryWidget;