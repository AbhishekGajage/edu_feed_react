import { Colors } from '@/constants/color';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from './lib/providers/UserProvider';
import { cloudinaryService } from './lib/services/cloudinaryService';
import { databaseService } from './lib/services/databaseService';

export const usePostUploader = () => {
  const uploadAndCreatePost = async (imageUri: string, description: string) => {
    // Upload to Cloudinary
    const imageUrl = await cloudinaryService.uploadImage(imageUri);
    if (!imageUrl) throw new Error('Upload failed');

    // Save to Firestore
    const result = await databaseService.createPost({
      userId: 'abc123', // Replace with real user ID
      username: 'john_doe',
      description,
      imageUrl,
      type: 'image',
    });

    return result;
  };

  return { uploadAndCreatePost };
};
const AddPostScreen = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('study');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('college');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useUser();

  const categories = ['study', 'internship', 'scholarship', 'achievement'];
  const educationLevels = ['school', 'college', 'professional'];
  const availableTags = [
    'Flutter', 'Dart', 'Programming', 'Study Tips',
    'Internship', 'Scholarship', 'Achievement', 'Learning'
  ];

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const postImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Post created successfully!');
      
      // Clear form and navigate back
      setDescription('');
      setImage(null);
      setSelectedTags([]);
      router.back();

    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <TouchableOpacity 
          onPress={postImage} 
          disabled={isLoading || !image}
          style={styles.postButton}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.blueColor} size="small" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Image Selection */}
        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Description */}
        <TextInput
          style={styles.descriptionInput}
          placeholder="Write a caption..."
          placeholderTextColor={Colors.secondaryColor}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Category Selection */}
        <Text style={styles.sectionLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Education Level */}
        <Text style={styles.sectionLabel}>Education Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {educationLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.categoryButton,
                selectedEducationLevel === level && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedEducationLevel(level)}
            >
              <Text style={[
                styles.categoryText,
                selectedEducationLevel === level && styles.categoryTextActive
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tags */}
        <Text style={styles.sectionLabel}>Tags</Text>
        <View style={styles.tagsContainer}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                selectedTags.includes(tag) && styles.tagButtonActive
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.tagTextActive
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.mobileBackgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mobileSearchColor,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.primaryColor,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  postButton: {
    padding: 8,
  },
  postButtonText: {
    color: Colors.blueColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.secondaryColor}4D`,
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    color: Colors.secondaryColor,
  },
  descriptionInput: {
    backgroundColor: Colors.webBackgroundColor,
    borderWidth: 1,
    borderColor: `${Colors.secondaryColor}4D`,
    borderRadius: 12,
    padding: 16,
    color: Colors.primaryColor,
    marginBottom: 20,
    minHeight: 100,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColor,
    marginBottom: 12,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
  },
  categoryButtonActive: {
    backgroundColor: Colors.blueColor,
    borderColor: Colors.blueColor,
  },
  categoryText: {
    color: Colors.secondaryColor,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.webBackgroundColor,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
  },
  tagButtonActive: {
    backgroundColor: Colors.blueColor,
    borderColor: Colors.blueColor,
  },
  tagText: {
    color: Colors.secondaryColor,
    fontSize: 12,
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
});

export default AddPostScreen;