import api from '@/lib/axios';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

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
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    // Transform server response to match AuthResponse interface
    const { data: userData } = response.data;
    return {
      success: response.data.success,
      token: userData.token,
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role || 'user',
        workspaces: userData.workspaces || [],
        teams: userData.teams || [],
        createdAt: userData.createdAt || new Date().toISOString(),
        onboarded: userData.onboarded || false,
      },
    };
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    // Transform server response to match AuthResponse interface
    const { data: userData } = response.data;
    return {
      success: response.data.success,
      token: userData.token,
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role || 'user',
        workspaces: userData.workspaces || [],
        teams: userData.teams || [],
        createdAt: userData.createdAt || new Date().toISOString(),
        onboarded: userData.onboarded || false,
      },
    };
  },

  // Get current user
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/me');
    // Transform server response format { success, data } to { success, user }
    return {
      success: response.data.success,
      user: response.data.data,
    };
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Complete onboarding
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
    const response = await api.post('/auth/onboarding', data);
    return response.data;
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
