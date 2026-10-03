import React, { useState } from 'react';
import { Button, Input, Textarea, Select } from '../components/ui';
import { ArrowLeft, Plus, X, CheckCircle, Lightbulb } from 'lucide-react';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';
const allSkills = ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Analysis', 'SQL', 'R', 'Arduino', 'IoT', 'MATLAB', 'ANSYS', 'SolidWorks', 'AutoCAD', 'C++', 'Java', 'Android', 'Flutter', 'AWS', 'Docker', 'Git', 'Signal Processing', 'UI/UX Design', 'Bioinformatics', 'HuggingFace', 'Embedded C'];
const branches = ['Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Data Science', 'Biotechnology', 'Physics', 'Mathematics', 'Cross-disciplinary'];
export default function PostProblem({ navigate }) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        branch: '',
        type: '',
        difficulty: '',
        deadline: '',
        collaboratorsNeeded: '2',
    });
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
    function toggleSkill(s) { setSelectedSkills(ss => ss.includes(s) ? ss.filter(x => x !== s) : [...ss, s]); }
    function addTag() { if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags(ts => [...ts, tagInput.trim()]);
        setTagInput('');
    } }
    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        apiRequest(`/problems?user_id=${user.id}`, {
            method: 'POST',
            body: JSON.stringify({
                ...form,
                type: form.type || 'project',
                difficulty: form.difficulty || 'intermediate',
                collaboratorsNeeded: Number(form.collaboratorsNeeded),
                skills: selectedSkills,
                tags,
            }),
        })
            .then(() => setSuccess(true))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }
    if (success) {
        return (<div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">Problem posted!</h2>
        <p className="text-slate-500 mb-8">Your problem is now live. Collaborators matching your requirements will be notified.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('my-problems')}>View My Problems</Button>
          <Button onClick={() => navigate('discover')}>Browse All Problems</Button>
        </div>
      </div>);
    }
    return (<div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate('discover')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
        Back
      </button>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(i => (<React.Fragment key={i}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i < step ? 'bg-indigo-600 text-white' : i === step ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-slate-100 text-slate-500'}`}>
                {i < step ? '✓' : i}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {i === 1 ? 'Basic Info' : i === 2 ? 'Skills & Tags' : 'Review'}
              </span>
            </div>
            {i < 3 && <div className={`flex-1 h-px ${i < step ? 'bg-indigo-500' : 'bg-slate-200'}`}/>}
          </React.Fragment>))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (<div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display mb-1">Describe your problem</h2>
              <p className="text-sm text-slate-500">Clear descriptions attract better collaborators.</p>
            </div>

            <Input label="Problem title *" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. ML Model for Crop Disease Detection via Smartphone Camera" hint="Be specific and descriptive. Good titles attract 3x more offers to help."/>

            <Textarea label="Description *" value={form.description} onChange={e => set('description', e.target.value)} rows={5} placeholder="Describe the problem, your approach, what kind of collaborators you need, and the expected outcome…" hint="Include: the problem context, your progress so far, what you need help with, and expected deliverables."/>

            <div className="grid grid-cols-2 gap-4">
              <Select label="Branch / Domain *" value={form.branch} onChange={e => set('branch', e.target.value)}>
                <option value="">Select branch</option>
                {branches.map(b => <option key={b}>{b}</option>)}
              </Select>
              <Select label="Problem type *" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="">Select type</option>
                <option>academic</option>
                <option>technical</option>
                <option>project</option>
                <option>research</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label="Difficulty level *" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                <option value="">Select difficulty</option>
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </Select>
              <Input label="Collaborators needed *" type="number" min="1" max="10" value={form.collaboratorsNeeded} onChange={e => set('collaboratorsNeeded', e.target.value)}/>
            </div>

            <Input label="Deadline *" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} hint="When do you need this solved by?"/>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!form.title || !form.description}>
                Next: Skills & Tags
              </Button>
            </div>
          </div>)}

        {step === 2 && (<div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display mb-1">Required skills & tags</h2>
              <p className="text-sm text-slate-500">Selected skills help match your problem with the right collaborators.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">
                Required skills <span className="text-slate-400">({selectedSkills.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => {
                const active = selectedSkills.includes(skill);
                return (<button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'}`}>
                      {skill}
                    </button>);
            })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        } }} placeholder="Type a tag and press Enter" className="flex-1 h-9 rounded-lg border border-slate-300 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <Button type="button" variant="outline" size="sm" onClick={addTag} icon={<Plus className="w-4 h-4"/>}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (<div className="flex flex-wrap gap-2">
                  {tags.map(tag => (<span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
                      {tag}
                      <button type="button" onClick={() => setTags(ts => ts.filter(t => t !== tag))} className="text-slate-400 hover:text-slate-700">
                        <X className="w-3 h-3"/>
                      </button>
                    </span>))}
                </div>)}
            </div>

            {/* Tip */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex gap-3">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5"/>
              <p className="text-sm text-indigo-800">Problems with 4+ specific skills attract 60% more offers to help than vague ones.</p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Review & Post</Button>
            </div>
          </div>)}

        {step === 3 && (<div className="space-y-4 fade-in">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 font-display mb-4">Review your problem</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Title</p>
                  <p className="font-semibold text-slate-900">{form.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{form.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Branch</p>
                    <p className="text-sm text-slate-800">{form.branch}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Type</p>
                    <p className="text-sm text-slate-800 capitalize">{form.type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Difficulty</p>
                    <p className="text-sm text-slate-800 capitalize">{form.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Collaborators needed</p>
                    <p className="text-sm text-slate-800">{form.collaboratorsNeeded}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((s, i) => <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{s}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" loading={loading}>
                Publish Problem
              </Button>
            </div>
          </div>)}
      </form>
    </div>);
}
