import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth, authUserToStudent } from '../context/AuthContext';
import { Avatar } from './ui';
import { notifications } from '../data/mockData';
const pageTitles = {
    dashboard: 'Dashboard',
    discover: 'Discover Problems',
    'my-problems': 'My Problems',
    'my-collaborations': 'My Collaborations',
    workspace: 'Collaboration Workspace',
    tasks: 'Tasks',
    messages: 'Messages',
    notifications: 'Notifications',
    profile: 'My Profile',
    settings: 'Settings',
    'find-collaborators': 'Find Collaborators',
    'post-problem': 'Post a Problem',
    'problem-details': 'Problem Details',
};
export default function AppShell({ currentPage, navigate, children }) {
    const { user } = useAuth();
    const unread = notifications.filter(n => !n.read).length;
    const title = pageTitles[currentPage] || '';
    const avatarStudent = user ? authUserToStudent(user) : null;
    return (<div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentPage={currentPage} navigate={navigate}/>

      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-6 shrink-0">
          <h1 className="font-bold text-slate-900 font-display text-lg leading-none">{title}</h1>
          <div className="flex-1"/>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input type="text" placeholder="Search problems, people…" className="w-64 h-8 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white placeholder:text-slate-400 transition-all"/>
          </div>
          <button onClick={() => navigate('notifications')} className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <Bell className="w-5 h-5"/>
            {unread > 0 && (<span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unread}
              </span>)}
          </button>
          <button onClick={() => navigate('profile')} className="rounded-full">
            {avatarStudent ? (<Avatar student={avatarStudent} size="sm"/>) : (<div className="w-8 h-8 rounded-full bg-slate-200"/>)}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>);
}
