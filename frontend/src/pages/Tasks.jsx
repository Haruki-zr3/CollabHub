import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Badge, Button, PriorityBadge, ProgressBar, Tabs } from '../components/ui';
import { CheckCircle, Clock, Calendar, Plus, Filter, ArrowRight } from 'lucide-react';
import { apiRequest, withUserId } from '../api';
const statusConfig = {
    todo: { label: 'To Do', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    'in-progress': { label: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    review: { label: 'Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};
function TaskRow({ task, navigate }) {
    const cfg = statusConfig[task.status];
    const overdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
    return (<div className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-indigo-500'}`}>
        {task.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-white"/>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {task.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{task.description}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <PriorityBadge priority={task.priority}/>

        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>
          {cfg.label}
        </span>

        <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500' : 'text-slate-400'}`}>
          <Calendar className="w-3.5 h-3.5"/>
          {overdue ? 'Overdue · ' : ''}
          {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>

        <Avatar student={task.assignee} size="xs"/>

        <button onClick={() => navigate('workspace', { collaborationId: task.collaborationId })} className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
          View <ArrowRight className="w-3 h-3"/>
        </button>
      </div>
    </div>);
}
export default function Tasks({ navigate }) {
    const { user } = useAuth();
    const [tab, setTab] = useState('all');
    const [sort, setSort] = useState('dueDate');
    const [allTasks, setAllTasks] = useState([]);
    const [collaborationList, setCollaborationList] = useState([]);
    useEffect(() => {
        if (!user) return;
        Promise.all([
            apiRequest(withUserId('/tasks', user.id)),
            apiRequest(withUserId('/collaborations', user.id)),
        ]).then(([taskData, collabData]) => {
            setAllTasks(taskData);
            setCollaborationList(collabData);
        }).catch(() => {
            setAllTasks([]);
            setCollaborationList([]);
        });
    }, [user]);
    const grouped = {
        all: allTasks,
        todo: allTasks.filter(t => t.status === 'todo'),
        'in-progress': allTasks.filter(t => t.status === 'in-progress'),
        review: allTasks.filter(t => t.status === 'review'),
        completed: allTasks.filter(t => t.status === 'completed'),
    };
    const displayTasks = grouped[tab] || allTasks;
    const completedCount = grouped.completed.length;
    const totalCount = allTasks.length;
    const tabs = [
        { id: 'all', label: 'All Tasks', count: totalCount },
        { id: 'todo', label: 'To Do', count: grouped.todo.length },
        { id: 'in-progress', label: 'In Progress', count: grouped['in-progress'].length },
        { id: 'review', label: 'Review', count: grouped.review.length },
        { id: 'completed', label: 'Completed', count: completedCount },
    ];
    // Group by collaboration
    const byCollab = collaborationList.map(c => ({
        collab: c,
        tasks: displayTasks.filter(t => t.collaborationId === c.id),
    })).filter(g => g.tasks.length > 0);
    return (<div className="p-6 max-w-[1200px] mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: 'Total Tasks', value: totalCount, color: 'text-slate-900', bg: 'bg-slate-50' },
            { label: 'In Progress', value: grouped['in-progress'].length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Review', value: grouped.review.length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', value: completedCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (<div key={s.label} className={`rounded-xl border border-slate-200 p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color} font-display`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 font-display">Overall Completion</h3>
          <span className="text-sm font-bold text-slate-900">{completedCount}/{totalCount} tasks</span>
        </div>
        <ProgressBar value={completedCount} max={totalCount} size="md" showLabel/>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs tabs={tabs} activeTab={tab} onChange={setTab}/>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-8 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
          <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4"/>}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Task list grouped by collaboration */}
      {byCollab.length === 0 ? (<div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <CheckCircle className="w-7 h-7"/>
          </div>
          <p className="font-semibold text-slate-700 font-display">No tasks here</p>
          <p className="text-sm text-slate-500 mt-1">This section is empty.</p>
        </div>) : (byCollab.map(({ collab, tasks: collabTasks }) => (<div key={collab.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"/>
                <h4 className="font-semibold text-slate-800 text-sm">{collab.title}</h4>
                <span className="text-xs text-slate-400">{collabTasks.length} tasks</span>
              </div>
              <button onClick={() => navigate('workspace', { collaborationId: collab.id })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                Open workspace <ArrowRight className="w-3 h-3"/>
              </button>
            </div>
            <div>
              {collabTasks.map(task => (<TaskRow key={task.id} task={task} navigate={navigate}/>))}
            </div>
          </div>)))}
    </div>);
}
