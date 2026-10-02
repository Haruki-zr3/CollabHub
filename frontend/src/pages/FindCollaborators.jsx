import React, { useState } from 'react';
import { students } from '../data/mockData';
import { Avatar, Badge, Button, SearchInput, SkillTag, StatusDot } from '../components/ui';
import { Filter, Star, CheckCircle, MessageSquare, Link2, GitBranch as GithubIcon } from 'lucide-react';
const allBranches = ['All Branches', 'Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Data Science', 'Civil Engineering', 'Biotechnology'];
const allYears = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
const allAvail = ['All', 'Available', 'Busy'];
function StudentCard({ student, navigate }) {
    const [invited, setInvited] = useState(false);
    return (<div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all student-card">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar student={student} size="lg"/>
          <StatusDot status={student.availability} className="absolute -bottom-0.5 -right-0.5"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 font-display leading-tight">{student.name}</h3>
              <p className="text-sm text-slate-500">{student.branch}</p>
              <p className="text-xs text-slate-400 mt-0.5">Year {student.year} · {student.location}</p>
            </div>
            {student.compatibility && (<div className="shrink-0 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 flex items-center justify-center bg-indigo-50">
                  <span className="text-sm font-bold text-indigo-700">{student.compatibility}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">match</p>
              </div>)}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">{student.bio}</p>

      {/* Skills */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {student.skills.slice(0, 5).map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
          {student.skills.length > 5 && (<span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">+{student.skills.length - 5}</span>)}
        </div>
      </div>

      {/* Interests */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {student.interests.slice(0, 3).map(interest => (<Badge key={interest} variant="slate">{interest}</Badge>))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 mb-4">
        {[
            { label: 'Contributions', value: student.contributions },
            { label: 'Solved', value: student.problemsSolved },
            { label: 'Collabs', value: student.collaborations },
        ].map(s => (<div key={s.label} className="text-center">
            <p className="font-bold text-slate-900 text-base font-display">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>))}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2 mb-4">
        <StatusDot status={student.availability} showLabel/>
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-500">CGPA {student.cgpa.toFixed(1)}</span>
        {student.github && (<>
            <span className="text-xs text-slate-400 ml-auto">·</span>
            <a href="#" className="text-slate-400 hover:text-slate-700 transition-colors"><GithubIcon className="w-3.5 h-3.5"/></a>
          </>)}
        {student.linkedin && (<a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Link2 className="w-3.5 h-3.5"/></a>)}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" icon={<MessageSquare className="w-4 h-4"/>} onClick={() => navigate('messages')}>
          Message
        </Button>
        {invited ? (<Button size="sm" className="flex-1" variant="secondary" icon={<CheckCircle className="w-4 h-4"/>}>
            Offer Sent
          </Button>) : (<Button size="sm" className="flex-1" onClick={() => setInvited(true)}>
            Ask to Help Together
          </Button>)}
      </div>
    </div>);
}
export default function FindCollaborators({ navigate }) {
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('All Branches');
    const [year, setYear] = useState('All Years');
    const [avail, setAvail] = useState('All');
    const [sort, setSort] = useState('compatibility');
    const filtered = students.filter(s => {
        if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase())))
            return false;
        if (branch !== 'All Branches' && !s.branch.includes(branch.split(' ')[0]))
            return false;
        if (year !== 'All Years' && !year.toLowerCase().includes(String(s.year)))
            return false;
        if (avail !== 'All' && s.availability !== avail.toLowerCase())
            return false;
        return true;
    });
    return (<div className="p-6 max-w-[1400px] mx-auto">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or skill…" className="flex-1"/>
          <select value={branch} onChange={e => setBranch(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {allBranches.map(b => <option key={b}>{b}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {allYears.map(y => <option key={y}>{y}</option>)}
          </select>
          <select value={avail} onChange={e => setAvail(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            {allAvail.map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            <option value="compatibility">Best Match</option>
            <option value="contributions">Most Active</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-5">{filtered.length} students found</p>

      {filtered.length === 0 ? (<div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Filter className="w-7 h-7"/>
          </div>
          <h3 className="font-semibold text-slate-700 font-display">No students match your filters</h3>
          <p className="text-sm text-slate-500 mt-1">Try broadening your search criteria.</p>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(s => (<StudentCard key={s.id} student={s} navigate={navigate}/>))}
        </div>)}
    </div>);
}
