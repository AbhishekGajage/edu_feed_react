// // import React, { createContext, ReactNode, useContext, useState } from 'react';
// // import { User } from '../models/user';

// // interface UserContextType {
// //   user: User;
// //   hasUser: boolean;
// //   updateUser: (user: User) => void;
// //   clearUser: () => void;
// //   updateUserScrollTime: (newTime: number) => void;
// // }

// // const UserContext = createContext<UserContextType | undefined>(undefined);

// // export const UserProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null);

// //   const getUser = (): User => {
// //     if (!user) {
// //       return new User({
// //         username: 'Demo User',
// //         uid: 'demo-uid',
// //         photoUrl: require('@/assets/images/default_avatar.png'),
// //         email: 'demo@edugram.com',
// //         bio: 'Welcome to EduGram! Explore all features',
// //         followers: [],
// //         following: [],
// //         userType: 'student',
// //         interests: [],
// //         dailyScrollTime: 0,
// //         timeLimit: 120,
// //       });
// //     }
// //     return user;
// //   };

// //   const hasUser = user !== null;

// //   const updateUser = (userData: User) => {
// //     setUser(userData);
// //   };

// //   const clearUser = () => {
// //     setUser(null);
// //   };

// //   const updateUserScrollTime = (newTime: number) => {
// //     if (user) {
// //       const updatedUser = new User({
// //         username: user.username,
// //         uid: user.uid,
// //         photoUrl: user.photoUrl,
// //         email: user.email,
// //         bio: user.bio,
// //         followers: user.followers,
// //         following: user.following,
// //         userType: user.userType,
// //         interests: user.interests,
// //         dailyScrollTime: newTime,
// //         timeLimit: user.timeLimit,
// //       });
// //       setUser(updatedUser);
// //     }
// //   };

// //   return (
// //     <UserContext.Provider
// //       value={{
// //         user: getUser(),
// //         hasUser,
// //         updateUser,
// //         clearUser,
// //         updateUserScrollTime,
// //       }}
// //     >
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// // export const useUser = (): UserContextType => {
// //   const context = useContext(UserContext);
// //   if (!context) {
// //     throw new Error('useUser must be used within a UserProvider');
// //   }
// //   return context;
// // };
// // app/lib/providers/UserProvider.tsx

// // app/lib/providers/UserProvider.tsx
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
//   updateProfile
// } from 'firebase/auth';
// import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { auth, db } from '../config/firebaseConfig';
// import { Session, User } from '../models/user';
// ////
// /////////
// // app/lib/providers/UserProvider.tsx
// import React from 'react';
// import { AppState, AppStateStatus } from 'react-native';










// interface UserContextType {
//   user: User;
//   updateUser: (userData: Partial<User>) => void;
//   clearUser: () => void;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUserProfile: (userData: Partial<User>) => Promise<void>;
//   loading: boolean;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User>(new User());
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUser(new User({
//               ...userData,
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//             }));
//           } else {
//             // Create user document if it doesn't exist
//             const newUser = new User({
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               username: firebaseUser.displayName || 'User',
//               photoUrl: require('../../assets/images/default_avatar.png'),
//               bio: 'Welcome to EduGram!',
//               followers: [],
//               following: [],
//               userType: 'student',
//               interests: [],
//               dailyScrollTime: 0,
//               timeLimit: 120,
//               createdAt: new Date().toISOString(),
//               posts: [],
//               savedPosts: [],
//               notifications: true,
//               emailNotifications: true,
//             });
            
//             await setDoc(doc(db, 'users', firebaseUser.uid), newUser.toFirestore());
//             setUser(newUser);
//           }
//         } catch (error) {
//           console.error('Error loading user:', error);
//         }
//       } else {
//         setUser(new User());
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const login = async (email: string, password: string) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       setUser(new User({
//         ...userData,
//         uid: userCredential.user.uid,
//         email: userCredential.user.email,
//       }));
//     }
//   };

//   const register = async (email: string, password: string, userData: Partial<User>) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
//     const newUser = new User({
//       ...userData,
//       uid: userCredential.user.uid,
//       email: userCredential.user.email,
//       createdAt: new Date().toISOString(),
//       followers: [],
//       following: [],
//       posts: [],
//       savedPosts: [],
//       dailyScrollTime: 0,
//       timeLimit: 120,
//       photoUrl: userData.photoUrl || require('../../assets/images/default_avatar.png'),
//     });

//     await setDoc(doc(db, 'users', userCredential.user.uid), newUser.toFirestore());
//     setUser(newUser);

//     // Update Firebase auth profile
//     if (userData.username) {
//       await updateProfile(userCredential.user, {
//         displayName: userData.username,
//       });
//     }
//   };

//   const updateUserProfile = async (userData: Partial<User>) => {
//     if (!user.uid) return;

//     await updateDoc(doc(db, 'users', user.uid), userData);
//     setUser(prev => new User({ ...prev, ...userData }));
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setUser(new User());
//   };

//   const updateUser = (userData: Partial<User>) => {
//     setUser(prev => new User({ ...prev, ...userData }));
//   };

//   const clearUser = () => {
//     setUser(new User());
//   };

//   return (
//     <UserContext.Provider value={{
//       user,
//       updateUser,
//       clearUser,
//       login,
//       register,
//       logout,
//       updateUserProfile,
//       loading
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// const register = async (email: string, password: string, userData: Partial<User>) => {
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
//   const newUser = new User({
//     ...userData,
//     uid: userCredential.user.uid,
//     email: userCredential.user.email,
//     createdAt: new Date().toISOString(),
//     followers: [],
//     following: [],
//     posts: [],
//     savedPosts: [],
//     dailyScrollTime: 0,
//     timeLimit: 120,
//     photoUrl: userData.photoUrl || require('../../assets/images/default_avatar.png'),
//   });

//   // Use the enhanced database service to create user with role
//   await databaseService.createUserWithRole(userCredential.user.uid, newUser.toFirestore());
//   setUser(newUser);

//   // Update Firebase auth profile
//   if (userData.username) {
//     await updateProfile(userCredential.user, {
//       displayName: userData.username,
//     });
//   }
// };

// // In UserProvider.tsx - update the onAuthStateChanged handler
// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//     if (firebaseUser) {
//       try {
//         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
          
//           // Load role-specific data
//           let roleSpecificData = {};
//           if (userData.role === 'teacher') {
//             roleSpecificData = await loadTeacherData(firebaseUser.uid);
//           } else if (userData.role === 'authenticator') {
//             roleSpecificData = await loadAuthenticatorData(firebaseUser.uid);
//           }

//           setUser(new User({
//             ...userData,
//             ...roleSpecificData,
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//           }));
//         } else {
//           // Handle new user - this should rarely happen as we create during registration
//           console.log('User document not found, creating default...');
//           await databaseService.createUserWithRole(firebaseUser.uid, {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             username: firebaseUser.displayName || 'User',
//             role: 'student',
//             photoUrl: require('../../assets/images/default_avatar.png'),
//             bio: 'Welcome to EduGram!',
//             createdAt: new Date().toISOString(),
//           });
//         }
//       } catch (error) {
//         console.error('Error loading user:', error);
//       }
//     } else {
//       setUser(new User());
//     }
//     setLoading(false);
//   });

//   return unsubscribe;
// }, []);

// // Helper functions for role-specific data
// const loadTeacherData = async (teacherId: string) => {
//   try {
//     const teacherDoc = await getDoc(doc(db, 'teachers', teacherId));
//     if (teacherDoc.exists()) {
//       return teacherDoc.data();
//     }
//   } catch (error) {
//     console.error('Error loading teacher data:', error);
//   }
//   return {};
// };

// const loadAuthenticatorData = async (authenticatorId: string) => {
//   try {
//     const statsDoc = await getDoc(doc(db, 'moderation-stats', authenticatorId));
//     if (statsDoc.exists()) {
//       return { moderationStats: statsDoc.data() };
//     }
//   } catch (error) {
//     console.error('Error loading authenticator data:', error);
//   }
//   return {};
// };
// //

// ///
// // In UserProvider.tsx - add time tracking methods
// const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // ... existing code

//   const updateScreenTime = async (minutesUsed: number) => {
//     if (!user.uid) return;
    
//     const newTimeLimit = Math.max(0, (user.timeLimit || 120) - minutesUsed);
//     const newDailyTime = (user.dailyScrollTime || 0) + minutesUsed;
    
//     await updateDoc(doc(db, 'users', user.uid), {
//       timeLimit: newTimeLimit,
//       dailyScrollTime: newDailyTime,
//       lastActive: serverTimestamp()
//     });
    
//     setUser(prev => new User({ 
//       ...prev, 
//       timeLimit: newTimeLimit,
//       dailyScrollTime: newDailyTime 
//     }));
//   };

//   const resetDailyTimeLimit = async () => {
//     if (!user.uid) return;
    
//     await updateDoc(doc(db, 'users', user.uid), {
//       timeLimit: 120, // Reset to 2 hours
//       dailyScrollTime: 0
//     });
    
//     setUser(prev => new User({ 
//       ...prev, 
//       timeLimit: 120,
//       dailyScrollTime: 0 
//     }));
//   };

//   // Check and reset time limit daily
//   useEffect(() => {
//     const checkDailyReset = () => {
//       const now = new Date();
//       const lastReset = user.lastReset ? new Date(user.lastReset) : new Date();
      
//       // If it's a new day, reset time limit
//       if (now.toDateString() !== lastReset.toDateString()) {
//         resetDailyTimeLimit();
//       }
//     };

//     checkDailyReset();
    
//     // Check every hour
//     const interval = setInterval(checkDailyReset, 60 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [user.lastReset]);

//   return (
//     <UserContext.Provider value={{
//       user,
//       updateUser,
//       clearUser,
//       login,
//       register,
//       logout,
//       updateUserProfile,
//       updateScreenTime, // Add this
//       resetDailyTimeLimit, // Add this
//       loading
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// ///
// ////
// // Enhanced time tracking in UserProvider
// const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [appStartTime, setAppStartTime] = useState<number | null>(null);

//   // Track when app becomes active/inactive
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         // App became active - start tracking
//         setAppStartTime(Date.now());
//         console.log('EduGram app opened');
//       } else if (nextAppState === 'background' || nextAppState === 'inactive') {
//         // App went to background - calculate time spent
//         if (appStartTime) {
//           const timeSpent = Math.floor((Date.now() - appStartTime) / (60 * 1000)); // minutes
//           if (timeSpent > 0) {
//             updateScreenTime(timeSpent);
//           }
//         }
//         setAppStartTime(null);
//       }
//     });

//     return () => subscription.remove();
//   }, [appStartTime]);
// };

// interface UserContextType {
//   user: User;
//   updateUser: (userData: Partial<User>) => void;
//   clearUser: () => void;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUserProfile: (userData: Partial<User>) => Promise<void>;
//   updateScreenTime: (minutes: number) => Promise<void>;
//   startSession: () => void;
//   endSession: () => void;
//   resetDailyTime: () => Promise<void>;
//   setTimeLimit: (minutes: number) => Promise<void>;
//   loading: boolean;
//   isAppActive: boolean;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User>(new User());
//   const [loading, setLoading] = useState(true);
//   const [isAppActive, setIsAppActive] = useState(true);
//   const [currentSessionStart, setCurrentSessionStart] = useState<number | null>(null);

//   // Track app state changes
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       if (nextAppState === 'active') {
//         // App became active
//         setIsAppActive(true);
//         startSession();
//       } else {
//         // App went to background/inactive
//         setIsAppActive(false);
//         endSession();
//       }
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);
//     return () => subscription.remove();
//   }, []);

//   // Daily time reset
//   useEffect(() => {
//     const checkAndResetDailyTime = () => {
//       const today = new Date().toDateString();
//       if (user.lastResetDate !== today) {
//         resetDailyTime();
//       }
//     };

//     checkAndResetDailyTime();
    
//     // Check every minute if it's a new day
//     const interval = setInterval(checkAndResetDailyTime, 60000);
//     return () => clearInterval(interval);
//   }, [user.lastResetDate]);

//   const startSession = () => {
//     setCurrentSessionStart(Date.now());
//     setUser(prev => new User({ 
//       ...prev, 
//       lastActiveTime: Date.now() 
//     }));
//   };

//   const endSession = async () => {
//     if (currentSessionStart) {
//       const sessionDuration = Math.floor((Date.now() - currentSessionStart) / (60 * 1000)); // minutes
//       if (sessionDuration > 0) {
//         await updateScreenTime(sessionDuration);
        
//         // Record session
//         const newSession: Session = {
//           startTime: currentSessionStart,
//           endTime: Date.now(),
//           duration: sessionDuration,
//           date: new Date().toDateString()
//         };
        
//         setUser(prev => new User({
//           ...prev,
//           sessionHistory: [...prev.sessionHistory, newSession]
//         }));
//       }
//     }
//     setCurrentSessionStart(null);
//   };

//   const updateScreenTime = async (minutes: number) => {
//     if (!user.uid || minutes <= 0) return;

//     const newTodaysUsage = (user.todaysUsage || 0) + minutes;
//     const newTimeLimit = Math.max(0, (user.timeLimit || 120) - minutes);
//     const newDailyScrollTime = (user.dailyScrollTime || 0) + minutes;

//     try {
//       await updateDoc(doc(db, 'users', user.uid), {
//         todaysUsage: newTodaysUsage,
//         timeLimit: newTimeLimit,
//         dailyScrollTime: newDailyScrollTime,
//         lastActiveTime: Date.now()
//       });

//       setUser(prev => new User({
//         ...prev,
//         todaysUsage: newTodaysUsage,
//         timeLimit: newTimeLimit,
//         dailyScrollTime: newDailyScrollTime,
//         lastActiveTime: Date.now()
//       }));
//     } catch (error) {
//       console.error('Error updating screen time:', error);
//     }
//   };

//   const resetDailyTime = async () => {
//     if (!user.uid) return;

//     const today = new Date().toDateString();
    
//     try {
//       await updateDoc(doc(db, 'users', user.uid), {
//         todaysUsage: 0,
//         timeLimit: 120, // Reset to 2 hours
//         lastResetDate: today
//       });

//       setUser(prev => new User({
//         ...prev,
//         todaysUsage: 0,
//         timeLimit: 120,
//         lastResetDate: today
//       }));
//     } catch (error) {
//       console.error('Error resetting daily time:', error);
//     }
//   };

//   const setTimeLimit = async (minutes: number) => {
//     if (!user.uid) return;

//     try {
//       await updateDoc(doc(db, 'users', user.uid), {
//         timeLimit: minutes
//       });

//       setUser(prev => new User({
//         ...prev,
//         timeLimit: minutes
//       }));
//     } catch (error) {
//       console.error('Error setting time limit:', error);
//     }
//   };

//   // ... rest of your existing UserProvider code (login, register, etc.)
//   // Make sure to include all the existing methods from your original UserProvider

//   return (
//     <UserContext.Provider value={{
//       user,
//       updateUser,
//       clearUser,
//       login,
//       register,
//       logout,
//       updateUserProfile,
//       updateScreenTime,
//       startSession,
//       endSession,
//       resetDailyTime,
//       setTimeLimit,
//       loading,
//       isAppActive
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
// //////////
// const register = async (email: string, password: string, userData: Partial<User>) => {
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
//   const newUser = new User({
//     ...userData,
//     uid: userCredential.user.uid,
//     email: userCredential.user.email,
//     createdAt: new Date().toISOString(),
//     followers: [],
//     following: [],
//     posts: [],
//     savedPosts: [],
//     dailyScrollTime: 0,
//     timeLimit: 120,
//     photoUrl: userData.photoUrl || require('../../assets/images/default_avatar.png'),
//   });

//   // Use the enhanced database service to create user with role
//   await databaseService.createUserWithRole(userCredential.user.uid, newUser.toFirestore());
//   setUser(newUser);

//   // Update Firebase auth profile
//   if (userData.username) {
//     await updateProfile(userCredential.user, {
//       displayName: userData.username,
//     });
//   }
// };
// //
// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };

// interface UserContextType {
//   user: User;
//   updateUser: (userData: Partial<User>) => void;
//   clearUser: () => void;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUserProfile: (userData: Partial<User>) => Promise<void>;
//   loading: boolean;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User>(new User());
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         // User is signed in
//         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setUser(new User({
//             ...userData,
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//           }));
//         }
//       } else {
//         // User is signed out
//         setUser(new User());
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const login = async (email: string, password: string) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       setUser(new User({
//         ...userData,
//         uid: userCredential.user.uid,
//         email: userCredential.user.email,
//       }));
//     }
//   };

//   const register = async (email: string, password: string, userData: Partial<User>) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
//     const newUser = {
//       ...userData,
//       uid: userCredential.user.uid,
//       email: userCredential.user.email,
//       createdAt: new Date().toISOString(),
//       followers: [],
//       following: [],
//       posts: [],
//       dailyScrollTime: 0,
//       timeLimit: 120,
//     };

//     await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
//     setUser(new User(newUser));

//     // Update Firebase auth profile
//     await updateProfile(userCredential.user, {
//       displayName: userData.username,
//     });
//   };

//   const updateUserProfile = async (userData: Partial<User>) => {
//     if (!user.uid) return;

//     await updateDoc(doc(db, 'users', user.uid), userData);
//     setUser(prev => new User({ ...prev, ...userData }));
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setUser(new User());
//   };

//   const updateUser = (userData: Partial<User>) => {
//     setUser(prev => new User({ ...prev, ...userData }));
//   };

//   const clearUser = () => {
//     setUser(new User());
//   };

//   return (
//     <UserContext.Provider value={{
//       user,
//       updateUser,
//       clearUser,
//       login,
//       register,
//       logout,
//       updateUserProfile,
//       loading
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
// app/lib/providers/UserProvider.tsx
// app/lib/providers/UserProvider.tsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { Session, User } from '../models/user';
import { cloudinaryService } from '../services/cloudinaryService';

interface UserContextType {
  user: User | null;
  hasUser: boolean;
  updateUser: (userData: Partial<User>) => void;
  clearUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (uri: string) => Promise<string | null>;
  updateScreenTime: (minutes: number) => Promise<void>;
  startSession: () => void;
  endSession: () => void;
  resetDailyTime: () => Promise<void>;
  setTimeLimit: (minutes: number) => Promise<void>;
  loading: boolean;
  isAppActive: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to clean data for Firebase
const cleanDataForFirebase = (data: any): any => {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach((key: string) => {
    if ((cleaned as any)[key] === undefined) {
      delete (cleaned as any)[key];
    }
  });
  return cleaned;
};

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'Authentication failed. Please try again';
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAppActive, setIsAppActive] = useState(true);
  const [currentSessionStart, setCurrentSessionStart] = useState<number | null>(null);

  // Track app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setIsAppActive(true);
        startSession();
      } else {
        setIsAppActive(false);
        endSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Daily time reset
  useEffect(() => {
    const checkAndResetDailyTime = () => {
      const today = new Date().toDateString();
      if (user?.lastResetDate !== today) {
        resetDailyTime();
      }
    };

    checkAndResetDailyTime();
    const interval = setInterval(checkAndResetDailyTime, 60000);
    return () => clearInterval(interval);
  }, [user?.lastResetDate]);

  useEffect(() => {
  console.log('🎯 USERPROVIDER MOUNTED - Current user:', user);
}, []);
  // In your UserProvider, add this useEffect
useEffect(() => {
  console.log('🔄 USERPROVIDER STATE UPDATED:', {
    hasUser: !!user,
    user: user,
    role: user?.role,
    uid: user?.uid
  });
}, [user]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Clean the data before setting it
            const cleanUserData = cleanDataForFirebase(userData);
            setUser(new User({
              ...cleanUserData,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
            }));
          } else {
            // Create user document if it doesn't exist
            const newUser = new User({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoUrl: require('@/assets/images/default_avatar.png'),
              bio: 'Welcome to EduGram!',
              followers: [],
              following: [],
              role: 'student',
              interests: [],
              dailyScrollTime: 0,
              timeLimit: 120,
              createdAt: new Date().toISOString(), // ✅ Pass as string
              updatedAt: new Date().toISOString(), 
              posts: [],
              savedPosts: [],
              notifications: true,
              emailNotifications: true,
            });
            
            const cleanUserData = cleanDataForFirebase(newUser.toFirestore());
            await setDoc(doc(db, 'users', firebaseUser.uid), cleanUserData);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error loading user:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const startSession = () => {
    setCurrentSessionStart(Date.now());
    setUser(prev => prev ? new User({ 
      ...prev, 
      lastActiveTime: Date.now() 
    }) : null);
  };

  const endSession = async () => {
    if (currentSessionStart && user) {
      const sessionDuration = Math.floor((Date.now() - currentSessionStart) / (60 * 1000));
      if (sessionDuration > 0) {
        await updateScreenTime(sessionDuration);
        
        const newSession: Session = {
          startTime: currentSessionStart,
          endTime: Date.now(),
          duration: sessionDuration,
          date: new Date().toDateString()
        };
        
        setUser(prev => prev ? new User({
          ...prev,
          sessionHistory: [...prev.sessionHistory, newSession]
        }) : null);
      }
    }
    setCurrentSessionStart(null);
  };

  const uploadProfilePicture = async (uri: string): Promise<string | null> => {
    if (!user) {
      throw new Error('User must be logged in to upload profile picture');
    }

    try {
      console.log('Uploading profile picture...', uri);
      
      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadProfilePicture(uri, user.uid);
      
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Upload failed - no URL returned');
      }

      // Update user profile with new photo URL
      await updateUserProfile({ photoUrl: uploadResult.url });
      console.log('Profile picture updated successfully');
      
      return uploadResult.url;
      
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      return null;
    }
  };

  const updateScreenTime = async (minutes: number) => {
    if (!user?.uid || minutes <= 0) return;

    const newTodaysUsage = (user.todaysUsage || 0) + minutes;
    const newTimeLimit = Math.max(0, (user.timeLimit || 120) - minutes);
    const newDailyScrollTime = (user.dailyScrollTime || 0) + minutes;

    try {
      const updateData = {
        todaysUsage: newTodaysUsage,
        timeLimit: newTimeLimit,
        dailyScrollTime: newDailyScrollTime,
        lastActiveTime: Date.now()
      };

      const cleanUpdateData = cleanDataForFirebase(updateData);
      await updateDoc(doc(db, 'users', user.uid), cleanUpdateData);

      setUser(prev => prev ? new User({
        ...prev,
        ...updateData
      }) : null);
    } catch (error) {
      console.error('Error updating screen time:', error);
    }
  };

  const resetDailyTime = async () => {
    if (!user?.uid) return;

    const today = new Date().toDateString();
    
    try {
      const updateData = {
        todaysUsage: 0,
        timeLimit: 120,
        lastResetDate: today
      };

      const cleanUpdateData = cleanDataForFirebase(updateData);
      await updateDoc(doc(db, 'users', user.uid), cleanUpdateData);

      setUser(prev => prev ? new User({
        ...prev,
        ...updateData
      }) : null);
    } catch (error) {
      console.error('Error resetting daily time:', error);
    }
  };

  const setTimeLimit = async (minutes: number) => {
    if (!user?.uid) return;

    try {
      const updateData = { timeLimit: minutes };
      const cleanUpdateData = cleanDataForFirebase(updateData);
      await updateDoc(doc(db, 'users', user.uid), cleanUpdateData);

      setUser(prev => prev ? new User({
        ...prev,
        timeLimit: minutes
      }) : null);
    } catch (error) {
      console.error('Error setting time limit:', error);
    }
  };

  // const login = async (email: string, password: string): Promise<void> => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const firebaseUser = userCredential.user;

  //     // Get user data from Firestore
  //     const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
        
  //       // Clean the data before setting it
  //       const cleanUserData = cleanDataForFirebase(userData);
  //       setUser(new User({
  //         ...cleanUserData,
  //         uid: firebaseUser.uid,
  //         email: firebaseUser.email || '',
  //       }));
  //     } else {
  //       // Create basic user profile
  //       const basicUser = new User({
  //         uid: firebaseUser.uid,
  //         email: firebaseUser.email || '',
  //         username: firebaseUser.email?.split('@')[0] || 'User',
  //         role: 'student',
  //         photoUrl: `https://via.placeholder.com/100?text=U`,
  //         bio: 'New EduGram user',
  //         interests: ['Learning'],
  //         followers: [],
  //         following: [],
  //         createdAt: new Date(),
  //         updatedAt: new Date()
  //       });

  //       const cleanUserData = cleanDataForFirebase(basicUser.toFirestore());
  //       await setDoc(doc(db, 'users', firebaseUser.uid), cleanUserData);
  //       setUser(basicUser);
  //     }

  //   } catch (error: any) {
  //     console.error('Firebase login error:', error);
  //     throw new Error(getFirebaseAuthError(error.code));
  //   }
  // };
  const login = async (email: string, password: string): Promise<void> => {
  try {
    console.log('Login attempt:', email, password);
    
    // COMPLETE MOCK USERS - Add student and authenticator
    const mockUsers = {
      'teacher@edugram.com': { 
        uid: 'mock-teacher-123', 
        email: 'teacher@edugram.com', 
        username: 'demo_teacher', 
        role: 'teacher',
        photoUrl: 'https://via.placeholder.com/100?text=T',
        bio: 'Mathematics professor',
        interests: ['Mathematics', 'Education'],
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'student@edugram.com': { 
        uid: 'mock-student-123', 
        email: 'student@edugram.com', 
        username: 'demo_student', 
        role: 'student',
        photoUrl: 'https://via.placeholder.com/100?text=S',
        bio: 'Computer Science student',
        interests: ['Programming', 'AI'],
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'authenticator@edugram.com': { 
        uid: 'mock-auth-123', 
        email: 'authenticator@edugram.com', 
        username: 'content_moderator', 
        role: 'authenticator',
        photoUrl: 'https://via.placeholder.com/100?text=A',
        bio: 'Content moderator',
        interests: ['Education', 'Quality'],
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    // Check if user exists and password is correct
    const mockUser = (mockUsers as any)[email];
    
    if (mockUser) {
      console.log('Mock login successful:', mockUser);
      const userInstance = new User(mockUser);
      setUser(userInstance);
    } else {
      console.log('Mock login failed - user not found');
      throw new Error('User not found');
    }

  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Invalid email or password');
  }
};
    // Check if user exists and password is correct
//     const mockUser = (mockUsers as any)[email];
    
//     if (mockUser && password === 'password123') {
//       console.log('Mock login successful:', mockUser);
//       setUser(new User(mockUser));
//     } else {
//       console.log('Mock login failed - invalid credentials');
//       throw new Error('Invalid email or password');
//     }

//   } catch (error: any) {
//     console.error('Login error:', error);
//     throw new Error(error.message || 'Invalid email or password');
//   }
// };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Clean the user data first
      const cleanUserData = cleanDataForFirebase(userData);
      
      const newUser = new User({
        ...cleanUserData,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        username: cleanUserData.username || firebaseUser.email?.split('@')[0] || 'User',
        role: cleanUserData.role || 'student',
        createdAt: new Date().toISOString(),
        followers: [],
        following: [],
        posts: [],
        savedPosts: [],
        dailyScrollTime: 0,
        timeLimit: 120,
        photoUrl: cleanUserData.photoUrl || require('@/assets/images/default_avatar.png'),
      });

      const cleanFirestoreData = cleanDataForFirebase(newUser.toFirestore());
      await setDoc(doc(db, 'users', firebaseUser.uid), cleanFirestoreData);
      setUser(newUser);

      if (cleanUserData.username) {
        await updateProfile(firebaseUser, {
          displayName: cleanUserData.username,
        });
      }

    } catch (error: any) {
      console.error('Firebase registration error:', error);
      throw new Error(getFirebaseAuthError(error.code));
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user?.uid) return;

    try {
      const cleanUserData = cleanDataForFirebase(userData);
      await updateDoc(doc(db, 'users', user.uid), cleanUserData);
      setUser(prev => prev ? new User({ ...prev, ...userData }) : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  const logout = async () => {
    try {
      await endSession();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Logout failed');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? new User({ ...prev, ...userData }) : null);
  };

  const clearUser = () => {
    setUser(null);
  };

  const contextValue: UserContextType = {
    user,
    hasUser: !!user,
    updateUser,
    clearUser,
    login,
    register,
    logout,
    updateUserProfile,
    uploadProfilePicture,
    updateScreenTime,
    startSession,
    endSession,
    resetDailyTime,
    setTimeLimit,
    loading,
    isAppActive
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  // TEMPORARY: Always return a teacher for testing
  if (context === undefined) {
    console.log('⚠️ UserProvider not found, using mock teacher');
    return {
      user: {
        username: 'Test Teacher',
        role: 'teacher',
        uid: 'mock-teacher-123'
      } as any,
      // ... other properties with empty functions
      updateUser: () => {},
      clearUser: () => {},
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      updateUserProfile: async () => {},
      uploadProfilePicture: async () => null,
      updateScreenTime: async () => {},
      startSession: () => {},
      endSession: () => {},
      resetDailyTime: async () => {},
      setTimeLimit: async () => {},
      loading: false,
      isAppActive: true,
      hasUser: true
    };
  }
  
  return context;
};

export default UserProvider;