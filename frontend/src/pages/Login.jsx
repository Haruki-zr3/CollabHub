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
    <div className="auth-page-roll min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-10">
            <BrandLogo className="w-11 h-11" />
            <span className="font-bold text-slate-900 font-display text-lg">CollabHub · SMVDU</span>
          </div>

          <h2 className="text-[27px] font-bold text-slate-900 font-display mb-2">Welcome back</h2>
          <p className="text-base text-slate-500 mb-9">Sign in to your account to continue</p>

          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="SMVDU University Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@smvdu.ac.in" hint="Use your official SMVDU university email address." icon={<Mail className="w-4 h-4" />} />
            <Input label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" icon={<Lock className="w-4 h-4" />} iconRight={<button type="button" onClick={() => setShowPass(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
            <div className="flex justify-end">
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</button>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign in</Button>
          </form>

          <p className="mt-7 text-base text-center text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('register')} className="text-indigo-600 font-medium hover:text-indigo-700">Create one free</button>
          </p>
      </div>
    </div>
  );
}
