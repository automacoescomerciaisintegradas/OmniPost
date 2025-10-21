import { create } from 'zustand';
import { api } from '@/lib/api-client';
import type { Profile, ApiKey, PaginatedResponse, ConnectedAccount, Account } from '@shared/types';
interface AppState {
  profiles: Profile[];
  apiKeys: ApiKey[];
  account: Account | null;
  loading: {
    profiles: boolean;
    apiKeys: boolean;
    account: boolean;
    avatar: boolean;
  };
  error: {
    profiles: string | null;
    apiKeys: string | null;
    account: string | null;
    avatar: string | null;
  };
  fetchProfiles: () => Promise<void>;
  createProfile: (name: string) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<void>;
  updateProfile: (profileId: string, updatedAccounts: ConnectedAccount[]) => Promise<void>;
  fetchApiKeys: () => Promise<void>;
  createApiKey: () => Promise<ApiKey>;
  deleteApiKey: (id: string) => Promise<void>;
  fetchAccount: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  logout: () => void;
}
export const useAppStore = create<AppState>((set, get) => ({
  profiles: [],
  apiKeys: [],
  account: null,
  loading: {
    profiles: false,
    apiKeys: false,
    account: false,
    avatar: false,
  },
  error: {
    profiles: null,
    apiKeys: null,
    account: null,
    avatar: null,
  },
  fetchProfiles: async () => {
    set(state => ({ loading: { ...state.loading, profiles: true }, error: { ...state.error, profiles: null } }));
    try {
      const response = await api<PaginatedResponse<Profile>>('/api/profiles');
      set({ profiles: response.items });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profiles';
      set(state => ({ error: { ...state.error, profiles: errorMessage } }));
    } finally {
      set(state => ({ loading: { ...state.loading, profiles: false } }));
    }
  },
  createProfile: async (name: string) => {
    const newProfile = await api<Profile>('/api/profiles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    set(state => ({ profiles: [...state.profiles, newProfile] }));
    return newProfile;
  },
  deleteProfile: async (id: string) => {
    await api(`/api/profiles/${id}`, { method: 'DELETE' });
    set(state => ({ profiles: state.profiles.filter(p => p.id !== id) }));
  },
  updateProfile: async (profileId: string, connectedAccounts: ConnectedAccount[]) => {
    const originalProfiles = get().profiles;
    const updatedProfiles = originalProfiles.map(p =>
      p.id === profileId ? { ...p, connectedAccounts } : p
    );
    set({ profiles: updatedProfiles });
    try {
      await api(`/api/profiles/${profileId}`, {
        method: 'PUT',
        body: JSON.stringify({ connectedAccounts }),
      });
    } catch (error) {
      set({ profiles: originalProfiles });
      throw error;
    }
  },
  fetchApiKeys: async () => {
    set(state => ({ loading: { ...state.loading, apiKeys: true }, error: { ...state.error, apiKeys: null } }));
    try {
      const response = await api<PaginatedResponse<ApiKey>>('/api/api-keys');
      set({ apiKeys: response.items });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch API keys';
      set(state => ({ error: { ...state.error, apiKeys: errorMessage } }));
    } finally {
      set(state => ({ loading: { ...state.loading, apiKeys: false } }));
    }
  },
  createApiKey: async () => {
    const newApiKey = await api<ApiKey>('/api/api-keys', { method: 'POST' });
    set(state => ({ apiKeys: [...state.apiKeys, newApiKey] }));
    return newApiKey;
  },
  deleteApiKey: async (id: string) => {
    await api(`/api/api-keys/${id}`, { method: 'DELETE' });
    set(state => ({ apiKeys: state.apiKeys.filter(k => k.id !== id) }));
  },
  fetchAccount: async () => {
    set(state => ({ loading: { ...state.loading, account: true }, error: { ...state.error, account: null } }));
    try {
      const accountData = await api<Account>('/api/account');
      set({ account: accountData });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account details';
      set(state => ({ error: { ...state.error, account: errorMessage } }));
    } finally {
      set(state => ({ loading: { ...state.loading, account: false } }));
    }
  },
  uploadAvatar: async (file: File) => {
    set(state => ({ loading: { ...state.loading, avatar: true }, error: { ...state.error, avatar: null } }));
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await fetch('/api/account/avatar', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Avatar upload failed');
      }
      set(state => ({
        account: state.account ? { ...state.account, avatarUrl: result.data.newAvatarUrl } : null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set(state => ({ error: { ...state.error, avatar: errorMessage } }));
      throw error; // Re-throw to be caught by toast in the component
    } finally {
      set(state => ({ loading: { ...state.loading, avatar: false } }));
    }
  },
  logout: () => {
    set({
      profiles: [],
      apiKeys: [],
      account: null,
      error: {
        profiles: null,
        apiKeys: null,
        account: null,
        avatar: null,
      },
    });
  },
}));