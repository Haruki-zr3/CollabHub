import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { apiRequest } from '../api';

function isSmvduEmail(email) {
  return email.trim().toLowerCase().endsWith('@smvdu.ac.in');
}

export default function Login({ navigate }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isSmvduEmail(email)) {
      setError('Please use your official SMVDU email address (@smvdu.ac.in).');
      return;
    }
    setError('');
    setLoading(true);
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      .then(({ user }) => { setUser(user); navigate('dashboard'); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-cta flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="font-bold text-white font-display text-base">CollabHub · SMVDU</span>
        </div>
        <div>
          <blockquote className="text-white text-2xl font-medium font-display leading-snug mb-6">
            "Found my perfect research partner in 3 days. Couldn't have completed my final-year project without CollabHub."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">SR</div>
            <div>
              <p className="text-white font-medium text-sm">Sneha Reddy</p>
              <p className="text-indigo-200 text-xs">Data Science, Year 3 · SMVDU</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[['340+', 'SMVDU Students'], ['180+', 'Problems Solved'], ['95%', 'Success Rate']].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-white font-display">{v}</p>
              <p className="text-indigo-200 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <BrandLogo />
            <span className="font-bold text-slate-900 font-display">CollabHub · SMVDU</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-display mb-1.5">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="SMVDU University Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@smvdu.ac.in" hint="Use your official SMVDU university email address." icon={<Mail className="w-4 h-4" />} />
            <Input label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" icon={<Lock className="w-4 h-4" />} iconRight={<button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
            <div className="flex justify-end">
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</button>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign in</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('register')} className="text-indigo-600 font-medium hover:text-indigo-700">Create one free</button>
          </p>
        </div>
      </div>
    </div>
  );
}
