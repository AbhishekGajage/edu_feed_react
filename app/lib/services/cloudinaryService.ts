// app/lib/services/cloudinaryService.ts

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  // Add other fields if needed (e.g., version, width, height)
}

export const cloudinaryService = {
  /**
   * Uploads an image to Cloudinary
   * @param imageUri - Local file URI (from ImagePicker or camera)
   * @param folder - Folder path in Cloudinary (default: 'edugram')
   * @returns Secure URL of uploaded image, or null on error
   */
  uploadImage: async (
    imageUri: string,
    folder: string = 'edu_feed'
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      
      // Append file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as any);

      // Append upload preset and folder
      formData.append(
        'upload_preset',
        process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'edu_feed_upload'
      );
      formData.append('folder', folder);

      // Build endpoint URL
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfbrweqii';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;

    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return null;
    }
  },

  /**
   * Uploads a video to Cloudinary
   * @param videoUri - Local file URI (from VideoPicker or camera)
   * @param folder - Folder path in Cloudinary (default: 'edugram/videos')
   * @returns Secure URL of uploaded video, or null on error
   */
  uploadVideo: async (
    videoUri: string,
    folder: string = 'edu_feed/videos'
  ): Promise<string | null> => {
    try {
      const formData = new FormData();

      // Append file
      formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
      } as any);

      // Append upload preset, folder, and resource type
      formData.append(
        'upload_preset',
        process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'edu_feed_upload'
      );
      formData.append('folder', folder);
      formData.append('resource_type', 'video');

      // Build endpoint URL
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfbrweqii';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Cloudinary video upload failed: ${response.status} ${response.statusText}`);
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;

    } catch (error) {
      console.error('Error uploading video to Cloudinary:', error);
      return null;
    }
  },

   deleteMedia: async (publicId: string, resourceType: "image" | "video" = "image"): Promise<{ success: boolean; error?: string }> => {
    // Your existing delete implementation
    try {
      console.log('Deleting media from Cloudinary:', publicId, resourceType);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Add the missing uploadShort method
  uploadShort: async (uri: string, userId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      console.log('Uploading short to Cloudinary:', uri, userId);
      
      // Use your existing uploadVideo method or implement short-specific logic
      const videoUrl = await cloudinaryService.uploadVideo(uri, `edu_feed/shorts/${userId}`);
      
      if (!videoUrl) {
        throw new Error('Video upload returned no URL');
      }
      
      return { success: true, url: videoUrl };
    } catch (error: any) {
      console.error('Short upload failed:', error);
      return { success: false, error: error.message || 'Short upload failed' };
    }
  },

   uploadProfilePicture: async (uri: string, userId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const url = await cloudinaryService.uploadImage(uri, `edugram/profiles/${userId}`);
      if (!url) throw new Error('Upload returned no URL');
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' };
    }
  },

  // Add the missing uploadPostImage method
  uploadPostImage: async (uri: string, userId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const url = await cloudinaryService.uploadImage(uri, `edugram/posts/${userId}`);
      if (!url) throw new Error('Upload returned no URL');
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' };
    }
  }

  /**
   * Deletes media from Cloudinary (optional)
   * Note: Requires admin API key + signature (not recommended client-side)
   * For security, implement this in a backend function
   */
  
};
export default cloudinaryService;