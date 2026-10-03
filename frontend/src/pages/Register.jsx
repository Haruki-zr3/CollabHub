import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { Eye, EyeOff, Lock, CheckCircle, GraduationCap, User } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { apiRequest } from '../api';
const smvduBranches = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Other',
];
const ALLOWED_DOMAIN = 'smvdu.ac.in';
function isSmvduEmail(email) {
    return email.trim().toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}
export default function Register({ navigate }) {
    const { setUser } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        branch: '',
        year: '',
        entryNumber: '',
    });
    const [emailTouched, setEmailTouched] = useState(false);
    const emailValid = isSmvduEmail(form.email);
    const emailError = emailTouched && form.email.length > 0 && !emailValid
        ? 'Please use your official SMVDU email address (@smvdu.ac.in).'
        : undefined;
    function set(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }
    function handleNext(e) {
        e.preventDefault();
        if (step === 1) {
            setEmailTouched(true);
            if (!emailValid || !form.name || !form.password)
                return;
            setStep(2);
            return;
        }
        setLoading(true);
        setError('');
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ ...form, year: form.year ? parseInt(form.year, 10) : 1 }),
        })
            .then(({ user }) => { setUser(user); navigate('onboarding'); })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }
    return (<div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 flex-col p-12 justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="font-bold text-white font-display text-base">CollabHub · SMVDU</span>
        </div>

        <div className="space-y-6">
          {/* Step progress */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2].map(i => (<div key={i} className={`h-1 rounded-full flex-1 transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-slate-700'}`}/>))}
          </div>

          <h2 className="text-3xl font-bold text-white font-display">
            {step === 1 ? 'Create your account' : 'Your academic profile'}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {step === 1
            ? 'Join your fellow SMVDU students already collaborating on real academic problems across departments.'
            : 'Help us match you with the right collaborators and relevant problems in your department.'}
          </p>

          <div className="space-y-3 mt-8">
            {[
            'Find collaborators by skill & branch',
            'Work in structured project workspaces',
            'Track contributions & build your portfolio',
            'Connect with students across SMVDU',
        ].map((item, i) => (<div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                {item}
              </div>))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">Exclusively for SMVDU students · Free to use</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <BrandLogo />
            <span className="font-bold text-slate-900 font-display">CollabHub · SMVDU</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(i => (<React.Fragment key={i}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${i < step ? 'bg-indigo-600 text-white' : i === step ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-slate-200 text-slate-500'}`}>
                  {i < step ? (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>) : i}
                </div>
                {i < 2 && <div className={`h-px flex-1 ${i < step ? 'bg-indigo-600' : 'bg-slate-200'}`}/>}
              </React.Fragment>))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-display mb-1.5">
            {step === 1 ? 'Create your account' : 'Your academic profile'}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            {step === 1
            ? 'Step 1 of 2 — Account information'
            : 'Step 2 of 2 — Tell us about your studies at SMVDU.'}
          </p>

          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 ? (<>
                <Input label="Full name" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Arjun Sharma" icon={<User className="w-4 h-4"/>}/>

                {/* Email with SMVDU verification */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">SMVDU University Email</label>
                  <div className="relative">
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => setEmailTouched(true)} placeholder="yourname@smvdu.ac.in" className={`w-full h-9 rounded-lg border text-sm px-3 pr-10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 ${emailError
                ? 'border-red-400 bg-red-50/50'
                : emailValid && form.email
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 bg-white hover:border-slate-400'}`}/>
                    {emailValid && form.email && (<CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500"/>)}
                  </div>
                  <p className="text-xs text-slate-500">Use your official SMVDU university email address.</p>
                  {emailError && <p className="text-xs text-red-600">{emailError}</p>}

                  {/* Verified university display */}
                  {emailValid && form.email && (<div className="mt-1 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 fade-in">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0"/>
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">SMVDU email verified</p>
                        <p className="text-xs text-emerald-700">Shri Mata Vaishno Devi University</p>
                      </div>
                    </div>)}
                </div>

                <Input label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 8 characters" icon={<Lock className="w-4 h-4"/>} iconRight={<button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>}/>
              </>) : (<>
                {/* Non-editable verified university field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">University</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">Shri Mata Vaishno Devi University</p>
                      <p className="text-xs text-slate-500">Katra, Jammu & Kashmir</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500"/>
                      <span className="text-xs text-emerald-600 font-medium">Verified</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Automatically identified from your SMVDU email.</p>
                </div>

                <Select label="Branch / Department" value={form.branch} onChange={e => set('branch', e.target.value)}>
                  <option value="">Select your branch</option>
                  {smvduBranches.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>

                <Select label="Year of Study" value={form.year} onChange={e => set('year', e.target.value)}>
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </Select>

                <Input label="Entry / Enrollment Number" type="text" value={form.entryNumber} onChange={e => set('entryNumber', e.target.value)} placeholder="e.g. 22BCS001" hint="Optional — helps verify your student status."/>
              </>)}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg" disabled={step === 1 && (!form.name || !emailValid || !form.password)}>
              {step === 1 ? 'Continue' : 'Create account'}
            </Button>
          </form>

          {step === 1 && (<p className="mt-4 text-xs text-slate-500 text-center">
              By creating an account, you agree to our{' '}
              <span className="text-indigo-600 cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-indigo-600 cursor-pointer">Privacy Policy</span>.
            </p>)}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>);
}
