import React, { createContext, useContext, useState } from 'react';
const AVATAR_COLORS = ['#4F46E5', '#7C3AED', '#059669', '#DC2626', '#D97706', '#0284C7', '#6D28D9'];
function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
export function authUserToStudent(user) {
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
const AuthContext = createContext({
    user: null,
    setUser: () => { },
    updateUser: () => { },
    clearUser: () => { },
    asStudent: () => null,
});
export function AuthProvider({ children }) {
    const [user, setUserState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('collabhub_user') || 'null');
        } catch {
            return null;
        }
    });
    function setUser(u) {
        setUserState(u);
        if (u) localStorage.setItem('collabhub_user', JSON.stringify(u));
    }
    function updateUser(partial) {
        setUserState(prev => (prev ? { ...prev, ...partial } : prev));
    }
    function clearUser() {
        setUserState(null);
        localStorage.removeItem('collabhub_user');
    }
    function asStudent() {
        return user ? authUserToStudent(user) : null;
    }
    return (<AuthContext.Provider value={{ user, setUser, updateUser, clearUser, asStudent }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    return useContext(AuthContext);
}
