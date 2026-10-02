import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button, Input, Select, Toggle, UnderlineTabs } from '../components/ui';
import { authUserToStudent } from '../context/AuthContext';
import { User, Bell, Shield, Palette, Link, LogOut } from 'lucide-react';
const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4"/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4"/> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4"/> },
    { id: 'integrations', label: 'Integrations', icon: <Link className="w-4 h-4"/> },
];
const smvduBranches = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Biotechnology',
    'Other',
];
export default function Settings({ navigate }) {
    const { user, updateUser, clearUser } = useAuth();
    const [tab, setTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        bio: user?.bio ?? '',
        branch: user?.branch ?? '',
        year: String(user?.year ?? '1'),
        github: user?.github ?? '',
        linkedin: user?.linkedin ?? '',
        availability: user?.availability ?? 'available',
        cgpa: user?.cgpa != null ? String(user.cgpa) : '',
    });
    const [notifSettings, setNotifSettings] = useState({
        collaboration: true,
        task: true,
        message: true,
        problem: true,
        email: false,
        digest: true,
    });
    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: true,
        showEmail: false,
        showCGPA: true,
        allowMessages: true,
        showActivity: true,
    });
    function setP(k, v) { setProfile(p => ({ ...p, [k]: v })); }
    function save() {
        setSaving(true);
        setTimeout(() => {
            updateUser({
                name: profile.name.trim(),
                bio: profile.bio.trim(),
                branch: profile.branch,
                year: parseInt(profile.year) || 1,
                github: profile.github.trim(),
                linkedin: profile.linkedin.trim(),
                availability: profile.availability,
                cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null,
            });
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }, 1000);
    }
    const avatarStudent = user ? authUserToStudent(user) : null;
    return (<div className="p-6 max-w-4xl mx-auto">
      <UnderlineTabs tabs={tabs} activeTab={tab} onChange={setTab} className="mb-6"/>

      {tab === 'profile' && (<div className="space-y-5 fade-in">
          {/* Avatar section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 font-display mb-4">Profile Photo</h3>
            <div className="flex items-center gap-5">
              {avatarStudent ? (<Avatar student={avatarStudent} size="xl"/>) : (<div className="w-16 h-16 rounded-full bg-slate-200"/>)}
              <div>
                <Button variant="outline" size="sm">Change photo</Button>
                <p className="text-xs text-slate-400 mt-1.5">JPG, PNG or GIF · Max 5 MB</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 font-display">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full name" value={profile.name} onChange={e => setP('name', e.target.value)}/>
              <Input label="SMVDU University Email" value={profile.email} onChange={e => setP('email', e.target.value)} type="email" hint="Must end with @smvdu.ac.in"/>
            </div>

            {/* Non-editable university field */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">University</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
                <span className="text-sm text-slate-700 flex-1">Shri Mata Vaishno Devi University</span>
                <div className="flex items-center gap-1 text-emerald-600 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  <span className="text-xs font-medium">Verified</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Automatically set from your SMVDU email. Cannot be changed.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Bio</label>
              <textarea value={profile.bio} onChange={e => setP('bio', e.target.value)} rows={3} placeholder="Tell potential collaborators about yourself…" className="w-full rounded-lg border border-slate-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder:text-slate-400"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Branch / Department" value={profile.branch} onChange={e => setP('branch', e.target.value)}>
                <option value="">Select your branch</option>
                {smvduBranches.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Select label="Year of Study" value={profile.year} onChange={e => setP('year', e.target.value)}>
                {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Availability status" value={profile.availability} onChange={e => setP('availability', e.target.value)}>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </Select>
              <Input label="CGPA (optional)" value={profile.cgpa} onChange={e => setP('cgpa', e.target.value)} placeholder="e.g. 8.5" type="number" hint="Out of 10"/>
            </div>
          </div>

          {/* Social links */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-900 font-display">Social Links</h3>
            <Input label="GitHub username" value={profile.github} onChange={e => setP('github', e.target.value)} placeholder="username"/>
            <Input label="LinkedIn username" value={profile.linkedin} onChange={e => setP('linkedin', e.target.value)} placeholder="your-linkedin-name"/>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h3 className="font-semibold text-red-700 font-display mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-500 mb-4">These actions are irreversible. Please be certain.</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Deactivate account</Button>
              <Button variant="danger" size="sm" onClick={() => { clearUser(); navigate('landing'); }}>Delete account</Button>
            </div>
          </div>
        </div>)}

      {tab === 'notifications' && (<div className="space-y-4 fade-in">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 font-display mb-5">In-App Notifications</h3>
            <div className="space-y-5">
              {[
                { key: 'collaboration', label: 'Help offers', desc: 'When a student offers to help with your problem or invites you to theirs' },
                { key: 'task', label: 'Task updates', desc: 'When tasks are assigned, moved, or completed in your collaborations' },
                { key: 'message', label: 'Direct messages', desc: 'When you receive a new message from a student' },
                { key: 'problem', label: 'Problem matches', desc: 'When new problems match your skills and interests' },
            ].map(s => (<div key={s.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                  <Toggle checked={notifSettings[s.key]} onChange={v => setNotifSettings(n => ({ ...n, [s.key]: v }))}/>
                </div>))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 font-display mb-5">Email Notifications</h3>
            <div className="space-y-5">
              {[
                { key: 'email', label: 'Email notifications', desc: 'Send important notifications to your email' },
                { key: 'digest', label: 'Weekly digest', desc: 'A weekly summary of activity in your collaborations' },
            ].map(s => (<div key={s.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                  <Toggle checked={notifSettings[s.key]} onChange={v => setNotifSettings(n => ({ ...n, [s.key]: v }))}/>
                </div>))}
            </div>
          </div>
        </div>)}

      {tab === 'privacy' && (<div className="bg-white rounded-xl border border-slate-200 p-6 fade-in">
          <h3 className="font-semibold text-slate-900 font-display mb-5">Privacy Settings</h3>
          <div className="space-y-5">
            {[
                { key: 'profileVisible', label: 'Public profile', desc: 'Allow other students to find and view your profile' },
                { key: 'showEmail', label: 'Show email address', desc: 'Display your email on your public profile' },
                { key: 'showCGPA', label: 'Show CGPA', desc: 'Display your academic performance on your profile' },
                { key: 'allowMessages', label: 'Allow direct messages', desc: 'Let students you have not collaborated with message you' },
                { key: 'showActivity', label: 'Show activity', desc: 'Show your recent contributions and activity on your profile' },
            ].map(s => (<div key={s.key} className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
                <Toggle checked={privacySettings[s.key]} onChange={v => setPrivacySettings(p => ({ ...p, [s.key]: v }))}/>
              </div>))}
          </div>
        </div>)}

      {tab === 'integrations' && (<div className="space-y-4 fade-in">
          {[
                { name: 'GitHub', desc: 'Connect GitHub to showcase your repositories on your profile.', icon: '⌥', connected: false },
                { name: 'Google Drive', desc: 'Connect Drive to share files directly in collaboration workspaces.', icon: '▲', connected: false },
                { name: 'Notion', desc: 'Sync project notes and documents from Notion.', icon: '◼', connected: false },
                { name: 'Slack', desc: 'Get notifications in your Slack workspace.', icon: '#', connected: false },
            ].map(int => (<div key={int.name} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 shrink-0">
                {int.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{int.name}</p>
                <p className="text-sm text-slate-500">{int.desc}</p>
              </div>
              <Button variant={int.connected ? 'secondary' : 'outline'} size="sm">
                {int.connected ? 'Connected' : 'Connect'}
              </Button>
            </div>))}
        </div>)}

      {/* Save bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-between py-4 bg-slate-50 border-t border-slate-200 -mx-6 px-6">
        {saved && <span className="text-sm text-emerald-600 font-medium">✓ Changes saved</span>}
        <div className="ml-auto flex gap-3">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm" loading={saving} onClick={save}>Save changes</Button>
        </div>
      </div>
    </div>);
}
