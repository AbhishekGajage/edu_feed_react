// app/(tabs)/shorts.tsx
import { ResizeMode, Video } from 'expo-av';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '../lib/providers/UserProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Educational content with reliable video URLs
const EducationalShorts = [
//   id: '2',
// //     videoUrl: require('../../assets/videos/programming.mp4'), // Add your own video
// //     imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=700&fit=crop',
// //     title: 'Python Programming Basics',
// //     creator: 'CodeMaster',
// //     views: '2.3M',
// //     likes: 189000,
// //     subject: 'Programming'
// },
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-student-reading-a-book-while-sitting-on-a-bench-50855-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=700&fit=crop',
    title: 'Study Techniques',
    creator: 'StudySmart',
    views: '1.5M',
    likes: 125000,
    subject: 'Study Tips'
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-5080-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=700&fit=crop',
    title: 'Programming Basics',
    creator: 'CodeMaster',
    views: '2.3M',
    likes: 189000,
    subject: 'Programming'
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-book-and-looking-at-it-50858-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=700&fit=crop',
    title: 'Reading Methods',
    creator: 'LearningPro',
    views: '980K',
    likes: 87000,
    subject: 'Learning Skills'
  },
  {
    id: '4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-someone-using-a-laptop-5083-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=700&fit=crop',
    title: 'Online Learning',
    creator: 'EduTech',
    views: '1.5M',
    likes: 125000,
    subject: 'Education'
  },
  {
    id: '5',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-laptop-5082-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=700&fit=crop',
    title: 'Research Skills',
    creator: 'AcademicPro',
    views: '1.5M',
    likes: 125000,
    subject: 'Academic'
  },
  {
    id: '6',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-working-on-a-laptop-5087-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=700&fit=crop',
    title: 'Coding Practice',
    creator: 'CodeMaster',
    views: '1.5M',
    likes: 125000,
    subject: 'Programming'
  },
  {
    id: '7',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-studying-with-a-laptop-5081-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=700&fit=crop',
    title: 'Study Session',
    creator: 'StudySmart',
    views: '1.5M',
    likes: 125000,
    subject: 'Study Tips'
  },
  {
    id: '8',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-reading-a-book-50857-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
    title: 'Book Reading',
    creator: 'LiteratureLover',
    views: '1.5M',
    likes: 125000,
    subject: 'Literature'
  },
  {
    id: '9',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-female-designer-working-on-her-laptop-5088-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=700&fit=crop',
    title: 'Design Principles',
    creator: 'DesignMaster',
    views: '1.5M',
    likes: 125000,
    subject: 'Design'
  },
  {
    id: '10',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-laptop-5086-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=700&fit=crop',
    title: 'Online Course',
    creator: 'EduTech',
    views: '1.5M',
    likes: 125000,
    subject: 'Education'
  },
  {
    id: '11',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-using-a-laptop-5084-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&h=700&fit=crop',
    title: 'Tech Learning',
    creator: 'TechGuru',
    views: '1.5M',
    likes: 125000,
    subject: 'Technology'
  },
  {
    id: '12',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-using-a-tablet-5089-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&h=700&fit=crop',
    title: 'Digital Learning',
    creator: 'EduTech',
    views: '1.5M',
    likes: 125000,
    subject: 'Education'
  },
  {
    id: '13',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-using-a-laptop-5090-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=700&fit=crop',
    title: 'Programming Tutorial',
    creator: 'CodeMaster',
    views: '1.5M',
    likes: 125000,
    subject: 'Programming'
  },
  {
    id: '14',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-book-50856-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=700&fit=crop',
    title: 'Literature Study',
    creator: 'LiteratureLover',
    views: '1.5M',
    likes: 125000,
    subject: 'Literature'
  },
  {
    id: '15',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-using-a-laptop-5091-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=700&fit=crop',
    title: 'Online Research',
    creator: 'ResearchPro',
    views: '1.5M',
    likes: 125000,
    subject: 'Research'
  },
  {
    id: '16',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-studying-5092-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=700&fit=crop',
    title: 'Math Practice',
    creator: 'MathGenius',
    views: '1.5M',
    likes: 125000,
    subject: 'Mathematics'
  },
  {
    id: '17',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-using-a-laptop-5093-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=700&fit=crop',
    title: 'Science Concepts',
    creator: 'SciencePro',
    views: '1.5M',
    likes: 125000,
    subject: 'Science'
  },
  {
    id: '18',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-writing-in-a-notebook-5094-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=700&fit=crop',
    title: 'Note Taking',
    creator: 'StudySmart',
    views: '1.5M',
    likes: 125000,
    subject: 'Study Tips'
  },
  {
    id: '19',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-reading-a-book-5095-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
    title: 'History Study',
    creator: 'HistoryBuff',
    views: '1.5M',
    likes: 125000,
    subject: 'History'
  },
  {
    id: '20',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-solving-a-problem-on-a-laptop-5096-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=700&fit=crop',
    title: 'Problem Solving',
    creator: 'MathGenius',
    views: '1.5M',
    likes: 125000,
    subject: 'Mathematics'
  },
  {
    id: '21',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-student-reading-a-book-while-sitting-on-a-bench-50855-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=700&fit=crop',
    title: 'Effective Study Techniques',
    creator: 'StudySmart',
    views: '1.5M',
    likes: 125000,
    subject: 'Study Tips'
  },
  {
    id: '22',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-5080-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=700&fit=crop',
    title: 'Programming Fundamentals',
    creator: 'CodeMaster',
    views: '2.3M',
    likes: 189000,
    subject: 'Programming'
  },
  {
    id: '23',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-book-and-looking-at-it-50858-large.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=700&fit=crop',
    title: 'Reading Comprehension',
    creator: 'LearningPro',
    views: '980K',
    likes: 87000,
    subject: 'Learning Skills'
  }
];

const ShortsScreen = () => {
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [videoStates, setVideoStates] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: Video | null }>({});

  // Stop all videos when leaving the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAllVideos();
      };
    }, [])
  );

  // Stop videos on unmount
  React.useEffect(() => {
    return () => {
      stopAllVideos();
    };
  }, []);

  const stopAllVideos = async () => {
    Object.values(videoRefs.current).forEach(async (ref) => {
      if (ref) {
        try {
          await ref.pauseAsync();
          await ref.setPositionAsync(0);
        } catch (error) {
          console.warn('Error stopping video:', error);
        }
      }
    });
  };

  // Handle video playback when scrolling
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      const previousIndex = currentIndex;
      setCurrentIndex(newIndex);

      // Stop previous video
      const previousItem = EducationalShorts[previousIndex];
      if (previousItem && videoRefs.current[previousItem.id]) {
        videoRefs.current[previousItem.id]?.pauseAsync().catch(() => {});
      }

      // Play new video if it exists and has no errors
      const currentItem = EducationalShorts[newIndex];
      if (currentItem?.videoUrl && !videoErrors.has(currentItem.id)) {
        const currentVideo = videoRefs.current[currentItem.id];
        if (currentVideo) {
          currentVideo.playAsync().catch((error) => {
            console.warn('Error playing video:', error);
            setVideoErrors(prev => new Set(prev.add(currentItem.id)));
          });
        }
      }
    }
  }).current;

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleVideoError = (videoId: string) => {
    console.log(`Video ${videoId} error - using fallback`);
    setVideoErrors(prev => new Set(prev.add(videoId)));
  };

  // Handle video playback status
  const handlePlaybackStatusUpdate = (videoId: string, status: any) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        // Video finished - don't restart automatically
        console.log(`Video ${videoId} finished playing`);
        setVideoStates(prev => ({ ...prev, [videoId]: false }));
      } else if (status.isPlaying) {
        setVideoStates(prev => ({ ...prev, [videoId]: true }));
      }
    }
  };

  // Manual play/pause control
  const togglePlayPause = async (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    try {
      const status = await video.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await video.pauseAsync();
          setVideoStates(prev => ({ ...prev, [videoId]: false }));
        } else {
          await video.playAsync();
          setVideoStates(prev => ({ ...prev, [videoId]: true }));
        }
      }
    } catch (error) {
      console.warn('Playback control error:', error);
    }
  };

  // Restart video manually
  const restartVideo = async (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (video) {
      try {
        await video.setPositionAsync(0);
        await video.playAsync();
        setVideoStates(prev => ({ ...prev, [videoId]: true }));
      } catch (error) {
        console.warn('Error restarting video:', error);
      }
    }
  };

  const renderShortItem = ({ item, index }: { item: typeof EducationalShorts[0]; index: number }) => {
    const isLiked = likedVideos.has(item.id);
    const hasVideoError = videoErrors.has(item.id);
    const isCurrent = index === currentIndex;
    const isPlaying = videoStates[item.id];

    return (
      <View style={styles.videoContainer}>
        {/* Image Fallback - Always visible */}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.videoImage}
          resizeMode="cover"
        />
        
        {/* Video Overlay - Only if video exists and no errors */}
        {item.videoUrl && !hasVideoError && (
          <Video
            ref={(ref) => {
              videoRefs.current[item.id] = ref;
            }}
            source={{ uri: item.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isCurrent}
            isLooping={false} // IMPORTANT: Disable looping to prevent auto-restart
            useNativeControls={false}
            onError={() => handleVideoError(item.id)}
            onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(item.id, status)}
          />
        )}

        {/* Play/Pause Overlay */}
        <TouchableOpacity 
          style={styles.videoTouchArea}
          onPress={() => togglePlayPause(item.id)}
          activeOpacity={0.9}
        >
          {!isPlaying && isCurrent && !hasVideoError && (
            <View style={styles.playButtonOverlay}>
              <Text style={styles.playButton}>▶️</Text>
              <Text style={styles.playButtonText}>Tap to play</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          <View style={styles.textContent}>
            <View style={styles.subjectTag}>
              <Text style={styles.subjectText}>{item.subject}</Text>
            </View>
            <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.creator}>@{item.creator}</Text>
            <Text style={styles.views}>{item.views} views • Educational</Text>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionItem}>
            <View style={styles.profileContainer}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileIcon}>👨‍🏫</Text>
              </View>
              <Text style={styles.addIcon}>+</Text>
            </View>
          </View>
          
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <Text style={styles.actionCount}>
              {isLiked ? (item.likes + 1).toLocaleString() : item.likes.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => Alert.alert('Discussion', `Join the discussion about "${item.title}"`)}>
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>
            <Text style={styles.actionCount}>12K</Text>
          </View>
          
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => restartVideo(item.id)}>
              <Text style={styles.actionIcon}>🔄</Text>
            </TouchableOpacity>
            <Text style={styles.actionCount}>Restart</Text>
          </View>
          
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => Alert.alert('Saved!', `"${item.title}" saved to your learning collection`)}>
              <Text style={styles.actionIcon}>📚</Text>
            </TouchableOpacity>
            <Text style={styles.actionCount}>Save</Text>
          </View>
        </View>

        {/* Video Status Indicator */}
        <View style={styles.videoStatus}>
          <Text style={styles.videoStatusText}>
            {hasVideoError ? '📸 Image Only' : (isPlaying ? '▶️ Playing' : '⏸️ Paused')}
          </Text>
        </View>
      </View>
    );
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
    waitForInteraction: true,
    minimumViewTime: 100,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={EducationalShorts}
        renderItem={renderShortItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      {/* Controls */}
      <TouchableOpacity 
        style={styles.stopAllButton}
        onPress={stopAllVideos}
      >
        <Text style={styles.stopAllText}>⏹️ Stop All</Text>
      </TouchableOpacity>

      <View style={styles.videoIndicator}>
        <Text style={styles.videoIndicatorText}>
          📚 {currentIndex + 1} / {EducationalShorts.length}
        </Text>
      </View>

      {user && (
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>🎓 Create Short</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  videoTouchArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  playButton: {
    fontSize: 40,
    marginBottom: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  textContent: {
    marginBottom: 100,
  },
  subjectTag: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  subjectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: 24,
  },
  creator: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    fontWeight: '600',
  },
  views: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileIcon: {
    fontSize: 20,
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 4,
    fontWeight: 'bold',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoStatus: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  videoStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stopAllButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  stopAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 100,
  },
  videoIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  createButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: '#667EEA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
 export default ShortsScreen;
// app/(tabs)/shorts.tsx
// import { Audio, ResizeMode, Video } from 'expo-av';
// import { useFocusEffect } from 'expo-router';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import { useUser } from '../lib/providers/UserProvider';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // Use local videos - you need to add these files to your assets/videos folder
// const EducationalShorts = [
//   {
//     id: '1',
//     videoUrl: require('../../assets/videos/study-tips.mp4'), // Add your own video
//     imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=700&fit=crop',
//     title: 'Effective Study Techniques',
//     creator: 'StudySmart',
//     views: '1.5M',
//     likes: 125000,
//     subject: 'Study Tips'
//   },
//   {
//     id: '2',
//     videoUrl: require('../../assets/videos/programming.mp4'), // Add your own video
//     imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=700&fit=crop',
//     title: 'Python Programming Basics',
//     creator: 'CodeMaster',
//     views: '2.3M',
//     likes: 189000,
//     subject: 'Programming'
//   },
//   {
//     id: '3',
//     videoUrl: require('../../assets/videos/math-tutorial.mp4'), // Add your own video
//     imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=700&fit=crop',
//     title: 'Mathematics Made Easy',
//     creator: 'MathGenius',
//     views: '1.8M',
//     likes: 156000,
//     subject: 'Mathematics'
//   },
// ];

// const ShortsScreen = () => {
//   const { user } = useUser();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
//   const [videoStates, setVideoStates] = useState<{ [key: string]: boolean }>({});
//   const videoRefs = useRef<{ [key: string]: Video | null }>({});

//   // Configure audio mode for videos
//   useEffect(() => {
//     const configureAudio = async () => {
//       try {
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: false,
//           staysActiveInBackground: false,
//           playsInSilentModeIOS: true,
//           shouldDuckAndroid: true,
//           playThroughEarpieceAndroid: false,
//         });
//       } catch (error) {
//         console.warn('Audio configuration error:', error);
//       }
//     };

//     configureAudio();
//   }, []);

//   // Stop all videos when leaving the screen
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         stopAllVideos();
//       };
//     }, [])
//   );

//   const stopAllVideos = async () => {
//     Object.values(videoRefs.current).forEach(async (ref) => {
//       if (ref) {
//         try {
//           await ref.pauseAsync();
//           await ref.setPositionAsync(0);
//         } catch (error) {
//           console.warn('Error stopping video:', error);
//         }
//       }
//     });
//   };

//   // Handle video playback when scrolling
//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       const previousIndex = currentIndex;
      
//       // Stop previous video
//       if (previousIndex !== newIndex) {
//         const previousItem = EducationalShorts[previousIndex];
//         if (previousItem && videoRefs.current[previousItem.id]) {
//           videoRefs.current[previousItem.id]?.pauseAsync().catch(() => {});
//           setVideoStates(prev => ({ ...prev, [previousItem.id]: false }));
//         }
//       }

//       setCurrentIndex(newIndex);

//       // Play new video
//       const currentItem = EducationalShorts[newIndex];
//       if (currentItem?.videoUrl) {
//         const currentVideo = videoRefs.current[currentItem.id];
//         if (currentVideo) {
//           currentVideo.playAsync()
//             .then(() => {
//               setVideoStates(prev => ({ ...prev, [currentItem.id]: true }));
//             })
//             .catch((error) => {
//               console.warn('Error playing video:', error);
//             });
//         }
//       }
//     }
//   }).current;

//   const toggleLike = (videoId: string) => {
//     setLikedVideos(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(videoId)) {
//         newSet.delete(videoId);
//       } else {
//         newSet.add(videoId);
//       }
//       return newSet;
//     });
//   };

//   // Manual play/pause control
//   const togglePlayPause = async (videoId: string) => {
//     const video = videoRefs.current[videoId];
//     if (!video) return;

//     try {
//       const status = await video.getStatusAsync();
//       if (status.isLoaded) {
//         if (status.isPlaying) {
//           await video.pauseAsync();
//           setVideoStates(prev => ({ ...prev, [videoId]: false }));
//         } else {
//           await video.playAsync();
//           setVideoStates(prev => ({ ...prev, [videoId]: true }));
//         }
//       }
//     } catch (error) {
//       console.warn('Playback control error:', error);
//     }
//   };

//   const renderShortItem = ({ item, index }: { item: typeof EducationalShorts[0]; index: number }) => {
//     const isLiked = likedVideos.has(item.id);
//     const isCurrent = index === currentIndex;
//     const isPlaying = videoStates[item.id];

//     return (
//       <View style={styles.videoContainer}>
//         {/* Image Fallback */}
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={styles.videoImage}
//           resizeMode="cover"
//         />
        
//         {/* Video */}
//         <Video
//           ref={(ref) => {
//             videoRefs.current[item.id] = ref;
//           }}
//           source={item.videoUrl}
//           style={styles.video}
//           resizeMode={ResizeMode.COVER}
//           shouldPlay={isCurrent}
//           isLooping={false}
//           isMuted={false}
//           volume={1.0}
//           useNativeControls={false}
//           onPlaybackStatusUpdate={(status) => {
//             if (status.isLoaded) {
//               if (status.isPlaying) {
//                 setVideoStates(prev => ({ ...prev, [item.id]: true }));
//               }
//             }
//           }}
//         />

//         {/* Play/Pause Overlay */}
//         <TouchableOpacity 
//           style={styles.videoTouchArea}
//           onPress={() => togglePlayPause(item.id)}
//           activeOpacity={0.9}
//         >
//           {!isPlaying && isCurrent && (
//             <View style={styles.playButtonOverlay}>
//               <Text style={styles.playButton}>▶️</Text>
//               <Text style={styles.playButtonText}>Tap to play</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* Content Overlay */}
//         <View style={styles.contentOverlay}>
//           <View style={styles.textContent}>
//             <View style={styles.subjectTag}>
//               <Text style={styles.subjectText}>{item.subject}</Text>
//             </View>
//             <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
//             <Text style={styles.creator}>@{item.creator}</Text>
//             <Text style={styles.views}>{item.views} views • Educational</Text>
            
//             <View style={styles.audioStatus}>
//               <Text style={styles.audioStatusText}>
//                 {isPlaying ? '🔊 Sound ON' : '🔇 Tap to play'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Right Actions */}
//         <View style={styles.actionsContainer}>
//           <View style={styles.actionItem}>
//             <TouchableOpacity onPress={() => toggleLike(item.id)}>
//               <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
//             </TouchableOpacity>
//             <Text style={styles.actionCount}>
//               {isLiked ? (item.likes + 1).toLocaleString() : item.likes.toLocaleString()}
//             </Text>
//           </View>
          
//           <View style={styles.actionItem}>
//             <TouchableOpacity onPress={() => Alert.alert('Discussion', `Join the discussion about "${item.title}"`)}>
//               <Text style={styles.actionIcon}>💬</Text>
//             </TouchableOpacity>
//             <Text style={styles.actionCount}>12K</Text>
//           </View>
          
//           <View style={styles.actionItem}>
//             <TouchableOpacity onPress={() => Alert.alert('Share', `Share "${item.title}" with friends`)}>
//               <Text style={styles.actionIcon}>📤</Text>
//             </TouchableOpacity>
//             <Text style={styles.actionCount}>Share</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={EducationalShorts}
//         renderItem={renderShortItem}
//         keyExtractor={(item) => item.id}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={{
//           itemVisiblePercentThreshold: 80,
//         }}
//         snapToInterval={SCREEN_HEIGHT}
//         snapToAlignment="start"
//         decelerationRate="fast"
//       />

//       <View style={styles.videoIndicator}>
//         <Text style={styles.videoIndicatorText}>
//           📚 {currentIndex + 1} / {EducationalShorts.length}
//         </Text>
//       </View>

//       {user && (
//         <TouchableOpacity style={styles.createButton}>
//           <Text style={styles.createButtonText}>🎓 Create Short</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   videoContainer: {
//     height: SCREEN_HEIGHT,
//     width: '100%',
//     backgroundColor: '#000000',
//     position: 'relative',
//   },
//   videoImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     width: '100%',
//     height: '100%',
//   },
//   video: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     width: '100%',
//     height: '100%',
//   },
//   videoTouchArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButtonOverlay: {
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 20,
//     borderRadius: 50,
//     alignItems: 'center',
//   },
//   playButton: {
//     fontSize: 40,
//     marginBottom: 8,
//   },
//   playButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   contentOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   textContent: {
//     marginBottom: 100,
//   },
//   subjectTag: {
//     backgroundColor: '#667EEA',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 8,
//   },
//   subjectText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   videoTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//     textShadowColor: 'rgba(0, 0, 0, 0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//     lineHeight: 24,
//   },
//   creator: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginBottom: 4,
//     fontWeight: '600',
//   },
//   views: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: '500',
//   },
//   audioStatus: {
//     marginTop: 8,
//   },
//   audioStatusText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   actionsContainer: {
//     position: 'absolute',
//     right: 16,
//     bottom: 120,
//     alignItems: 'center',
//   },
//   actionItem: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   actionIcon: {
//     fontSize: 32,
//     marginBottom: 4,
//   },
//   actionCount: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   videoIndicator: {
//     position: 'absolute',
//     top: 100,
//     right: 20,
//     backgroundColor: 'rgba(102, 126, 234, 0.9)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     zIndex: 100,
//   },
//   videoIndicatorText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   createButton: {
//     position: 'absolute',
//     bottom: 100,
//     left: 20,
//     backgroundColor: '#667EEA',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 25,
//     zIndex: 10,
//   },
//   createButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
// });

// export default ShortsScreen;