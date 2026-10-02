import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { problems } from '../data/mockData';
import { Avatar, Badge, Button, DifficultyBadge, Modal, ProblemStatusBadge, ProgressBar, SkillTag } from '../components/ui';
import { ArrowLeft, Users, Calendar, Eye, Clock, Bookmark, Share2, MessageSquare, CheckCircle, HandHelping, Info } from 'lucide-react';
const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'];
export default function ProblemDetails({ navigate, context }) {
    const { user } = useAuth();
    const problem = problems.find(p => p.id === context.problemId) || problems[0];
    const [showModal, setShowModal] = useState(false);
    const [offerSent, setOfferSent] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // modal state
    const [helpMessage, setHelpMessage] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [availability, setAvailability] = useState([]);
    const daysLeft = Math.ceil((new Date(problem.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    function toggleSkill(s) {
        setSelectedSkills(ss => ss.includes(s) ? ss.filter(x => x !== s) : [...ss, s]);
    }
    function toggleAvail(a) {
        setAvailability(aa => aa.includes(a) ? aa.filter(x => x !== a) : [...aa, a]);
    }
    function sendOffer() {
        setOfferSent(true);
        setShowModal(false);
        setShowSuccess(true);
    }
    if (showSuccess) {
        return (<div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Help offer sent!</h2>
        <p className="text-slate-500 max-w-sm mb-8">
          The problem owner has been notified. If they accept, you'll be added to the collaboration workspace.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setShowSuccess(false); navigate('discover'); }}>
            Browse More Problems
          </Button>
          <Button onClick={() => navigate('my-collaborations')}>
            View My Offers
          </Button>
        </div>
      </div>);
    }
    return (<div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('discover')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
        Back to Discover
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <ProblemStatusBadge status={problem.status}/>
                  <DifficultyBadge difficulty={problem.difficulty}/>
                  <Badge variant="slate">{problem.type}</Badge>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 font-display leading-snug mb-2">{problem.title}</h1>
                <p className="text-sm text-slate-500">{problem.branch}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
                  <Bookmark className="w-4 h-4"/>
                </button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
                  <Share2 className="w-4 h-4"/>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 pb-4 border-b border-slate-100 mb-5">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4"/>
                {problem.collaboratorsJoined}/{problem.collaboratorsNeeded} helping
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4"/>
                Deadline: {new Date(problem.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                {daysLeft > 0 && <span className="text-amber-600 font-medium ml-1">({daysLeft} days left)</span>}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4"/>
                {problem.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4"/>
                Posted {problem.postedAt}
              </span>
            </div>

            <h2 className="font-semibold text-slate-900 font-display mb-3">About this problem</h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {problem.longDescription || problem.description}
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map(tag => <Badge key={tag} variant="slate">{tag}</Badge>)}
              </div>
            </div>
          </div>

          {/* Required skills */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 font-display mb-3">Skills needed</h2>
            <div className="flex flex-wrap gap-2">
              {problem.skills.map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
            </div>
          </div>

          {/* Posted by */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 font-display mb-4">Problem owner</h2>
            <div className="flex items-center gap-4">
              <Avatar student={problem.postedBy} size="lg"/>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-0.5">{problem.postedBy.name}</h3>
                <p className="text-sm text-slate-500">{problem.postedBy.branch} · Year {problem.postedBy.year}</p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{problem.postedBy.bio}</p>
              </div>
              <Button variant="outline" size="sm" icon={<MessageSquare className="w-4 h-4"/>} onClick={() => navigate('messages')}>
                Message
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Help card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 font-display mb-3">Who's helping</h3>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">{problem.collaboratorsJoined} already helping</span>
                <span className="text-slate-600">{problem.collaboratorsNeeded} needed</span>
              </div>
              <ProgressBar value={problem.collaboratorsJoined} max={problem.collaboratorsNeeded} size="md"/>
            </div>
            {problem.status === 'open' ? (<>
                <p className="text-sm text-slate-500 mb-4">
                  {problem.collaboratorsNeeded - problem.collaboratorsJoined} more{' '}
                  {problem.collaboratorsNeeded - problem.collaboratorsJoined === 1 ? 'person' : 'people'} needed
                </p>
                {offerSent ? (<div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
                    <CheckCircle className="w-4 h-4 shrink-0"/>
                    Offer sent — awaiting response
                  </div>) : (<Button className="w-full" icon={<HandHelping className="w-4 h-4"/>} onClick={() => setShowModal(true)}>
                    I Can Help
                  </Button>)}
              </>) : (<Badge variant={problem.status === 'in-progress' ? 'indigo' : 'slate'} dot className="w-full justify-center py-2">
                {problem.status === 'in-progress' ? 'Being solved' : 'Problem solved'}
              </Badge>)}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-semibold text-slate-900 font-display">Quick stats</h3>
            {[
            { label: 'Views', value: problem.views },
            { label: 'Offers to help', value: problem.requests },
            { label: 'Days until deadline', value: daysLeft > 0 ? daysLeft : 'Expired' },
        ].map(s => (<div key={s.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{s.label}</span>
                <span className="font-semibold text-slate-900">{s.value}</span>
              </div>))}
          </div>

          {/* Similar problems */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 font-display mb-3">Similar problems</h3>
            {problems.filter(p => p.id !== problem.id && p.type === problem.type).slice(0, 2).map(p => (<button key={p.id} onClick={() => navigate('problem-details', { problemId: p.id })} className="w-full text-left group mb-3 last:mb-0">
                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.branch}</p>
              </button>))}
          </div>
        </div>
      </div>

      {/* "I Can Help" modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="I Can Help" width="lg">
        <div className="space-y-5">
          {/* Subtitle */}
          <p className="text-slate-500 text-sm -mt-2">Let the problem owner know how you can help.</p>

          {/* Problem summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Problem</p>
            <h4 className="font-semibold text-slate-900 text-sm leading-snug mb-1">{problem.title}</h4>
            <div className="flex items-center gap-2 mt-2">
              <Avatar student={problem.postedBy} size="xs"/>
              <span className="text-xs text-slate-500">Posted by {problem.postedBy.name} · {problem.branch}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {problem.skills.map((s, i) => <SkillTag key={s} skill={s} index={i}/>)}
            </div>
          </div>

          {/* How can you help */}
          <div>
            <label className="text-sm font-semibold text-slate-800 block mb-1.5">How can you help?</label>
            <textarea value={helpMessage} onChange={e => setHelpMessage(e.target.value)} rows={4} placeholder="Briefly explain what you can contribute or how you can help solve this problem…" className="w-full rounded-xl border border-slate-300 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder:text-slate-400 hover:border-slate-400 transition-colors"/>
            <p className="text-xs text-slate-400 mt-1">{helpMessage.length}/500</p>
          </div>

          {/* Relevant skills from profile */}
          <div>
            <label className="text-sm font-semibold text-slate-800 block mb-2">Relevant skills</label>
            <p className="text-xs text-slate-500 mb-2.5">Select skills from your profile that apply to this problem.</p>
            <div className="flex flex-wrap gap-2">
              {(user?.skills ?? []).length === 0 && (<p className="text-sm text-slate-400 italic">No skills added yet. Add skills in your profile to show them here.</p>)}
              {(user?.skills ?? []).map((skill, i) => {
            const active = selectedSkills.includes(skill);
            const relevant = problem.skills.includes(skill);
            return (<button key={skill} onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : relevant
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}>
                    {relevant && !active && <span className="mr-1 text-indigo-500">★</span>}
                    {skill}
                  </button>);
        })}
            </div>
            <p className="text-xs text-indigo-600 mt-2">★ Matches required skills</p>
          </div>

          {/* Availability */}
          <div>
            <label className="text-sm font-semibold text-slate-800 block mb-2">Your availability</label>
            <div className="grid grid-cols-2 gap-2">
              {availabilityOptions.map(opt => {
            const active = availability.includes(opt);
            return (<button key={opt} onClick={() => toggleAvail(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${active
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-400 ring-2 ring-indigo-200'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}`}>
                    {active ? '✓ ' : ''}{opt}
                  </button>);
        })}
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/>
            <p className="text-xs text-slate-500">Your profile and relevant skills will be shared with the problem owner.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" icon={<HandHelping className="w-4 h-4"/>} disabled={!helpMessage.trim()} onClick={sendOffer}>
              Send Offer to Help
            </Button>
          </div>
        </div>
      </Modal>
    </div>);
}
