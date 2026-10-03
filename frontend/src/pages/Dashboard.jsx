import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { problems, students, collaborations } from '../data/mockData';
import { Avatar, AvatarGroup, Badge, Button, Card, ProgressBar, ProblemStatusBadge, SkillTag, StatCard, SearchInput } from '../components/ui';
import { Users, FileText, CheckCircle, Zap, Clock, ArrowRight, Bell, MessageSquare, Plus, Calendar } from 'lucide-react';
import { apiRequest, withUserId } from '../api';
const recentActivity = collaborations[0].recentActivity;
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12)
        return 'Good morning';
    if (h < 17)
        return 'Good afternoon';
    return 'Good evening';
}
export default function Dashboard({ navigate }) {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [problemList, setProblemList] = useState([]);
    const [myProblems, setMyProblems] = useState([]);
    const [activeCollaborations, setActiveCollaborations] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    useEffect(() => {
        if (!user) return;
        Promise.all([
            apiRequest('/problems'),
            apiRequest(withUserId('/collaborations', user.id)),
            apiRequest(withUserId('/tasks', user.id)),
        ]).then(([allProblems, collaborationsForUser, tasksForUser]) => {
            setProblemList(allProblems);
            setMyProblems(allProblems.filter(problem => String(problem.postedBy?.id) === String(user.id)));
            setActiveCollaborations(collaborationsForUser.filter(collaboration => collaboration.status === 'active'));
            setUpcomingTasks(tasksForUser.filter(task => task.status !== 'completed').slice(0, 4));
        }).catch(() => {
            setProblemList([]);
            setMyProblems([]);
            setActiveCollaborations([]);
            setUpcomingTasks([]);
        });
    }, [user]);
    const firstName = user?.name.split(' ')[0] ?? 'there';
    const recommendedProblems = problemList.filter(p => p.status === 'open').slice(0, 3);
    const recommendedStudents = students.filter(s => s.compatibility).slice(0, 3);
    const priorityDotColor = {
        low: '#94A3B8',
        medium: '#0EA5E9',
        high: '#F59E0B',
        critical: '#EF4444',
    };
    const taskStatusColors = {
        todo: 'text-slate-600',
        'in-progress': 'text-indigo-600',
        review: 'text-amber-600',
        completed: 'text-emerald-600',
    };
    return (<div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            {getGreeting()}, {firstName} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search problems, people…" className="w-64"/>
          <Button size="sm" onClick={() => navigate('post-problem')} icon={<Plus className="w-4 h-4"/>}>
            Post Problem
          </Button>
        </div>
      </div>

      {/* Stats — real user data, start at 0 for new students */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Collaborations" value={activeCollaborations.length} icon={<Users className="w-4 h-4"/>} iconColor="bg-indigo-500"/>
        <StatCard label="Problems Posted" value={myProblems.length} icon={<FileText className="w-4 h-4"/>} iconColor="bg-violet-500"/>
        <StatCard label="Problems Solved" value={user?.problemsSolved ?? 0} icon={<CheckCircle className="w-4 h-4"/>} iconColor="bg-emerald-500"/>
        <StatCard label="Total Contributions" value={user?.contributions ?? 0} icon={<Zap className="w-4 h-4"/>} iconColor="bg-amber-500"/>
      </div>

      {/* Active collaborations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 font-display">Active Collaborations</h3>
          <button onClick={() => navigate('my-collaborations')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3.5 h-3.5"/>
          </button>
        </div>
        {activeCollaborations.length === 0 ? (<div className="bg-white rounded-xl border border-slate-200 border-dashed p-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-indigo-400"/>
            </div>
            <p className="font-medium text-slate-700 mb-1">No active collaborations yet</p>
            <p className="text-sm text-slate-400 mb-4">Browse problems and offer to help to start collaborating</p>
            <Button size="sm" variant="outline" onClick={() => navigate('discover')}>
              Discover Problems
            </Button>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeCollaborations.map(collab => (<Card key={collab.id} hover padding onClick={() => navigate('problem-details', { problemId: collab.problem.id })} className="problem-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 font-display leading-snug mb-1">{collab.problem.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{collab.problem.description}</p>
                  </div>
                  <Badge variant={collab.status === 'active' ? 'green' : 'slate'} dot className="ml-3 shrink-0">
                    {collab.status === 'active' ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-medium text-slate-700">{collab.progress}%</span>
                  </div>
                  <ProgressBar value={collab.progress} size="md"/>
                </div>
                <div className="flex items-center justify-between">
                  <AvatarGroup students={collab.members || []} max={3} size="sm"/>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5"/>
                    {new Date(collab.problem.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </Card>))}
          </div>)}
      </div>

      {/* Middle grid: recommended problems + collaborators */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recommended problems */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 font-display">Recommended Problems</h3>
            <button onClick={() => navigate('discover')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              Browse all <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>
          <div className="space-y-3">
            {recommendedProblems.map(problem => (<Card key={problem.id} hover padding onClick={() => navigate('problem-details', { problemId: problem.id })} className="problem-card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-indigo-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">{problem.title}</h4>
                      <ProblemStatusBadge status={problem.status}/>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{problem.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {problem.skills.slice(0, 3).map((s, j) => <SkillTag key={s} skill={s} index={j}/>)}
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 ml-2">
                        <Users className="w-3 h-3"/>
                        {problem.collaboratorsJoined}/{problem.collaboratorsNeeded}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>))}
          </div>
        </div>

        {/* Recommended collaborators */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 font-display">Recommended Collaborators</h3>
            <button onClick={() => navigate('find-collaborators')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              Find more <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>
          <div className="space-y-3">
            {recommendedStudents.map(student => (<Card key={student.id} hover padding onClick={() => navigate('profile', { studentId: student.id })} className="student-card">
                <div className="flex items-center gap-3">
                  <Avatar student={student} size="md"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-xs font-bold text-emerald-600">{student.compatibility}% match</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1.5">{student.branch} · Year {student.year}</p>
                    <div className="flex gap-1 flex-wrap">
                      {student.skills.slice(0, 3).map((s, j) => <SkillTag key={s} skill={s} index={j}/>)}
                    </div>
                  </div>
                </div>
              </Card>))}
          </div>
        </div>
      </div>

      {/* Bottom grid: upcoming tasks + recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 font-display">Upcoming Tasks</h3>
            <button onClick={() => navigate('tasks')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>
          {(user?.tasksCompleted ?? 0) === 0 && upcomingTasks.length > 0 ? (<div className="bg-white rounded-xl border border-slate-200 border-dashed p-8 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-slate-300"/>
              </div>
              <p className="font-medium text-slate-600 mb-1 text-sm">No tasks assigned yet</p>
              <p className="text-xs text-slate-400">Join a collaboration to get tasks</p>
            </div>) : (<Card padding={false} className="overflow-hidden">
              {upcomingTasks.map((task, i) => (<div key={task.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-100' : ''} hover:bg-slate-50 transition-colors`}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priorityDotColor[task.priority] }}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium capitalize ${taskStatusColors[task.status]}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <Avatar student={task.assignee} size="xs"/>
                  </div>
                </div>))}
            </Card>)}
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 font-display">Recent Activity</h3>
          </div>
          <Card padding={false} className="overflow-hidden">
            {recentActivity.map((item, i) => (<div key={item.id} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                <Avatar student={item.student} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{item.student.name}</span>{' '}
                    <span className="text-slate-500">{item.action}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.timestamp}</p>
                </div>
                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  {item.type === 'task' ? <CheckCircle className="w-3.5 h-3.5 text-slate-500"/> :
                item.type === 'file' ? <FileText className="w-3.5 h-3.5 text-slate-500"/> :
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500"/>}
                </div>
              </div>))}
            <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-red-500"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">3 new notifications</p>
                <p className="text-xs text-slate-500">Help offers and task updates</p>
              </div>
              <button onClick={() => navigate('notifications')} className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                View
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>);
}
