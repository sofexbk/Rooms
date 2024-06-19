import axiosInstance from '@/apiConfig';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfCreation: string;
  avatarUrl: string | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiring: string | null;
  isGoogle: boolean | null;
  isGithub: boolean | null;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfCreation: string;
  avatarUrl?: string | null;
  isGoogle?: boolean | null;
  isGithub?: boolean | null;
}

type AccessToken = string;

interface AuthContextType {
  user: UserData | null;
  token: AccessToken | null;
  users: User[] | null;
  getUser: (id: number) => Promise<User>;
  login: (userData: UserData, accessToken: AccessToken) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<AccessToken | null>(null);
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    const tokenFromStorage = localStorage.getItem('token');
    if (userFromStorage && tokenFromStorage) {
      setUser(JSON.parse(userFromStorage));
      setToken(JSON.parse(tokenFromStorage));
    }
  }, []);

  const login = (userData: UserData, accessToken: AccessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', JSON.stringify(accessToken));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  // Users is all users, joue le role d my friends for now , the list of contacts I can chat with.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/allusers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user, token]);

  const getUser = async (userId: number): Promise<User> => {
    try {
      const response = await axiosInstance.get(`/api/userbyid/${userId}`);
      const userData = response.data as User;
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

 
  
  
  return (
    <AuthContext.Provider value={{ user, token, users, getUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
