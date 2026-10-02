import React from 'react';
import type { PageId, Navigate } from '../types';
import { useAuth, authUserToStudent } from '../context/AuthContext';
import { Avatar, StatusDot } from './ui';
import {
  LayoutDashboard, Search, FileText, Users, CheckSquare,
  MessageSquare, Bell, User, Settings, Zap, ChevronRight,
  Plus, LogOut,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, group: 'main' },
  { id: 'discover', label: 'Discover Problems', icon: <Search />, group: 'main' },
  { id: 'my-problems', label: 'My Problems', icon: <FileText />, group: 'main' },
  { id: 'my-collaborations', label: 'Collaborations', icon: <Users />, group: 'work' },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare />, badge: 3, group: 'work' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare />, badge: 3, group: 'work' },
  { id: 'notifications', label: 'Notifications', icon: <Bell />, badge: 3, group: 'work' },
  { id: 'profile', label: 'My Profile', icon: <User />, group: 'account' },
  { id: 'settings', label: 'Settings', icon: <Settings />, group: 'account' },
];

interface SidebarProps {
  currentPage: PageId;
  navigate: Navigate;
}

export default function Sidebar({ currentPage, navigate }: SidebarProps) {
  const { user, clearUser } = useAuth();
  const authStudent = user ? authUserToStudent(user) : null;

  const groups = [
    { key: 'main', label: 'Explore' },
    { key: 'work', label: 'Workspace' },
    { key: 'account', label: 'Account' },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-slate-50 border-r border-slate-200 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-200 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 font-display tracking-tight text-base">CollabHub <span className="text-indigo-500 font-medium text-xs">SMVDU</span></span>
      </div>

      {/* Post button */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <button
          onClick={() => navigate('post-problem')}
          className="w-full flex items-center justify-center gap-2 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Post a Problem
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {groups.map(group => {
          const items = navItems.filter(n => n.group === group.key);
          return (
            <div key={group.key} className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
              {items.map(item => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`sidebar-nav-item w-full flex items-center gap-2.5 px-2.5 h-8 rounded-lg text-sm font-medium mb-0.5 ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-4 h-4 shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && !active && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 font-semibold leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Find Collaborators link */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Network
          </p>
          <button
            onClick={() => navigate('find-collaborators')}
            className={`sidebar-nav-item w-full flex items-center gap-2.5 px-2.5 h-8 rounded-lg text-sm font-medium mb-0.5 ${
              currentPage === 'find-collaborators'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span className="w-4 h-4 shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <span className="flex-1 text-left">Find Collaborators</span>
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        {authStudent ? (
          <button
            onClick={() => navigate('profile')}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-200 transition-colors group"
          >
            <Avatar student={authStudent} size="sm" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-none mb-0.5">{authStudent.name}</p>
              <div className="flex items-center gap-1">
                <StatusDot status={authStudent.availability} />
                <span className="text-xs text-slate-500 truncate">
                  {authStudent.branch.split(' ')[0]} · Year {authStudent.year}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600 transition-colors" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 p-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-400">Not signed in</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { clearUser(); navigate('landing'); }}
          className="w-full flex items-center gap-2 mt-1 px-2 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
