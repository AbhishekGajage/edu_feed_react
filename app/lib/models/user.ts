// export class User {
//   email: string;
//   uid: string;
//   photoUrl: any;
//   username: string;
//   bio: string;
//   followers: string[];
//   following: string[];
//   userType: string;
//   interests: string[];
//   dailyScrollTime: number;
//   timeLimit: number;

//   constructor({
//     email,
//     uid,
//     photoUrl,
//     username,
//     bio,
//     followers,
//     following,
//     userType,
//     interests,
//     dailyScrollTime,
//     timeLimit,
//   }: {
//     email: string;
//     uid: string;
//     photoUrl: any;
//     username: string;
//     bio: string;
//     followers: string[];
//     following: string[];
//     userType: string;
//     interests: string[];
//     dailyScrollTime: number;
//     timeLimit: number;
//   }) {
//     this.email = email;
//     this.uid = uid;
//     this.photoUrl = photoUrl;
//     this.username = username;
//     this.bio = bio;
//     this.followers = followers || [];
//     this.following = following || [];
//     this.userType = userType || 'student';
//     this.interests = interests || [];
//     this.dailyScrollTime = dailyScrollTime || 0;
//     this.timeLimit = timeLimit || 120;
//   }

//   static fromSnap(snap: any): User {
//     const snapshot = snap.data();
    
//     return new User({
//       username: snapshot.username,
//       uid: snapshot.uid,
//       email: snapshot.email,
//       photoUrl: snapshot.photoUrl,
//       bio: snapshot.bio,
//       followers: snapshot.followers || [],
//       following: snapshot.following || [],
//       userType: snapshot.userType || 'student',
//       interests: snapshot.interests || [],
//       dailyScrollTime: snapshot.dailyScrollTime || 0,
//       timeLimit: snapshot.timeLimit || 120,
//     });
//   }

//   toJson() {
//     return {
//       username: this.username,
//       uid: this.uid,
//       email: this.email,
//       photoUrl: this.photoUrl,
//       bio: this.bio,
//       followers: this.followers,
//       following: this.following,
//       userType: this.userType,
//       interests: this.interests,
//       dailyScrollTime: this.dailyScrollTime,
//       timeLimit: this.timeLimit,
//     };
//   }
// }
// app/lib/models/user.ts
export interface Session {
  startTime: number;
  endTime: number;
  duration: number;
  date: string;
}

export interface DailyGoal {
  date: string;
  targetTime: number;
  actualTime: number;
  completed: boolean;
}

export interface RolePermissions {
  canCreatePost?: boolean;
  canLikePost?: boolean;
  canComment?: boolean;
  canFollow?: boolean;
  canViewContent?: boolean;
  canDeleteOwnPost?: boolean;
  canReportPost?: boolean;
  canViewStudentProgress?: boolean;
  canCreateOpportunities?: boolean;
  canManageClassroom?: boolean;
  canAccessAnalytics?: boolean;
  canModeratePosts?: boolean;
  canDeleteAnyPost?: boolean;
  canVerifyEducationalContent?: boolean;
  canViewAllPosts?: boolean;
  canBanUsers?: boolean;
  canManageUsers?: boolean;
  canAccessAdminPanel?: boolean;
  canAccessModerationTools?: boolean;
  canManageRoles?: boolean;
}

export interface ModerationStats {
  totalReviewed: number;
  approved: number;
  rejected: number;
  pending: number;
  accuracy?: number;
}

export class User {
  uid: string = '';
  username: string = '';
  email: string = '';
  photoUrl: string | any = '';
  userType: string = 'student';
  bio: string = '';
  followers: string[] = [];
  following: string[] = [];
  
  // Enhanced Role System
  role: 'student' | 'teacher' | 'authenticator' | 'admin' = 'student';
  rolePermissions: RolePermissions = {};
  
  // Teacher-specific fields
  teacherId?: string;
  subjects?: string[];
  students?: string[];
  teachingSince?: string;
  qualifications?: string[];
  
  // Authenticator-specific fields
  authenticatorId?: string;
  verifiedPosts?: string[];
  rejectedPosts?: string[];
  moderationStats?: ModerationStats;
  
  interests: string[] = [];
  dailyScrollTime: number = 0;
  pushNotifications?: boolean = true;
  studyReminders?: boolean = true;
  timeLimit: number = 120;
  lastActiveTime: number = Date.now();
  todaysUsage: number = 0;
  weeklyUsage: number = 0;
  lastResetDate: string = new Date().toDateString();
  breakReminders: boolean = true;
  focusMode: boolean = false;
  
  // Analytics
  sessionHistory: Session[] = [];
  dailyGoals: DailyGoal[] = [];
  
  createdAt: string | Date = new Date().toISOString();
  updatedAt: string | Date = new Date().toISOString();
  posts: string[] = [];
  savedPosts: string[] = [];
  notifications: boolean = true;
  emailNotifications: boolean = true;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
      this.rolePermissions = this.getDefaultPermissions();
    }
  }

  private getDefaultPermissions(): RolePermissions {
    const basePermissions = {
      canCreatePost: true,
      canLikePost: true,
      canComment: true,
      canFollow: true,
      canViewContent: true,
    };

    switch (this.role) {
      case 'student':
        return {
          ...basePermissions,
          canCreatePost: true,
          canDeleteOwnPost: true,
          canReportPost: true,
        };
      
      case 'teacher':
        return {
          ...basePermissions,
          canCreatePost: true,
          canDeleteOwnPost: true,
          canViewStudentProgress: true,
          canCreateOpportunities: true,
          canManageClassroom: true,
          canAccessAnalytics: true,
        };
      
      case 'authenticator':
        return {
          ...basePermissions,
          canModeratePosts: true,
          canDeleteAnyPost: true,
          canVerifyEducationalContent: true,
          canViewAllPosts: true,
          canBanUsers: true,
          canAccessModerationTools: true,
        };
      
      case 'admin':
        return {
          ...basePermissions,
          canModeratePosts: true,
          canDeleteAnyPost: true,
          canVerifyEducationalContent: true,
          canViewAllPosts: true,
          canBanUsers: true,
          canManageUsers: true,
          canAccessAdminPanel: true,
          canManageRoles: true,
        };
      
      default:
        return basePermissions;
    }
  }

  hasPermission(permission: keyof RolePermissions): boolean {
    return this.rolePermissions[permission] === true;
  }

  toFirestore() {
    return {
      uid: this.uid,
      username: this.username,
      email: this.email,
      photoUrl: this.photoUrl,
      bio: this.bio,
      followers: this.followers,
      following: this.following,
      role: this.role,
      rolePermissions: this.rolePermissions,
      teacherId: this.teacherId,
      subjects: this.subjects,
      students: this.students,
      teachingSince: this.teachingSince,
      qualifications: this.qualifications,
      authenticatorId: this.authenticatorId,
      verifiedPosts: this.verifiedPosts,
      rejectedPosts: this.rejectedPosts,
      moderationStats: this.moderationStats,
      interests: this.interests,
      dailyScrollTime: this.dailyScrollTime,
      timeLimit: this.timeLimit,
      lastActiveTime: this.lastActiveTime,
      todaysUsage: this.todaysUsage,
      weeklyUsage: this.weeklyUsage,
      lastResetDate: this.lastResetDate,
      breakReminders: this.breakReminders,
      focusMode: this.focusMode,
      sessionHistory: this.sessionHistory,
      dailyGoals: this.dailyGoals,
      createdAt: typeof this.createdAt === 'string' ? this.createdAt : this.createdAt.toISOString(),
      updatedAt: typeof this.updatedAt === 'string' ? this.updatedAt : this.updatedAt.toISOString(),
      posts: this.posts,
      savedPosts: this.savedPosts,
      notifications: this.notifications,
      emailNotifications: this.emailNotifications,
    };
  }
}
// Add at the end of the file
export default function UserModel() {
  return null; // This is just to satisfy Expo Router
}