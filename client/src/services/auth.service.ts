import api from '@/lib/axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  workspaces: string[];
  teams: string[];
  createdAt: string;
  onboarded?: boolean;
  preferences?: any;
  updatedAt?: string;
}

// Default user for the application
const DEFAULT_USER: User = {
  _id: '123456789',
  name: 'Default User',
  email: 'default@asanaclone.com',
  avatar: null,
  role: 'user',
  workspaces: [],
  teams: [],
  preferences: {},
  onboarded: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const authService = {

  // Get current user (always returns default user)
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return {
      success: true,
      user: DEFAULT_USER,
    };
  },

  // Update user profile (updates default user in memory)
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    Object.assign(DEFAULT_USER, data);
    return {
      success: true,
      user: DEFAULT_USER,
    };
  },

  // Complete onboarding (updates default user's onboarded status)
  completeOnboarding: async (data: {
    role: string;
    workFunctions: string[];
    asanaUses: string[];
    selectedTools: string[];
    projectName: string;
    tasks: string[];
    sections: string[];
    layout: string;
    inviteEmails?: string[];
  }) => {
    DEFAULT_USER.onboarded = true;
    return {
      success: true,
      data: {
        user: DEFAULT_USER
      }
    };
  },
};
