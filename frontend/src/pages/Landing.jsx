import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { ArrowRight, Users, CheckCircle, Star, Lightbulb, Globe, MessageSquare } from 'lucide-react';
import { Button, Badge } from '../components/ui';
const features = [
    { icon: <Lightbulb className="w-5 h-5"/>, color: 'bg-amber-50 text-amber-600', title: 'Post Academic Problems', desc: 'Share research questions, technical challenges, and project needs that you cannot solve alone.' },
    { icon: <Users className="w-5 h-5"/>, color: 'bg-indigo-50 text-indigo-600', title: 'Smart Collaborator Matching', desc: 'Our algorithm matches you with students based on skills, availability, and academic compatibility.' },
    { icon: <CheckCircle className="w-5 h-5"/>, color: 'bg-emerald-50 text-emerald-600', title: 'Structured Workspaces', desc: 'Collaborate in dedicated project workspaces with tasks, discussions, files, and progress tracking.' },
    { icon: <Globe className="w-5 h-5"/>, color: 'bg-sky-50 text-sky-600', title: 'Cross-Department Collaboration', desc: 'Break silos between SMVDU departments. Connect CSE students with Mechanical engineers, or Math with ECE.' },
    { icon: <Star className="w-5 h-5"/>, color: 'bg-violet-50 text-violet-600', title: 'Contribution Tracking', desc: 'Build a verifiable academic portfolio. Every solved problem and contribution is tracked on your profile.' },
    { icon: <MessageSquare className="w-5 h-5"/>, color: 'bg-pink-50 text-pink-600', title: 'Integrated Communication', desc: 'Built-in messaging keeps all your collaboration conversations organized in one place.' },
];
const steps = [
    { n: '01', title: 'Post Your Problem', desc: 'Describe your academic or technical challenge, add required skills, and set a collaboration deadline.' },
    { n: '02', title: 'Find Your Team', desc: 'Review matched collaborator profiles, check compatibility scores, and invite the right people.' },
    { n: '03', title: 'Build Together', desc: 'Work in a shared workspace with Kanban boards, file sharing, and real-time discussion threads.' },
];
const testimonials = [
    { name: 'Priya Patel', branch: 'ECE, Year 2 · SMVDU', quote: 'CollabHub helped me find a CS student to work on my IoT project in less than a week. The skill matching is surprisingly accurate.', initials: 'PP', color: '#7C3AED' },
    { name: 'Rohan Kumar', branch: 'Mechanical Engineering, Year 4 · SMVDU', quote: 'I solved a structural simulation problem that had been stuck for months by collaborating with a CS student through CollabHub. Game changer.', initials: 'RK', color: '#059669' },
    { name: 'Sneha Reddy', branch: 'Mathematics, Year 3 · SMVDU', quote: 'The workspace feature is excellent. We managed our entire research paper through CollabHub — tasks, discussions, files, everything in one place.', initials: 'SR', color: '#DC2626' },
];
const sampleProblems = [
    { title: 'ML Model for Crop Disease Detection', branch: 'CS × Agriculture', skills: ['Python', 'TensorFlow', 'CV'], status: 'open', collab: '2/4' },
    { title: 'IoT Campus Energy Monitoring', branch: 'ECE × CS', skills: ['IoT', 'ESP32', 'React'], status: 'open', collab: '1/3' },
    { title: 'NLP for Code-Switching Detection', branch: 'CS × Linguistics', skills: ['PyTorch', 'NLP', 'HuggingFace'], status: 'in-progress', collab: '2/3' },
];
export default function Landing({ navigate }) {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(null);
    const chartSteps = [
        { ...steps[0], path: 'M250 250 L85.45 155 A190 190 0 0 1 414.55 155 Z', position: { x: 145, y: 105, width: 210, height: 100 }, move: 'translate(0 -14)' },
        { ...steps[1], path: 'M250 250 L414.55 155 A190 190 0 0 1 250 440 Z', position: { x: 290, y: 260, width: 128, height: 100 }, move: 'translate(8 6)' },
        { ...steps[2], path: 'M250 250 L250 440 A190 190 0 0 1 85.45 155 Z', position: { x: 82, y: 260, width: 128, height: 100 }, move: 'translate(-8 6)' },
    ];
    return (<div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="w-full px-3 sm:px-5 h-20 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-2 justify-self-start">
            <button type="button" aria-label="Go to homepage" onClick={() => navigate(user ? 'dashboard' : 'landing')} className="rounded-xl">
              <BrandLogo className="w-14 h-14" />
            </button>
            <span className="font-extrabold text-slate-900 font-display text-xl">CollabHub</span>
          </div>
          <div className="hidden md:flex items-center justify-center gap-8 text-base text-slate-700 font-bold">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#problems" className="hover:text-slate-900 transition-colors">Explore</a>
          </div>
          <div className="justify-self-end flex items-center gap-3">
            <Button variant="ghost" size="lg" onClick={() => navigate('login')}>Log in</Button>
            <Button variant="primary" size="lg" onClick={() => navigate('register')}>Get started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <Badge variant="indigo" className="mx-auto mb-6 flex w-fit justify-center px-4 py-2 text-xl font-extrabold">The collaboration platform of SMVDU</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 font-display leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
            Students helping students<br />
            <span className="text-indigo-600">solve problems</span> at SMVDU
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Post academic problems, find collaborators across departments, and work together in structured project workspaces — built exclusively for SMVDU students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate('register')} iconRight={<ArrowRight />}>
              Start collaborating
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {[
            { v: '90+', l: 'SMVDU students' },
            { v: '12+', l: 'Problems solved' },
            { v: '8', l: 'Departments' },
            { v: '3', l: 'Collaboration steps' },
        ].map(stat => (<div key={stat.l} className="text-center">
                <p className="text-3xl font-bold text-indigo-600 font-display">{stat.v}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.l}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wider">Simple process</p>
            <h2 className="text-4xl font-bold text-slate-900 font-display">Collaborate in three steps</h2>
          </div>
          <div className="mx-auto w-full max-w-[560px]">
            <div className="relative">
              <svg viewBox="0 0 500 500" className="h-auto w-full overflow-visible" role="img" aria-label="Three steps to collaborate">
              {chartSteps.map((step, i) => {
                  const isActive = activeStep === i;
                  return (<g
                    key={step.n}
                    role="button"
                    tabIndex="0"
                    aria-label={`${step.n}: ${step.title}`}
                    className="cursor-pointer outline-none"
                    style={{ transform: isActive ? step.move : 'translate(0 0)', transformOrigin: '250px 250px', transition: 'transform 220ms ease' }}
                    onMouseEnter={() => setActiveStep(i)}
                    onMouseLeave={() => setActiveStep(null)}
                    onFocus={() => setActiveStep(i)}
                    onBlur={() => setActiveStep(null)}
                  >
                    <path d={step.path} fill={['#E0E7FF', '#C7D2FE', '#A5B4FC'][i]} stroke="#FFFFFF" strokeWidth="5" />
                    <foreignObject {...step.position} className="pointer-events-none">
                      <div className={`flex h-full flex-col items-center justify-center overflow-hidden px-3 text-center transition-opacity duration-200 ${isActive ? 'opacity-0' : ''}`}>
                        <span className="mb-1 text-xs font-semibold tracking-widest text-indigo-700">{step.n}</span>
                        <h3 className="font-display text-sm font-semibold leading-tight text-slate-900">{step.title}</h3>
                      </div>
                    </foreignObject>
                  </g>);
              })}
              <circle cx="250" cy="250" r="64" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="5" />
              <text x="250" y="242" textAnchor="middle" className="fill-slate-900 font-display text-[15px] font-extrabold">Collaborate</text>
              <text x="250" y="264" textAnchor="middle" className="fill-slate-900 font-display text-[15px] font-extrabold">in three steps</text>
              </svg>
              {activeStep !== null && (
                <div className={`pointer-events-none absolute z-10 w-56 rounded-2xl border border-indigo-100 bg-white p-4 text-left shadow-lg ring-1 ring-indigo-50 ${
                  activeStep === 0 ? 'right-0 top-2' : activeStep === 1 ? 'right-0 bottom-8' : 'left-0 bottom-8'
                }`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step {steps[activeStep].n}</p>
                  <h3 className="mt-1 font-display text-base font-semibold text-slate-900">{steps[activeStep].title}</h3>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600">{steps[activeStep].desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wider">Built for students</p>
            <h2 className="text-4xl font-bold text-slate-900 font-display">Everything you need to collaborate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (<div key={i} className="feature-card-reveal group bg-white rounded-2xl border border-slate-200 p-8 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 transition-all duration-300" style={{ '--feature-delay': `${i * 140}ms` }}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} mb-5 transition-transform duration-300 group-hover:scale-110 [&>svg]:h-7 [&>svg]:w-7`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-3">{f.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{f.desc}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Sample problems */}
      <section id="problems" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wider">Live on the platform</p>
              <h2 className="text-4xl font-bold text-slate-900 font-display">Problems seeking collaborators</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(user ? 'dashboard' : 'login')} iconRight={<ArrowRight />}>
              Browse All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sampleProblems.map((p, i) => (<div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer" onClick={() => { navigate('register'); }}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${p.status === 'open' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-indigo-50 text-indigo-700 ring-indigo-200'}`}>
                    ● {p.status === 'open' ? 'Open' : 'In Progress'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3"/> {p.collab}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 font-display mb-1 leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{p.branch}</p>
                <div className="flex flex-wrap gap-1">
                  {p.skills.map(s => (<span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>))}
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 font-display">SMVDU students love CollabHub</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (<div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (<Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400"/>))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ backgroundColor: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.branch}</p>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-cta py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white font-display mb-5">Ready to start helping each other?</h2>
          <p className="text-indigo-200 mb-10 text-lg">Join 340+ SMVDU students already solving problems together across every department.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('register')}>
              Create an account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrandLogo className="w-[30px] h-[30px] rounded-lg" />
              <span className="font-bold text-white font-display text-sm">CollabHub · SMVDU</span>
            </div>
            <p className="text-sm">© 2026 Student CollabHub · SMVDU. Students helping students.</p>
          </div>
        </div>
      </footer>
    </div>);
}
