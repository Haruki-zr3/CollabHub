import React, { useState } from 'react';
import { useAuth, authUserToStudent } from '../context/AuthContext';
import { students, problems } from '../data/mockData';
import { Avatar, Badge, Button, Card, ProgressBar, SkillTag, StatusDot, UnderlineTabs } from '../components/ui';
import { ArrowLeft, MessageSquare, UserPlus, Link2, GitBranch as GithubIcon, Mail, MapPin, GraduationCap, Star, Award, CheckCircle, Zap, Edit } from 'lucide-react';
export default function StudentProfile({ navigate, context }) {
    const { user } = useAuth();
    const authStudent = user ? authUserToStudent(user) : null;
    const isSelf = !context.studentId;
    const student = isSelf
        ? authStudent
        : (students.find(s => s.id === context.studentId) ?? students[0]);
    const [tab, setTab] = useState('about');
    const [following, setFollowing] = useState(false);
    if (!student) {
        return (<div className="p-6 text-center text-slate-500">
        <p>Please sign in to view your profile.</p>
        <Button className="mt-4" onClick={() => navigate('login')}>Sign in</Button>
      </div>);
    }
    const userProblems = problems.filter(p => p.postedBy.id === student.id);
    const tabs = [
        { id: 'about', label: 'About' },
        { id: 'problems', label: 'Problems', count: userProblems.length },
        { id: 'skills', label: 'Skills & Interests' },
        { id: 'contributions', label: 'Contributions' },
    ];
    const hasSkills = student.skills.length > 0;
    const hasInterests = student.interests.length > 0;
    const hasBio = student.bio && student.bio.trim().length > 0;
    const hasGithub = !!student.github;
    const hasLinkedin = !!student.linkedin;
    const cgpaDisplay = student.cgpa && student.cgpa > 0 ? student.cgpa.toFixed(1) : isSelf ? '—' : student.cgpa.toFixed(1);
    return (<div className="p-6 max-w-5xl mx-auto">
      {!isSelf && (<button onClick={() => navigate(context.returnPage || 'find-collaborators')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
          Back
        </button>)}

      {/* Profile header */}
      <Card padding className="mb-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            <Avatar student={student} size="xl"/>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-white">
              <StatusDot status={student.availability}/>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4"/>
                    {student.branch} · Year {student.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4"/>
                    Shri Mata Vaishno Devi University
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4"/>
                    {student.email}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {isSelf ? (<Button variant="outline" size="sm" icon={<Edit className="w-4 h-4"/>} onClick={() => navigate('settings')}>
                    Edit Profile
                  </Button>) : (<>
                    <Button variant="outline" size="sm" icon={<MessageSquare className="w-4 h-4"/>} onClick={() => navigate('messages')}>
                      Message
                    </Button>
                    <Button size="sm" icon={following ? <CheckCircle className="w-4 h-4"/> : <UserPlus className="w-4 h-4"/>} onClick={() => setFollowing(f => !f)}>
                      {following ? 'Following' : 'Follow'}
                    </Button>
                  </>)}
              </div>
            </div>

            {hasBio ? (<p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">{student.bio}</p>) : isSelf ? (<button onClick={() => navigate('settings')} className="mt-3 text-sm text-slate-400 italic hover:text-indigo-600 transition-colors">
                + Add your bio
              </button>) : null}

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500"/>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight font-display">{student.contributions}</p>
                  <p className="text-xs text-slate-500">Contributions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500"/>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight font-display">{student.problemsSolved}</p>
                  <p className="text-xs text-slate-500">Problems Solved</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-500"/>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight font-display">{student.collaborations}</p>
                  <p className="text-xs text-slate-500">Collaborations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-500"/>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight font-display">{cgpaDisplay}</p>
                  <p className="text-xs text-slate-500">CGPA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social links */}
        {(hasGithub || hasLinkedin) && (<div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            {hasGithub && (<a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                <GithubIcon className="w-4 h-4"/> github.com/{student.github}
              </a>)}
            {hasLinkedin && (<a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                <Link2 className="w-4 h-4"/> {student.linkedin}
              </a>)}
          </div>)}
        {isSelf && !hasGithub && !hasLinkedin && (<div className="mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => navigate('settings')} className="text-sm text-slate-400 italic hover:text-indigo-600 transition-colors">
              + Add GitHub or LinkedIn profile
            </button>
          </div>)}
      </Card>

      {/* Tabs */}
      <UnderlineTabs tabs={tabs} activeTab={tab} onChange={setTab} className="mb-5"/>

      {tab === 'about' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 fade-in">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-3">About</h3>
              {hasBio ? (<p className="text-sm text-slate-700 leading-relaxed">{student.bio}</p>) : (<p className="text-sm text-slate-400 italic">
                  {isSelf ? 'No bio yet. Edit your profile to add one.' : 'No bio provided.'}
                </p>)}
            </Card>
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-3">Collaboration Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Availability</span>
                  <StatusDot status={student.availability} showLabel/>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Preferred collaboration type</span>
                  <span className="text-slate-800">Research & Projects</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Open to mentoring</span>
                  <span className="text-slate-800">Yes</span>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-3">Top Skills</h3>
              {hasSkills ? (<div className="flex flex-wrap gap-2">
                  {student.skills.map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
                </div>) : (<p className="text-sm text-slate-400 italic">
                  {isSelf ? (<button onClick={() => navigate('settings')} className="hover:text-indigo-600 transition-colors">
                      + Add skills to your profile
                    </button>) : 'No skills listed.'}
                </p>)}
            </Card>
            <Card>
              <h3 className="font-semibold text-slate-900 font-display mb-3">Interests</h3>
              {hasInterests ? (<div className="flex flex-wrap gap-2">
                  {student.interests.map(i => <Badge key={i} variant="violet">{i}</Badge>)}
                </div>) : (<p className="text-sm text-slate-400 italic">
                  {isSelf ? (<button onClick={() => navigate('settings')} className="hover:text-indigo-600 transition-colors">
                      + Add interests to your profile
                    </button>) : 'No interests listed.'}
                </p>)}
            </Card>
          </div>
        </div>)}

      {tab === 'problems' && (<div className="space-y-4 fade-in">
          {userProblems.length === 0 ? (<div className="text-center py-16 text-slate-500">
              <p className="text-slate-400 italic">
                {isSelf ? 'You have not posted any problems yet.' : 'No problems posted yet.'}
              </p>
              {isSelf && (<Button className="mt-4" size="sm" onClick={() => navigate('post-problem')}>
                  Post your first problem
                </Button>)}
            </div>) : (userProblems.map(p => (<Card key={p.id} hover onClick={() => navigate('problem-details', { problemId: p.id })}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 font-display mb-1">{p.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={p.status === 'open' ? 'green' : p.status === 'in-progress' ? 'indigo' : 'slate'} dot>
                      {p.status}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-2">{p.collaboratorsJoined}/{p.collaboratorsNeeded} members</p>
                  </div>
                </div>
              </Card>)))}
        </div>)}

      {tab === 'skills' && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 fade-in">
          <Card>
            <h3 className="font-semibold text-slate-900 font-display mb-4">Skills</h3>
            {hasSkills ? (<div className="space-y-3">
                {student.skills.map((skill, i) => (<div key={skill}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-700 font-medium">{skill}</span>
                      <span className="text-slate-400 text-xs">{70 + (i * 7) % 25}%</span>
                    </div>
                    <ProgressBar value={70 + (i * 7) % 25} color="bg-indigo-500" size="sm"/>
                  </div>))}
              </div>) : (<div className="py-6 text-center">
                <p className="text-sm text-slate-400 italic">
                  {isSelf ? (<button onClick={() => navigate('settings')} className="hover:text-indigo-600 transition-colors">
                      + Add skills during onboarding or in Settings
                    </button>) : 'No skills listed.'}
                </p>
              </div>)}
          </Card>
          <Card>
            <h3 className="font-semibold text-slate-900 font-display mb-4">Interests</h3>
            {hasInterests ? (<div className="flex flex-wrap gap-2">
                {student.interests.map((interest, i) => (<span key={interest} className={`px-3 py-1.5 rounded-full text-sm font-medium ${['bg-indigo-50 text-indigo-700', 'bg-violet-50 text-violet-700', 'bg-teal-50 text-teal-700', 'bg-sky-50 text-sky-700'][i % 4]}`}>
                    {interest}
                  </span>))}
              </div>) : (<div className="py-6 text-center">
                <p className="text-sm text-slate-400 italic">
                  {isSelf ? 'No interests added yet.' : 'No interests listed.'}
                </p>
              </div>)}
          </Card>
        </div>)}

      {tab === 'contributions' && (<div className="space-y-4 fade-in">
          <div className="grid grid-cols-3 gap-4">
            {[
                { label: 'Tasks Completed', value: student.contributions, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Problems Solved', value: student.problemsSolved, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Total Collaborations', value: student.collaborations, color: 'text-violet-600', bg: 'bg-violet-50' },
            ].map(s => (<Card key={s.label} className={s.bg}>
                <p className={`text-3xl font-bold ${s.color} font-display`}>{s.value}</p>
                <p className="text-sm text-slate-600 mt-1">{s.label}</p>
              </Card>))}
          </div>
          {!isSelf && (<Card>
              <h3 className="font-semibold text-slate-900 font-display mb-4">Activity Timeline</h3>
              <div className="space-y-3">
                {[
                    { action: 'Completed "Preprocess PlantVillage dataset"', project: 'CropScan AI', time: '2 hours ago', type: 'task' },
                    { action: 'Joined collaboration "CampusWatt"', project: 'Campus Energy Monitor', time: 'Yesterday', type: 'collab' },
                    { action: 'Posted problem "IoT Campus Energy Monitoring"', project: '', time: '3 days ago', type: 'problem' },
                ].map((a, i) => (<div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.type === 'task' ? 'bg-emerald-50 text-emerald-600' : a.type === 'collab' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'}`}>
                      <CheckCircle className="w-4 h-4"/>
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">{a.action}</p>
                      {a.project && <p className="text-xs text-slate-500">{a.project}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>))}
              </div>
            </Card>)}
          {isSelf && student.contributions === 0 && (<Card>
              <div className="py-8 text-center">
                <p className="text-slate-400 text-sm italic">
                  No contributions yet. Join a collaboration to start contributing.
                </p>
                <Button size="sm" className="mt-3" variant="outline" onClick={() => navigate('discover')}>
                  Browse Problems
                </Button>
              </div>
            </Card>)}
        </div>)}
    </div>);
}
