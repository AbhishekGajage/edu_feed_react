import { limit } from 'firebase/firestore';
// // app/lib/services/databaseService.ts
// import {
//     addDoc,
//     arrayRemove,
//     arrayUnion,
//     collection,
//     doc,
//     increment,
//     updateDoc
// } from 'firebase/firestore';
// import { db } from '../config/firebaseConfig';

// export const databaseService = {
//   // Posts
//   async likePost(postId: string, userId: string) {
//     await updateDoc(doc(db, 'posts', postId), {
//       likedBy: arrayUnion(userId),
//       likes: increment(1)
//     });
//   },

//   async unlikePost(postId: string, userId: string) {
//     await updateDoc(doc(db, 'posts', postId), {
//       likedBy: arrayRemove(userId),
//       likes: increment(-1)
//     });
//   },

//   async savePost(postId: string, userId: string) {
//     await updateDoc(doc(db, 'users', userId), {
//       savedPosts: arrayUnion(postId)
//     });
//   },

//   async unsavePost(postId: string, userId: string) {
//     await updateDoc(doc(db, 'users', userId), {
//       savedPosts: arrayRemove(postId)
//     });
//   },

//   async addComment(postId: string, comment: any) {
//     const commentsRef = collection(db, 'posts', postId, 'comments');
//     await addDoc(commentsRef, comment);
//     await updateDoc(doc(db, 'posts', postId), {
//       comments: increment(1)
//     });
//   },

//   // Follow system
//   async followUser(currentUserId: string, targetUserId: string) {
//     const batch = [
//       updateDoc(doc(db, 'users', currentUserId), {
//         following: arrayUnion(targetUserId)
//       }),
//       updateDoc(doc(db, 'users', targetUserId), {
//         followers: arrayUnion(currentUserId)
//       })
//     ];
    
//     await Promise.all(batch);
//   },

//   async unfollowUser(currentUserId: string, targetUserId: string) {
//     const batch = [
//       updateDoc(doc(db, 'users', currentUserId), {
//         following: arrayRemove(targetUserId)
//       }),
//       updateDoc(doc(db, 'users', targetUserId), {
//         followers: arrayRemove(currentUserId)
//       })
//     ];
    
//     await Promise.all(batch);
//   },

//   // Analytics
//   async updateScreenTime(userId: string, timeInMinutes: number) {
//     await updateDoc(doc(db, 'users', userId), {
//       dailyScrollTime: increment(timeInMinutes)
//     });
//   },

//   async updateLearningProgress(userId: string, progressData: any) {
//     await updateDoc(doc(db, 'users', userId), {
//       learningProgress: progressData
//     });
//   }
// };
// app/lib/services/databaseService.ts
// app/lib/services/databaseService.ts
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { db, storage } from '../config/firebaseConfig';

const cleanData = (data: any) => {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

// Optional: Define minimal types (improves DX)
interface UserData {
  uid: string;
  email: string;
  username: string;
  photoURL?: string;
  bio?: string;
  role: 'student' | 'teacher' | 'authenticator' | 'admin';
  interests?: string[];
}

interface PostData {
  userId: string;
  username: string;
  userAvatar?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  category?: string;
  tags?: string[];
  type?: 'image' | 'video' | 'text';
}

interface CommentData {
  userId: string;
  username: string;
  text: string;
}

interface OpportunityData {
  title: string;
  description: string;
  type: string;
  company: string;
  duration?: string;
  stipend?: string;
  amount?: string;
  deadline: string | Date;
  tags?: string[];
  createdBy: string;
}

export const databaseService = {
  // ─── USER MANAGEMENT ───────────────────────────────────────────────────────
  async createUser(userData: UserData) {
    try {
      const cleanedData = cleanData(userData);
      await setDoc(doc(db, 'users', userData.uid), {
        cleanedData,
        uid: userData.uid,
        email: userData.email,
        username: userData.username,
        photoURL: userData.photoURL || '',
        bio: userData.bio || '',
        role: userData.role,
        followers: [],
        following: [],
        interests: userData.interests || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
       
      });

      // Role-specific profiles
      if (userData.role === 'teacher') {
        await this.createTeacherProfile(userData.uid);
      } else if (userData.role === 'authenticator') {
        await this.createAuthenticatorProfile(userData.uid);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateUser(userId: string, updates: Partial<UserData>) {
    try {
      const cleanedUpdates = cleanData(updates);
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
        cleanedUpdates
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getUser(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: 'User not found' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
   getShorts: async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      // Your implementation to fetch shorts
      return { success: true, data: [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  deleteShort: async (shortId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Deleting short:', shortId, userId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },


  // ─── TEACHER & AUTHENTICATOR PROFILES ──────────────────────────────────────
  async createTeacherProfile(teacherId: string) {
    const teacherRef = doc(db, 'teachers', teacherId);
    await setDoc(teacherRef, {
      teacherId,
      subjects: [],
      qualifications: [],
      teachingSince: new Date().getFullYear(),
      students: [],
      classStats: {
        totalStudents: 0,
        activeStudents: 0,
        averageProgress: 0,
      },
      createdAt: serverTimestamp(),
    });
  },

  async createAuthenticatorProfile(authenticatorId: string) {
    const ref = doc(db, 'moderation-stats', authenticatorId);
    await setDoc(ref, {
      authenticatorId,
      totalReviewed: 0,
      approved: 0,
      rejected: 0,
      accuracy: 100,
      lastActive: serverTimestamp(),
    });
  },

  createShort: async (shortData: {
    userId: string;
    title: string;
    videoUrl: string;
    creator: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Creating short in database:', shortData);
                
      return { success: true };
    } catch (error: any) {
      console.error('Failed to create short:', error);
      return { success: false, error: error.message || 'Failed to create short' };
    }
  },

  // ─── POST OPERATIONS ───────────────────────────────────────────────────────
  calculateEducationalScore(postData: Partial<PostData>): number {
    let score = 50;

    const text = (postData.description || '').toLowerCase();
    const title = (postData.title || '').toLowerCase();

    const educationalKeywords = [
      'learn', 'study', 'education', 'knowledge', 'teaching', 'school',
      'college', 'university', 'course', 'lesson', 'tutorial', 'guide',
      'mathematics', 'science', 'history', 'physics', 'chemistry', 'biology',
      'programming', 'coding', 'development', 'research', 'theory', 'practice'
    ];

    educationalKeywords.forEach(keyword => {
      if (text.includes(keyword) || title.includes(keyword)) {
        score += 2;
      }
    });

    if (postData.category === 'study') score += 20;
    if (postData.category === 'achievement') score += 10;
    if (text.length > 100) score += 10;
    if (text.length > 300) score += 10;

    const eduTags = ['education', 'learning', 'study', 'tutorial'];
    if (postData.tags?.some(tag => eduTags.includes(tag.toLowerCase()))) {
      score += 15;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  },

  async createPost(postData: PostData) {
    try {
      const score = this.calculateEducationalScore(postData);
      const status = score >= 60 ? 'approved' : 'pending';

      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        educationalScore: score,
        status,
        likes: 0,
        comments: 0,
        likedBy: [],
        savedBy: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add to moderation queue if pending
      if (status === 'pending') {
        await setDoc(doc(db, 'moderation-queue', docRef.id), {
          postId: docRef.id,
          addedAt: serverTimestamp(),
          priority: score < 30 ? 'high' : score < 50 ? 'medium' : 'low',
          status: 'pending',
        });
      }

      // Add to user's posts array
      await updateDoc(doc(db, 'users', postData.userId), {
        posts: arrayUnion(docRef.id),
      });

      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async likePost(postId: string, userId: string) {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likedBy: arrayUnion(userId),
        likes: increment(1),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async unlikePost(postId: string, userId: string) {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likedBy: arrayRemove(userId),
        likes: increment(-1),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async savePost(postId: string, userId: string) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        savedPosts: arrayUnion(postId),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async unsavePost(postId: string, userId: string) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        savedPosts: arrayRemove(postId),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async addComment(postId: string, commentData: CommentData) {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        ...commentData,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'posts', postId), {
        comments: increment(1),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async deletePost(postId: string, deleterUserId: string, reason?: string) {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (!postDoc.exists()) throw new Error('Post not found');
      const postData = postDoc.data() as { userId: string };

      const userDoc = await getDoc(doc(db, 'users', deleterUserId));
      const userData = userDoc.data() as { role?: string };

      const isOwner = postData.userId === deleterUserId;
      const isAdmin = userData?.role === 'admin';
      const isAuthenticator = userData?.role === 'authenticator';

      if (!isOwner && !isAdmin && !isAuthenticator) {
        throw new Error('Permission denied');
      }

      const batch: Promise<any>[] = [
        deleteDoc(doc(db, 'posts', postId)),
        updateDoc(doc(db, 'users', postData.userId), {
          posts: arrayRemove(postId),
        }),
        deleteDoc(doc(db, 'moderation-queue', postId)).catch(() => {}),
      ];

      if (!isOwner && reason) {
        const logRef = doc(collection(db, 'moderation-logs'));
        batch.push(
          setDoc(logRef, {
            postId,
            deletedBy: deleterUserId,
            reason,
            deletedAt: serverTimestamp(),
            postOwner: postData.userId,
            action: 'delete',
          })
        );
      }

      await Promise.all(batch);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ─── MODERATION ────────────────────────────────────────────────────────────
  async approvePost(postId: string, authenticatorId: string) {
    try {
      const batch = [
        updateDoc(doc(db, 'posts', postId), {
          status: 'approved',
          moderatedBy: authenticatorId,
          moderatedAt: serverTimestamp(),
        }),
        deleteDoc(doc(db, 'moderation-queue', postId)),
        updateDoc(doc(db, 'moderation-stats', authenticatorId), {
          totalReviewed: increment(1),
          approved: increment(1),
          lastActive: serverTimestamp(),
        }),
      ];
      await Promise.all(batch);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async rejectPost(postId: string, authenticatorId: string, reason: string) {
    try {
      const batch = [
        updateDoc(doc(db, 'posts', postId), {
          status: 'rejected',
          moderatedBy: authenticatorId,
          moderationReason: reason,
          moderatedAt: serverTimestamp(),
        }),
        deleteDoc(doc(db, 'moderation-queue', postId)),
        updateDoc(doc(db, 'moderation-stats', authenticatorId), {
          totalReviewed: increment(1),
          rejected: increment(1),
          lastActive: serverTimestamp(),
        }),
      ];
      await Promise.all(batch);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getPendingModerationPosts(limitCount = 10) {
    try {
      const q = query(
        collection(db, 'moderation-queue'),
        where('status', '==', 'pending'),
        orderBy('addedAt', 'asc'),
        limit(limitCount) 
      );
      const snapshot = await getDocs(q);
      return {
        success: true,
        data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ─── FOLLOW SYSTEM ─────────────────────────────────────────────────────────
  async followUser(currentUserId: string, targetUserId: string) {
    try {
      await Promise.all([
        updateDoc(doc(db, 'users', currentUserId), {
          following: arrayUnion(targetUserId),
        }),
        updateDoc(doc(db, 'users', targetUserId), {
          followers: arrayUnion(currentUserId),
        }),
      ]);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async unfollowUser(currentUserId: string, targetUserId: string) {
    try {
      await Promise.all([
        updateDoc(doc(db, 'users', currentUserId), {
          following: arrayRemove(targetUserId),
        }),
        updateDoc(doc(db, 'users', targetUserId), {
          followers: arrayRemove(currentUserId),
        }),
      ]);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ─── OPPORTUNITIES ─────────────────────────────────────────────────────────
  async createOpportunity(opportunityData: OpportunityData) {
    try {
      const docRef = await addDoc(collection(db, 'opportunities'), {
        ...opportunityData,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getOpportunities() {
    try {
      const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // ─── REAL-TIME LISTENERS ───────────────────────────────────────────────────
  getPostsRealtime(
    userRole: string,
    callback: (posts: any[]) => void
  ): () => void {
    const q = userRole === 'authenticator' || userRole === 'admin'
      ? query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'posts'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));

    return onSnapshot(q, snapshot => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  },

  getUserPostsRealtime(
    userId: string,
    callback: (posts: any[]) => void
  ): () => void {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, snapshot => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
  },

  getOpportunitiesRealtime(callback: (opportunities: any[]) => void): () => void {
    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snapshot => {
      const opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(opportunities);
    });
  },

  getModerationQueueRealtime(callback: (queue: any[]) => void): () => void {
    const q = query(
      collection(db, 'moderation-queue'),
      where('status', '==', 'pending'),
      orderBy('addedAt', 'asc')
    );
    return onSnapshot(q, snapshot => {
      const queue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(queue);
    });
  },

  // ─── STORAGE ───────────────────────────────────────────────────────────────
  async uploadFile(file: { uri: string }, path: string): Promise<string> {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.uri.split('/').pop()}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },
};
export default databaseService;