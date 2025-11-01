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
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
