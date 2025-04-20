
import { User, AuthResponse, ApiResponse } from './types';

// Mock user data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@recruitflow.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=john',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@recruitflow.com',
    role: 'recruiter',
    avatar: 'https://i.pravatar.cc/150?u=jane',
  },
];

// Mock JWT token
const generateToken = (user: User): string => {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

// Login function
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = users.find((u) => u.email === email);
  
  if (!user || password !== 'password') {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return {
    success: true,
    data: {
      user,
      token,
    },
  };
};

// Get current user function
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    throw new Error('Not authenticated');
  }

  try {
    const user = JSON.parse(userStr) as User;
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    throw new Error('Invalid user data');
  }
};

// Logout function
export const logout = async (): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');

  return {
    success: true,
    data: null,
  };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('auth_token') !== null;
};
