export class Post {
  description: string;
  uid: string;
  username: string;
  likes: string[];
  postId: string;
  datePublished: Date;
  postUrl: string;
  profImage: any;
  category: string;
  educationLevel: string;
  estimatedReadTime: number;
  tags: string[];

  constructor({
    description,
    uid,
    username,
    likes,
    postId,
    datePublished,
    postUrl,
    profImage,
    category,
    educationLevel,
    estimatedReadTime,
    tags,
  }: {
    description: string;
    uid: string;
    username: string;
    likes: string[];
    postId: string;
    datePublished: Date;
    postUrl: string;
    profImage: any;
    category: string;
    educationLevel: string;
    estimatedReadTime: number;
    tags: string[];
  }) {
    this.description = description;
    this.uid = uid;
    this.username = username;
    this.likes = likes || [];
    this.postId = postId;
    this.datePublished = datePublished;
    this.postUrl = postUrl;
    this.profImage = profImage;
    this.category = category || 'study';
    this.educationLevel = educationLevel || 'college';
    this.estimatedReadTime = estimatedReadTime || 5;
    this.tags = tags || [];
  }

  static fromSnap(snap: any): Post {
    const snapshot = snap.data();
    
    return new Post({
      description: snapshot.description,
      uid: snapshot.uid,
      likes: snapshot.likes,
      postId: snapshot.postId,
      datePublished: snapshot.datePublished?.toDate(),
      username: snapshot.username,
      postUrl: snapshot.postUrl,
      profImage: snapshot.profImage,
      category: snapshot.category || 'study',
      educationLevel: snapshot.educationLevel || 'college',
      estimatedReadTime: snapshot.estimatedReadTime || 5,
      tags: snapshot.tags || [],
    });
  }

  toJson() {
    return {
      description: this.description,
      uid: this.uid,
      likes: this.likes,
      username: this.username,
      postId: this.postId,
      datePublished: this.datePublished,
      postUrl: this.postUrl,
      profImage: this.profImage,
      category: this.category,
      educationLevel: this.educationLevel,
      estimatedReadTime: this.estimatedReadTime,
      tags: this.tags,
    };
  }
}
// Add at the end of the file  
export default function PostModel() {
  return null; // This is just to satisfy Expo Router
}