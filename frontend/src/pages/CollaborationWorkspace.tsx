import React, { useState } from 'react';
import type { Navigate, NavContext, Task } from '../types';
import { useAuth, authUserToStudent } from '../context/AuthContext';
import { collaborations } from '../data/mockData';
import { Avatar, AvatarGroup, Badge, Button, Card, ProgressBar, PriorityBadge, UnderlineTabs } from '../components/ui';
import { ArrowLeft, Plus, Calendar, CheckCircle, MessageSquare, FileText, Activity, Settings, MoreHorizontal, GripVertical } from 'lucide-react';

type KanbanStatus = 'todo' | 'in-progress' | 'review' | 'completed';

const columns: { id: KanbanStatus; label: string; color: string; bg: string; count?: number }[] = [
  { id: 'todo', label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-100' },
  { id: 'in-progress', label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  { id: 'review', label: 'Review', color: 'text-amber-700', bg: 'bg-amber-100' },
  { id: 'completed', label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-100' },
];

function KanbanCard({ task, onMove }: { task: Task; onMove: (id: string, status: KanbanStatus) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statuses: KanbanStatus[] = ['todo', 'in-progress', 'review', 'completed'];
  const currentIdx = statuses.indexOf(task.status as KanbanStatus);

  return (
    <div className="kanban-card bg-white rounded-xl border border-slate-200 p-3.5 mb-2.5 last:mb-0">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-900 leading-snug flex-1">{task.title}</h4>
        <div className="relative">
          <button onClick={() => setMenuOpen(o => !o)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 bg-white rounded-lg border border-slate-200 shadow-md min-w-[140px] py-1 text-sm">
              {currentIdx > 0 && (
                <button onClick={() => { onMove(task.id, statuses[currentIdx - 1]); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700">
                  ← Move back
                </button>
              )}
              {currentIdx < statuses.length - 1 && (
                <button onClick={() => { onMove(task.id, statuses[currentIdx + 1]); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700">
                  → Move forward
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center gap-1.5 mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar student={task.assignee} size="xs" />
          <span className="text-xs text-slate-500">{task.assignee.name.split(' ')[0]}</span>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}

export default function CollaborationWorkspace({ navigate, context }: { navigate: Navigate; context: NavContext }) {
  const { user } = useAuth();
  const authStudent = user ? authUserToStudent(user) : null;
  const collab = collaborations.find(c => c.id === context.collaborationId) || collaborations[0];
  const [tab, setTab] = useState('tasks');
  const [tasks, setTasks] = useState(collab.tasks);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: "I've pushed the preprocessing notebook to the shared drive. Can everyone review before Thursday?", from: collab.members[0], fromSelf: false, time: '10:22 AM' },
    { id: '2', text: 'Looks good! I noticed some class imbalance in the dataset — should we address this before training?', from: collab.members[2] || collab.members[0], fromSelf: false, time: '10:45 AM' },
    { id: '3', text: "Good catch. Let's use a weighted loss function. I'll update the training script by EOD.", from: null, fromSelf: true, time: '11:02 AM' },
    { id: '4', text: 'Works for me. Also — the literature review draft is ready for review in the tasks board.', from: collab.members[1] || collab.members[0], fromSelf: false, time: '11:15 AM' },
  ]);

  function moveTask(taskId: string, newStatus: KanbanStatus) {
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  function sendMessage() {
    if (!message.trim()) return;
    setMessages(ms => [...ms, { id: String(ms.length + 1), text: message, from: null, fromSelf: true, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  }

  const workspaceTabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckCircle className="w-4 h-4" />, count: tasks.length },
    { id: 'discussion', label: 'Discussion', icon: <MessageSquare className="w-4 h-4" />, count: messages.length },
    { id: 'files', label: 'Files', icon: <FileText className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  ];

  const completedByMember = collab.members.map(m => ({
    member: m,
    completed: tasks.filter(t => t.assignee.id === m.id && t.status === 'completed').length,
    total: tasks.filter(t => t.assignee.id === m.id).length,
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Workspace header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <button onClick={() => navigate('my-collaborations')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-3 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Collaborations
        </button>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900 font-display">{collab.title}</h1>
              <Badge variant={collab.status === 'active' ? 'green' : 'amber'} dot>
                {collab.status === 'active' ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{collab.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm text-slate-500">Progress</span>
                <span className="text-sm font-bold text-slate-900">{collab.progress}%</span>
              </div>
              <ProgressBar value={collab.progress} className="w-48" size="md" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <AvatarGroup students={collab.members} max={5} />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due {new Date(collab.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4" />}>
              Add Task
            </Button>
          </div>
        </div>

        <UnderlineTabs tabs={workspaceTabs} activeTab={tab} onChange={setTab} className="mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {tab === 'overview' && (
          <div className="p-6 max-w-5xl mx-auto space-y-5 fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="lg:col-span-2">
                <h3 className="font-semibold text-slate-900 font-display mb-3">Project Overview</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{collab.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  {[
                    { label: 'Start Date', value: new Date(collab.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Deadline', value: new Date(collab.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Team Size', value: `${collab.members.length} members` },
                    { label: 'Open Tasks', value: tasks.filter(t => t.status !== 'completed').length },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
                      <p className="font-semibold text-slate-900 text-sm">{s.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-slate-900 font-display mb-4">Team Members</h3>
                <div className="space-y-3">
                  {collab.members.map(m => (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <Avatar student={m} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.id === collab.lead.id ? 'Lead' : 'Member'}</p>
                      </div>
                      {m.id === collab.lead.id && <Badge variant="indigo">Lead</Badge>}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Contribution tracking */}
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-4">Contribution Tracking</h3>
              <div className="space-y-4">
                {completedByMember.map(({ member, completed, total }) => {
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar student={member} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-800">{member.name}</span>
                          <span className="text-xs text-slate-500">{completed}/{total} tasks · {pct}%</span>
                        </div>
                        <ProgressBar value={pct} size="sm" color={pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-indigo-500' : 'bg-amber-500'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="p-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${col.bg} ${col.color}`}>
                          {colTasks.length}
                        </span>
                      </div>
                      <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors hover:bg-slate-100 rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="min-h-[200px]">
                      {colTasks.map(task => (
                        <KanbanCard key={task.id} task={task} onMove={moveTask} />
                      ))}
                      {colTasks.length === 0 && (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                          <p className="text-xs text-slate-400">No tasks here</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'discussion' && (
          <div className="p-6 max-w-3xl mx-auto fade-in">
            <div style={{ height: 'calc(100vh - 260px)' }}>
              <Card padding={false} className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map(msg => {
                  const isMe = msg.fromSelf === true;
                  const msgStudent = isMe ? authStudent : msg.from;
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {msgStudent && <Avatar student={msgStudent} size="sm" />}
                      <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          {!isMe && msgStudent && <span className="text-xs font-semibold text-slate-700">{msgStudent.name.split(' ')[0]}</span>}
                          <span className="text-xs text-slate-400">{msg.time}</span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 p-4">
                <div className="flex gap-3">
                  {authStudent && <Avatar student={authStudent} size="sm" />}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                      placeholder="Type a message…"
                      className="flex-1 h-9 rounded-lg border border-slate-300 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <Button size="sm" onClick={sendMessage}>Send</Button>
                  </div>
                </div>
              </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'files' && (
          <div className="p-6 max-w-3xl mx-auto fade-in">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 font-display">Project Files</h3>
                <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4" />}>Upload File</Button>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'PlantVillage_Preprocessing.ipynb', type: 'Jupyter Notebook', size: '2.4 MB', by: collab.members[0], date: '2 hours ago' },
                  { name: 'CropScan_Architecture.pdf', type: 'PDF', size: '1.1 MB', by: collab.members[2] || collab.members[0], date: 'Yesterday' },
                  { name: 'Literature_Review_Draft.docx', type: 'Word Document', size: '850 KB', by: collab.members[1] || collab.members[0], date: '2 days ago' },
                  { name: 'Dataset_Analysis_Report.xlsx', type: 'Excel', size: '320 KB', by: collab.members[0], date: '3 days ago' },
                  { name: 'Project_Proposal.pdf', type: 'PDF', size: '1.8 MB', by: collab.members[0], date: '1 week ago' },
                ].map((file, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.type} · {file.size} · {file.by.name.split(' ')[0]} · {file.date}</p>
                    </div>
                    <button className="text-sm text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Download</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'activity' && (
          <div className="p-6 max-w-3xl mx-auto fade-in">
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {collab.recentActivity.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Avatar student={item.student} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">{item.student.name}</span>{' '}
                        <span className="text-slate-500">{item.action}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.timestamp}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${item.type === 'task' ? 'bg-emerald-500' : item.type === 'file' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
