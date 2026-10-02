import React, { useEffect, useState } from 'react';
import { problems } from '../data/mockData';
import { Avatar, Badge, Button, DifficultyBadge, ProblemStatusBadge, SearchInput, SkillTag } from '../components/ui';
import { Filter, SlidersHorizontal, ArrowUpDown, Users, Clock, Eye, Calendar, BookOpen, Zap } from 'lucide-react';
import { apiRequest } from '../api';
const branches = ['All Branches', 'Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Data Science', 'Biotechnology', 'Chemistry'];
const types = ['All Types', 'academic', 'technical', 'project', 'research'];
const statuses = ['All Status', 'open', 'in-progress', 'solved'];
const difficulties = ['All Levels', 'beginner', 'intermediate', 'advanced'];
const typeIcons = {
    academic: <BookOpen className="w-3.5 h-3.5"/>,
    technical: <Zap className="w-3.5 h-3.5"/>,
    project: <Zap className="w-3.5 h-3.5"/>,
    research: <BookOpen className="w-3.5 h-3.5"/>,
};
const typeColors = {
    academic: 'bg-sky-50 text-sky-600',
    technical: 'bg-violet-50 text-violet-600',
    project: 'bg-indigo-50 text-indigo-600',
    research: 'bg-teal-50 text-teal-600',
};
function ProblemCard({ problem, navigate }) {
    const daysUntilDeadline = Math.ceil((new Date(problem.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (<div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all problem-card">
      <div className="flex items-start gap-3 mb-3">
        <Avatar student={problem.postedBy} size="sm"/>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-slate-900 font-display leading-snug text-sm">{problem.postedBy.name}</h3>
            <ProblemStatusBadge status={problem.status}/>
          </div>
          <p className="text-xs text-slate-400">{problem.branch} · {problem.postedAt}</p>
        </div>
      </div>

      <h2 className="font-bold text-slate-900 font-display mb-2 leading-snug">{problem.title}</h2>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">{problem.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <DifficultyBadge difficulty={problem.difficulty}/>
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[problem.type]}`}>
          {typeIcons[problem.type]}
          {problem.type.charAt(0).toUpperCase() + problem.type.slice(1)}
        </span>
        {problem.tags.map(tag => (<Badge key={tag} variant="slate">{tag}</Badge>))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-4">
        {problem.skills.map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5"/>
          {problem.collaboratorsJoined}/{problem.collaboratorsNeeded} collaborators
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5"/>
          {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5"/>
          {problem.views} views
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5"/>
          {problem.requests} offers to help
        </span>
      </div>

      {/* Collaborator progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Already helping</span>
          <span>{problem.collaboratorsJoined} of {problem.collaboratorsNeeded}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(problem.collaboratorsJoined / problem.collaboratorsNeeded) * 100}%` }}/>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('problem-details', { problemId: problem.id })}>
          View Details
        </Button>
        {problem.status === 'open' && problem.collaboratorsJoined < problem.collaboratorsNeeded && (<Button size="sm" className="flex-1" onClick={() => navigate('problem-details', { problemId: problem.id })}>
            I Can Help
          </Button>)}
      </div>
    </div>);
}
export default function DiscoverProblems({ navigate }) {
    const [problemList, setProblemList] = useState(problems);
    const [loadError, setLoadError] = useState('');
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('All Branches');
    const [type, setType] = useState('All Types');
    const [status, setStatus] = useState('All Status');
    const [difficulty, setDifficulty] = useState('All Levels');
    const [sort, setSort] = useState('recent');
    const [showFilters, setShowFilters] = useState(false);
    useEffect(() => {
        apiRequest('/problems').then(setProblemList).catch(err => setLoadError(err.message));
    }, []);
    const filtered = problemList.filter(p => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
            return false;
        if (branch !== 'All Branches' && !p.branch.includes(branch.split(' ')[0]))
            return false;
        if (type !== 'All Types' && p.type !== type)
            return false;
        if (status !== 'All Status' && p.status !== status)
            return false;
        if (difficulty !== 'All Levels' && p.difficulty !== difficulty)
            return false;
        return true;
    });
    return (<div className="p-6 max-w-[1400px] mx-auto">
    {loadError && <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">{loadError} Showing demo data.</p>}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">{filtered.length} problems found</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="deadline">Deadline Soon</option>
            <option value="requests">Most Offers to Help</option>
          </select>
          <Button variant="outline" size="sm" icon={<SlidersHorizontal className="w-4 h-4"/>} onClick={() => setShowFilters(f => !f)}>
            Filters {showFilters ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchInput value={search} onChange={setSearch} placeholder="Search by title, skill, or keyword…" className="mb-4"/>

      {/* Filters */}
      {showFilters && (<div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Branch</label>
              <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full h-8 px-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                {branches.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full h-8 px-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                {types.map(t => <option key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-8 px-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                {statuses.map(s => <option key={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full h-8 px-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                {difficulties.map(d => <option key={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={() => { setBranch('All Branches'); setType('All Types'); setStatus('All Status'); setDifficulty('All Levels'); }} className="text-sm text-slate-500 hover:text-slate-700">Clear all filters</button>
          </div>
        </div>)}

      {/* Active filter tags */}
      {[branch, type, status, difficulty].filter(f => !f.startsWith('All')).length > 0 && (<div className="flex flex-wrap gap-2 mb-4">
          {[branch, type, status, difficulty].filter(f => !f.startsWith('All')).map(f => (<span key={f} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {f}
              <button onClick={() => {
                    if (branches.includes(f))
                        setBranch('All Branches');
                    if (types.includes(f))
                        setType('All Types');
                    if (statuses.includes(f))
                        setStatus('All Status');
                    if (difficulties.includes(f))
                        setDifficulty('All Levels');
                }} className="hover:text-indigo-900">×</button>
            </span>))}
        </div>)}

      {/* Problem grid */}
      {filtered.length === 0 ? (<div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Filter className="w-7 h-7"/>
          </div>
          <h3 className="font-semibold text-slate-700 font-display">No problems match your filters</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or removing some filters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(''); setBranch('All Branches'); setType('All Types'); setStatus('All Status'); setDifficulty('All Levels'); }}>
            Clear all filters
          </Button>
        </div>) : (<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => (<ProblemCard key={p.id} problem={p} navigate={navigate}/>))}
        </div>)}
    </div>);
}
