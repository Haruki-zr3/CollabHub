import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '../components/ui';
const allSkills = [
    'Python', 'JavaScript', 'React', 'Node.js', 'TypeScript',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'NLP',
    'Computer Vision', 'Data Analysis', 'SQL', 'R',
    'Arduino', 'IoT', 'Embedded C', 'MATLAB', 'ANSYS', 'SolidWorks',
    'AutoCAD', 'C++', 'Java', 'Android', 'iOS', 'Flutter',
    'AWS', 'Docker', 'Git', 'Linux', 'Bioinformatics',
    'Signal Processing', 'UI/UX Design', 'Figma', 'HuggingFace',
];
const allInterests = [
    'AI / Machine Learning', 'Web Development', 'Mobile Apps',
    'IoT & Robotics', 'Data Science', 'Computer Vision',
    'NLP & Linguistics', 'Research & Academia', 'Healthcare Tech',
    'Sustainable Energy', 'EdTech', 'FinTech', 'Open Source',
    'Cybersecurity', 'Blockchain', 'Smart Cities', 'Bioinformatics',
    'Game Development', 'Embedded Systems', 'Signal Processing',
];
export default function Onboarding({ navigate }) {
    const { updateUser } = useAuth();
    const [step, setStep] = useState(0);
    const [skills, setSkills] = useState([]);
    const [interests, setInterests] = useState([]);
    const [availability, setAvailability] = useState('available');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const steps = [
        { title: 'What are your skills?', subtitle: 'Select all that apply. These help us match you with relevant problems and collaborators.' },
        { title: 'What are you interested in?', subtitle: 'Choose your areas of academic and technical interest.' },
        { title: 'Availability & bio', subtitle: 'Let potential collaborators know how you prefer to work.' },
    ];
    function toggle(set, setSet, val) {
        setSet(set.includes(val) ? set.filter(v => v !== val) : [...set, val]);
    }
    function finish() {
        setLoading(true);
        setTimeout(() => {
            updateUser({
                skills,
                interests,
                availability: availability,
                bio,
            });
            setLoading(false);
            navigate('dashboard');
        }, 1000);
    }
    return (<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white"/>
            </div>
            <span className="font-bold text-slate-900 font-display text-lg">CollabHub</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (<React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${i < step ? 'bg-indigo-600 text-white' :
                i === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                    'bg-slate-200 text-slate-500'}`}>
                  {i < step ? <Check className="w-4 h-4"/> : i + 1}
                </div>
                {i < steps.length - 1 && (<div className={`w-16 h-px ${i < step ? 'bg-indigo-600' : 'bg-slate-200'}`}/>)}
              </React.Fragment>))}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 font-display mb-2">{steps[step].title}</h1>
          <p className="text-slate-500 text-sm">{steps[step].subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {step === 0 && (<div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">Selected: <span className="font-semibold text-indigo-600">{skills.length}</span></p>
                {skills.length > 0 && (<button onClick={() => setSkills([])} className="text-xs text-slate-400 hover:text-slate-600">Clear all</button>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => {
                const active = skills.includes(skill);
                return (<button key={skill} onClick={() => toggle(skills, setSkills, skill)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'}`}>
                      {active && <span className="inline-block mr-1">✓</span>}{skill}
                    </button>);
            })}
              </div>
            </div>)}

          {step === 1 && (<div>
              <p className="text-sm text-slate-600 mb-4">Selected: <span className="font-semibold text-indigo-600">{interests.length}</span></p>
              <div className="flex flex-wrap gap-2">
                {allInterests.map(interest => {
                const active = interests.includes(interest);
                return (<button key={interest} onClick={() => toggle(interests, setInterests, interest)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-violet-400 hover:text-violet-600'}`}>
                      {active && <span className="inline-block mr-1">✓</span>}{interest}
                    </button>);
            })}
              </div>
            </div>)}

          {step === 2 && (<div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Current availability</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                { val: 'available', label: 'Available', desc: 'Open to new collaborations', color: 'text-emerald-600', dot: 'bg-emerald-500' },
                { val: 'busy', label: 'Busy', desc: 'Limited availability', color: 'text-amber-600', dot: 'bg-amber-500' },
                { val: 'unavailable', label: 'Unavailable', desc: 'Not taking projects now', color: 'text-slate-500', dot: 'bg-slate-400' },
            ].map(opt => (<button key={opt.val} onClick={() => setAvailability(opt.val)} className={`p-3 rounded-xl border text-left transition-all ${availability === opt.val
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${opt.dot}`}/>
                        <span className={`text-sm font-semibold ${opt.color}`}>{opt.label}</span>
                      </div>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </button>))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Short bio <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell potential collaborators about your background, what you enjoy working on, and what you're looking for in a collaboration…" className="w-full rounded-xl border border-slate-300 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-colors resize-none placeholder:text-slate-400"/>
                <p className="text-xs text-slate-400 mt-1">{bio.length}/500 characters</p>
              </div>
            </div>)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (<Button variant="ghost" onClick={() => setStep(s => s - 1)} icon={<ChevronLeft />}>
              Back
            </Button>) : (<button onClick={() => navigate('dashboard')} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Skip for now
            </button>)}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{step + 1} of {steps.length}</span>
            {step < steps.length - 1 ? (<Button onClick={() => setStep(s => s + 1)} iconRight={<ChevronRight />}>
                Continue
              </Button>) : (<Button onClick={finish} loading={loading}>
                Complete setup
              </Button>)}
          </div>
        </div>
      </div>
    </div>);
}
