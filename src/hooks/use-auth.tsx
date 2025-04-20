
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User } from '../api/types';
import { login, logout, getCurrentUser, isAuthenticated } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user query
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser().then((res) => res.data),
    enabled: isAuth,
    onError: () => {
      // If getting the current user fails, assume not authenticated
      setIsAuth(false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials.email, credentials.password),
    onSuccess: (data) => {
      setIsAuth(true);
      queryClient.setQueryData(['currentUser'], data.data.user);
      toast.success('Login successful');
      navigate('/companies');
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      setIsAuth(false);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  // Handle login function
  const handleLogin = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Handle logout function
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Check authentication status on mount
  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
        error: error as Error || null,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
