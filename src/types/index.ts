/**
 * Core types for the vertical storytelling platform
 */

export interface AudioConfig {
  src: string;
  label?: string;
  duration?: number;
  autoplay?: boolean;
}

export interface PanelContent {
  id: string;
  title?: string;
  description?: string;
  visualContent: React.ReactNode;
  audio?: AudioConfig;
  backgroundColor?: string;
  minHeight?: string | number;
  customClassName?: string;
  metadata?: Record<string, any>;
}

export interface StoryConfig {
  id: string;
  title: string;
  description?: string;
  panels: PanelContent[];
  theme?: ThemeConfig;
  autoPlayAudio?: boolean;
  pauseOtherAudio?: boolean;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  panelShadow?: string;
  transitionSpeed?: number;
}

export interface PanelPosition {
  id: string;
  top: number;
  height: number;
  isInView: boolean;
  progress: number; // 0-1, how visible the panel is
}

// Admin and Viewer types for manhwa panels
export interface StoredPanel {
  id: string;
  title?: string;
  description?: string;
  imageBase64: string;
  audioBase64?: string;
  audioFileName?: string;
  imageFileName: string;
}

export interface StoredStory {
  id: string;
  title: string;
  description?: string;
  panels: StoredPanel[];
  createdAt: string;
  creatorId: string;
  isPaid: boolean;
  price?: number;
  coverImageBase64?: string;
}

// User & Authentication
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  subscription: {
    status: 'active' | 'expired' | 'cancelled';
    expiresAt: string;
    planType: 'free' | 'premium';
  };
}

export interface UserPurchase {
  userId: string;
  storyId: string;
  purchasedAt: string;
  expiresAt?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 30 | 90 | 365;
  description: string;
}
