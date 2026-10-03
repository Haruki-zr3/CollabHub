import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, DifficultyBadge, ProblemStatusBadge, SkillTag, EmptyState } from '../components/ui';
import { Plus, Eye, Users, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';
export default function MyProblems({ navigate }) {
    const { user } = useAuth();
    const [myProblems, setMyProblems] = useState([]);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        if (!user) return;
        apiRequest('/problems')
            .then(allProblems => setMyProblems(allProblems.filter(problem => String(problem.postedBy?.id) === String(user.id))))
            .catch(() => setMyProblems([]));
    }, [user]);
    const displayed = filter === 'all' ? myProblems : myProblems.filter(p => p.status === filter);
    return (<div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {['all', 'open', 'in-progress', 'solved'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
              {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>))}
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4"/>} onClick={() => navigate('post-problem')}>
          Post New Problem
        </Button>
      </div>

      <div className="space-y-4">
        {displayed.map(problem => {
            const daysLeft = Math.ceil((new Date(problem.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (<div key={problem.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <ProblemStatusBadge status={problem.status}/>
                    <DifficultyBadge difficulty={problem.difficulty}/>
                    <Badge variant="slate">{problem.type}</Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 font-display mb-1.5">{problem.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{problem.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {problem.skills.slice(0, 4).map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4"/>{problem.views} views</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/>{problem.collaboratorsJoined}/{problem.collaboratorsNeeded} collaborators</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </span>
                    <span>{problem.requests} offers to help</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => navigate('problem-details', { problemId: problem.id })}>
                    View
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Edit className="w-3.5 h-3.5"/>}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>);
        })}

        {displayed.length === 0 && (<div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Plus className="w-7 h-7"/>
            </div>
            <h3 className="font-semibold text-slate-700 font-display">No problems here</h3>
            <p className="text-sm text-slate-500 mt-1">Post your first problem to start finding collaborators.</p>
            <Button size="sm" className="mt-4" onClick={() => navigate('post-problem')}>Post a Problem</Button>
          </div>)}
      </div>
    </div>);
}
