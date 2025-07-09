import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  full_name?: string;
  address?: string;
  phone?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  address?: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ message: string; userId: number }> {
    const response = await api.post<{ message: string; userId: number }>('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/profile', data);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/auth/users');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/change-password', data);
    return response.data;
  },
};

export default authService; 