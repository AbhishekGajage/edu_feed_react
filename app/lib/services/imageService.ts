import * as ImagePicker from 'expo-image-picker';

export const cloudinaryService = {
  /**
   * Request permissions for image/video access
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  },

  /**
   * Pick image from gallery
   */
  pickImage: async (options: any = {}): Promise<{ success: boolean; uri?: string; error?: string }> => {
    try {
      const hasPermission = await cloudinaryService.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Permission denied' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: options.aspect || [1, 1],
        quality: options.quality || 0.8,
        ...options
      });

      if (!result.canceled && result.assets[0].uri) {
        return { success: true, uri: result.assets[0].uri };
      }
      return { success: false, error: 'No image selected' };
    } catch (error: any) {
      console.error('Error picking image:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Pick video from gallery
   */
  pickVideo: async (options: any = {}): Promise<{ success: boolean; uri?: string; error?: string }> => {
    try {
      const hasPermission = await cloudinaryService.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Permission denied' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: options.allowsEditing !== false,
        aspect: options.aspect || [9, 16],
        quality: options.quality || 0.8,
        videoMaxDuration: options.videoMaxDuration || 60, // 60 seconds max for shorts
        ...options
      });

      if (!result.canceled && result.assets[0].uri) {
        return { 
          success: true, 
          uri: result.assets[0].uri,
          duration: result.assets[0].duration,
          width: result.assets[0].width,
          height: result.assets[0].height
        } as any;
      }
      return { success: false, error: 'No video selected' };
    } catch (error: any) {
      console.error('Error picking video:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload image to Cloudinary
   */
  uploadImage: async (
    imageUri: string, 
    folder: string = 'edu_feed/images',
    publicId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // Validate Cloudinary configuration
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        return { 
          success: false, 
          error: 'Cloudinary configuration missing. Please check your .env file' 
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      } as any);
      
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
      
      if (publicId) {
        formData.append('public_id', publicId);
      }

      // Optional: Add image transformations
      formData.append('transformation', 'q_auto,f_auto'); // Auto quality and format
      formData.append('width', '800'); // Resize to max 800px width

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload failed:', errorText);
        return { 
          success: false, 
          error: `Upload failed: ${response.status} ${response.statusText}` 
        };
      }

      const data = await response.json();
      
      if (data.secure_url) {
        return { success: true, url: data.secure_url };
      } else {
        return { success: false, error: 'No URL returned from Cloudinary' };
      }
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload video to Cloudinary
   */
  uploadVideo: async (
    videoUri: string, 
    folder: string = 'edu_feed/videos',
    publicId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // Validate Cloudinary configuration
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        return { 
          success: false, 
          error: 'Cloudinary configuration missing. Please check your .env file' 
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: `video_${Date.now()}.mp4`,
      } as any);
      
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
      formData.append('resource_type', 'video');
      
      if (publicId) {
        formData.append('public_id', publicId);
      }

      // Optional: Add video transformations for optimization
      formData.append('transformation', 'q_auto'); // Auto quality
      formData.append('width', '720'); // Resize to 720p

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary video upload failed:', errorText);
        return { 
          success: false, 
          error: `Video upload failed: ${response.status} ${response.statusText}` 
        };
      }

      const data = await response.json();
      
      if (data.secure_url) {
        return { success: true, url: data.secure_url };
      } else {
        return { success: false, error: 'No URL returned from Cloudinary' };
      }
    } catch (error: any) {
      console.error('Error uploading video to Cloudinary:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload profile picture with specific optimizations
   */
  uploadProfilePicture: async (imageUri: string, userId: string) => {
    return cloudinaryService.uploadImage(
      imageUri, 
      'edu_feed/profiles',
      `profile_${userId}` // Use consistent public_id for overwriting
    );
  },

  /**
   * Upload post image
   */
  uploadPostImage: async (imageUri: string, userId: string, postId?: string) => {
    const folder = `edu_feed/posts/${userId}`;
    const publicId = postId ? `post_${postId}` : undefined;
    
    return cloudinaryService.uploadImage(imageUri, folder, publicId);
  },

  /**
   * Upload story image/video
   */
  uploadStory: async (mediaUri: string, userId: string, isVideo: boolean = false) => {
    const folder = `edu_feed/stories/${userId}`;
    
    if (isVideo) {
      return cloudinaryService.uploadVideo(mediaUri, folder);
    } else {
      return cloudinaryService.uploadImage(mediaUri, folder);
    }
  },

  /**
   * Upload short video
   */
  uploadShort: async (videoUri: string, userId: string, shortId?: string) => {
    const folder = `edu_feed/shorts/${userId}`;
    const publicId = shortId ? `short_${shortId}` : undefined;
    
    return cloudinaryService.uploadVideo(videoUri, folder, publicId);
  },

  /**
   * Delete media from Cloudinary (if needed)
   * Note: This requires signed uploads or admin API
   */
  deleteMedia: async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
    try {
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      // This would require server-side implementation for security
      console.log(`Would delete: ${publicId} from Cloudinary`);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting from Cloudinary:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate optimized URL with transformations
   */
  getOptimizedUrl: (originalUrl: string, transformations: string = '') => {
    if (!originalUrl) return originalUrl;
    
    // If it's already a Cloudinary URL, we can add transformations
    if (originalUrl.includes('cloudinary.com')) {
      const parts = originalUrl.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/${transformations}${transformations ? '/' : ''}${parts[1]}`;
      }
    }
    
    return originalUrl;
  },

  /**
   * Get avatar URL with specific size
   */
  getAvatarUrl: (originalUrl: string, size: number = 100) => {
    const transformations = `w_${size},h_${size},c_fill,g_face,r_max`;
    return cloudinaryService.getOptimizedUrl(originalUrl, transformations);
  },

  /**
   * Get post image URL with specific size
   */
  getPostImageUrl: (originalUrl: string, width: number = 800) => {
    const transformations = `w_${width},c_limit,q_auto,f_auto`;
    return cloudinaryService.getOptimizedUrl(originalUrl, transformations);
  }
};

export default cloudinaryService;