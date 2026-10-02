import React, { createContext, useContext, useState } from 'react';
import type { Student } from '../types';

export interface AuthUser {
  name: string;
  email: string;
  branch: string;
  year: number;
  entryNumber: string;
  bio: string;
  skills: string[];
  interests: string[];
  availability: 'available' | 'busy' | 'unavailable';
  cgpa: number | null;
  github: string;
  linkedin: string;
  contributions: number;
  problemsSolved: number;
  collaborations: number;
  tasksCompleted: number;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  clearUser: () => void;
  asStudent: () => Student | null;
}

const AVATAR_COLORS = ['#4F46E5', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0284C7', '#6D28D9'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function authUserToStudent(user: AuthUser): Student {
  return {
    id: '__me__',
    name: user.name,
    initials: getInitials(user.name),
    avatarColor: getAvatarColor(user.name),
    branch: user.branch,
    department: 'SMVDU',
    year: user.year,
    skills: user.skills,
    interests: user.interests,
    availability: user.availability,
    contributions: user.contributions,
    problemsSolved: user.problemsSolved,
    collaborations: user.collaborations,
    bio: user.bio,
    email: user.email,
    github: user.github || undefined,
    linkedin: user.linkedin || undefined,
    cgpa: user.cgpa ?? 0,
    location: 'SMVDU',
  };
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
  clearUser: () => {},
  asStudent: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  function setUser(u: AuthUser) {
    setUserState(u);
  }

  function updateUser(partial: Partial<AuthUser>) {
    setUserState(prev => (prev ? { ...prev, ...partial } : prev));
  }

  function clearUser() {
    setUserState(null);
  }

  function asStudent(): Student | null {
    return user ? authUserToStudent(user) : null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, clearUser, asStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
