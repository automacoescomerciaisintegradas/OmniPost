export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// OmniPost AI specific types
export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'x' | 'threads';
export interface ConnectedAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
}
export interface Profile {
  id: string;
  name: string;
  connectedAccounts: ConnectedAccount[];
  createdAt: string;
}
export interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}
export interface Plan {
  id: string;
  name: string;
  price: string;
  pricePeriod: string;
  features: string[];
  isCurrent?: boolean;
  cta: string;
}
export interface Account {
  id: string;
  email: string;
  plan: string;
  avatarUrl: string | null;
}