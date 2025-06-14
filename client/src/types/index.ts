export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'instructor' | 'admin';
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  yogaLevel?: string;
  stripeCustomerId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  enrolledClasses: YogaClass[];
  teachingClasses: YogaClass[];
  subscription?: {
    plan: 'basic' | 'premium' | 'elite';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  _id: string;
  name: string;
  email: string;
}

export interface YogaClass {
  _id: string;
  title: string;
  description: string;
  image?: string;
  thumbnailUrl?: string;
  style: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string | Instructor;
  duration: number;
  price: number;
  capacity: number;
  booked: number;
  enrolledStudents: string[];
  date: string;
  location: {
    type: 'online' | 'in-person';
    address?: string;
    meetingLink?: string;
  };
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  user: User;
  class?: YogaClass;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer';
  stripePaymentId: string;
  stripeCustomerId: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  user?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    maxLiveSessions: number;
    maxOnDemandContent: number;
    hasCommunityAccess: boolean;
    hasPersonalizedPlan: boolean;
    hasProgressTracking: boolean;
    hasChallengesAccess: boolean;
  };
  popular?: boolean;
}

export interface IContent {
  _id: string;
  title: string;
  description?: string;
  contentType: 'youtube' | 'website' | 'article' | 'manual_video' | 'pdf';
  url: string;
  createdAt: string;
  updatedAt: string;
} 