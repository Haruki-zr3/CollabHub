import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collaborations } from '../data/mockData';
import { Avatar, AvatarGroup, Badge, Button, Card, ProgressBar, Tabs } from '../components/ui';
import { Calendar, CheckSquare, Users, ArrowRight, Plus, Zap, Clock } from 'lucide-react';
const tabs = [
    { id: 'active', label: 'Active', count: collaborations.filter(c => c.status === 'active').length },
    { id: 'completed', label: 'Completed', count: 3 },
    { id: 'paused', label: 'Paused', count: 0 },
];
const completed = [
    { id: 'cc1', title: 'Campus Lost & Found Web App', description: 'A full-stack web app for reporting and finding lost items on campus.', branch: 'CS', members: 3, completedDate: 'Oct 2024', contributions: 12, role: 'Lead Developer' },
    { id: 'cc2', title: 'NLP Sentiment Analysis on Student Reviews', description: 'Analyzed 5,000+ student course reviews using BERT for sentiment classification.', branch: 'CS × Data Science', members: 2, completedDate: 'Aug 2024', contributions: 9, role: 'ML Engineer' },
    { id: 'cc3', title: 'Smart Attendance System with Face Recognition', description: 'Raspberry Pi-based attendance system using face recognition for classroom automation.', branch: 'CS × ECE', members: 4, completedDate: 'Jun 2024', contributions: 15, role: 'Backend Engineer' },
];
export default function MyCollaborations({ navigate }) {
    const { user } = useAuth();
    const [tab, setTab] = useState('active');
    return (<div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{collaborations.length} active, 3 completed</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4"/>} onClick={() => navigate('discover')}>
          Find a Problem
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: 'Active Collaborations', value: 2, icon: <Users className="w-4 h-4"/>, color: 'bg-indigo-500' },
            { label: 'Tasks Completed', value: 36, icon: <CheckSquare className="w-4 h-4"/>, color: 'bg-emerald-500' },
            { label: 'Total Contributions', value: user?.contributions ?? 0, icon: <Zap className="w-4 h-4"/>, color: 'bg-amber-500' },
            { label: 'Hours Contributed', value: '128h', icon: <Clock className="w-4 h-4"/>, color: 'bg-violet-500' },
        ].map(s => (<Card key={s.label} className="flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
              <span className="text-white w-4 h-4">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 font-display">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </Card>))}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} className="w-fit"/>

      {/* Active collaborations */}
      {tab === 'active' && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {collaborations.map(collab => {
                const todoCount = collab.tasks.filter(t => t.status === 'todo').length;
                const inProgressCount = collab.tasks.filter(t => t.status === 'in-progress').length;
                const completedCount = collab.tasks.filter(t => t.status === 'completed').length;
                return (<Card key={collab.id} className="hover:shadow-md hover:border-slate-300 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={collab.status === 'active' ? 'green' : 'amber'} dot>
                        {collab.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                      {collab.lead.id === '__me__' && (<Badge variant="indigo">Lead</Badge>)}
                    </div>
                    <h3 className="font-bold text-slate-900 font-display text-lg leading-snug">{collab.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{collab.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">Overall Progress</span>
                    <span className="font-bold text-slate-900">{collab.progress}%</span>
                  </div>
                  <ProgressBar value={collab.progress} size="md"/>
                </div>

                {/* Task breakdown */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                        { label: 'Todo', count: todoCount, color: 'bg-slate-100 text-slate-700' },
                        { label: 'In Progress', count: inProgressCount, color: 'bg-indigo-50 text-indigo-700' },
                        { label: 'Review', count: collab.tasks.filter(t => t.status === 'review').length, color: 'bg-amber-50 text-amber-700' },
                        { label: 'Done', count: completedCount, color: 'bg-emerald-50 text-emerald-700' },
                    ].map(s => (<div key={s.label} className={`rounded-lg p-2 text-center ${s.color}`}>
                      <p className="font-bold text-lg leading-tight font-display">{s.count}</p>
                      <p className="text-[10px] font-medium">{s.label}</p>
                    </div>))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <AvatarGroup students={collab.members} max={4} size="sm"/>
                    <span className="text-xs text-slate-500">{collab.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5"/>
                      {new Date(collab.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <Button size="xs" onClick={() => navigate('workspace', { collaborationId: collab.id })} iconRight={<ArrowRight className="w-3 h-3"/>}>
                      Open
                    </Button>
                  </div>
                </div>
              </Card>);
            })}
        </div>)}

      {tab === 'completed' && (<div className="space-y-4">
          {completed.map(c => (<Card key={c.id} className="hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="slate" dot>Completed</Badge>
                    <Badge variant="slate">{c.role}</Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 font-display mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-500">{c.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-emerald-600">{c.contributions} contributions</p>
                  <p className="text-xs text-slate-400 mt-0.5">Completed {c.completedDate}</p>
                  <p className="text-xs text-slate-400">{c.members} members · {c.branch}</p>
                </div>
              </div>
            </Card>))}
        </div>)}

      {tab === 'paused' && (<div className="text-center py-20 text-slate-500">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users className="w-7 h-7"/>
          </div>
          <p className="font-medium text-slate-700">No paused collaborations</p>
          <p className="text-sm mt-1">All your collaborations are active.</p>
        </div>)}
    </div>);
}
