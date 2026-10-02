import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, withUserId } from '../api';
import { notifications as initialNotifs } from '../data/mockData';
import { Avatar, Button } from '../components/ui';
import { Bell, Users, CheckSquare, MessageSquare, FileText, Settings, Check } from 'lucide-react';
const typeConfig = {
    collaboration: { icon: <Users className="w-4 h-4"/>, color: 'bg-indigo-100 text-indigo-600' },
    task: { icon: <CheckSquare className="w-4 h-4"/>, color: 'bg-emerald-100 text-emerald-600' },
    message: { icon: <MessageSquare className="w-4 h-4"/>, color: 'bg-sky-100 text-sky-600' },
    problem: { icon: <FileText className="w-4 h-4"/>, color: 'bg-violet-100 text-violet-600' },
    system: { icon: <Settings className="w-4 h-4"/>, color: 'bg-slate-100 text-slate-600' },
};
export default function Notifications({ navigate }) {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState(initialNotifs);
    const [filter, setFilter] = useState('all');
    const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;
    const unreadCount = notifs.filter(n => !n.read).length;
    useEffect(() => {
        if (user) apiRequest(withUserId('/notifications', user.id)).then(setNotifs).catch(() => {});
    }, [user]);
    function markRead(id) {
        setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
        apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
    }
    function markAllRead() {
        setNotifs(ns => ns.map(n => ({ ...n, read: true })));
    }
    return (<div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5">
            {['all', 'unread'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
              </button>))}
          </div>
          {unreadCount > 0 && (<Button variant="ghost" size="sm" onClick={markAllRead} icon={<Check className="w-4 h-4"/>}>
              Mark all read
            </Button>)}
        </div>
      </div>

      {displayed.length === 0 ? (<div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Bell className="w-8 h-8"/>
          </div>
          <h3 className="font-semibold text-slate-700 font-display">No notifications</h3>
          <p className="text-sm text-slate-500 mt-1">You're all caught up! Check back later.</p>
        </div>) : (<div className="space-y-1">
          {displayed.map(notif => {
                const cfg = typeConfig[notif.type];
                return (<div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer hover:bg-white border ${notif.read ? 'border-transparent' : 'border-indigo-100 bg-indigo-50/30'}`} onClick={() => markRead(notif.id)}>
                {/* Icon or avatar */}
                {notif.avatar ? (<div className="relative shrink-0">
                    <Avatar student={notif.avatar} size="md"/>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${cfg.color} border-2 border-white`}>
                      <span className="w-3 h-3">{cfg.icon}</span>
                    </div>
                  </div>) : (<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                    <span className="w-5 h-5">{cfg.icon}</span>
                  </div>)}

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.read ? 'text-slate-700' : 'text-slate-900 font-medium'}`}>
                    {notif.title}
                  </p>
                  <p className={`text-sm mt-0.5 ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                    {notif.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5">{notif.timestamp}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!notif.read && (<div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"/>)}
                </div>
              </div>);
            })}
        </div>)}

      {/* Settings link */}
      <div className="mt-8 text-center">
        <button onClick={() => navigate('settings')} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto transition-colors">
          <Settings className="w-4 h-4"/>
          Notification preferences
        </button>
      </div>
    </div>);
}
