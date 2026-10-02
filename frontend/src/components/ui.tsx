import React, { useState, useRef, useEffect } from 'react';
import type { Student } from '../types';

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 bg-white',
  ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-md gap-1',
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-base rounded-xl gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${buttonStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 w-4 h-4">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0 w-4 h-4">{iconRight}</span>}
    </button>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'indigo' | 'violet' | 'green' | 'amber' | 'red' | 'slate' | 'sky' | 'teal' | 'pink';

const badgeColors: Record<BadgeVariant, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200',
  pink: 'bg-pink-50 text-pink-700 ring-pink-200',
};

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'slate', size = 'sm', dot, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium ring-1 ring-inset rounded-full ${badgeColors[variant]} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

interface AvatarProps {
  student: Student;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({ student, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${avatarSizes[size]} ${className}`}
      style={{ backgroundColor: student.avatarColor }}
    >
      {student.initials}
    </div>
  );
}

export function AvatarGroup({ students, max = 3, size = 'sm' }: { students: Student[]; max?: number; size?: 'xs' | 'sm' | 'md' }) {
  const visible = students.slice(0, max);
  const extra = students.length - max;
  const sizeClass = avatarSizes[size];
  return (
    <div className="flex -space-x-2">
      {visible.map(s => (
        <div
          key={s.id}
          className={`rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white shrink-0 ${sizeClass}`}
          style={{ backgroundColor: s.avatarColor }}
          title={s.name}
        >
          {s.initials}
        </div>
      ))}
      {extra > 0 && (
        <div className={`rounded-full flex items-center justify-center font-semibold bg-slate-200 text-slate-600 ring-2 ring-white shrink-0 ${sizeClass} text-xs`}>
          +{extra}
        </div>
      )}
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({ label, error, hint, icon, iconRight, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full h-9 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 ${
            error
              ? 'border-red-400 bg-red-50/50'
              : 'border-slate-300 bg-white hover:border-slate-400'
          } ${icon ? 'pl-9' : 'pl-3'} ${iconRight ? 'pr-9' : 'pr-3'}`}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, className = '', id, ...props }: Omit<InputProps, 'icon' | 'iconRight'> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 px-3 py-2.5 resize-none ${
          error ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────

export function Select({ label, error, className = '', id, children, ...props }: { label?: string; error?: string; className?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        id={inputId}
        className={`w-full h-9 rounded-lg border text-sm px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer ${
          error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className = '', onClick, hover, padding = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-shadow ${hover ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''} ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, size = 'sm', color = 'bg-indigo-500', className = '', showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 rounded-full bg-slate-100 overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-slate-500 w-9 text-right shrink-0">{pct}%</span>}
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

interface Tab { id: string; label: string; icon?: React.ReactNode; count?: number }

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-0.5 bg-slate-100 p-1 rounded-lg ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function UnderlineTabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-6 border-b border-slate-200 ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 pb-3 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === tab.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── StatusDot ───────────────────────────────────────────────────────────────

const statusConfig = {
  available: { color: 'bg-emerald-500', label: 'Available' },
  busy: { color: 'bg-amber-500', label: 'Busy' },
  unavailable: { color: 'bg-slate-400', label: 'Unavailable' },
};

export function StatusDot({ status, showLabel }: { status: keyof typeof statusConfig; showLabel?: boolean }) {
  const cfg = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${cfg.color} shrink-0`} />
      {showLabel && <span className="text-xs text-slate-600">{cfg.label}</span>}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const priorityConfig = {
  low: { variant: 'slate' as BadgeVariant, label: 'Low' },
  medium: { variant: 'sky' as BadgeVariant, label: 'Medium' },
  high: { variant: 'amber' as BadgeVariant, label: 'High' },
  critical: { variant: 'red' as BadgeVariant, label: 'Critical' },
};

export function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' | 'critical' }) {
  const cfg = priorityConfig[priority];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

// ─── Problem Status Badge ─────────────────────────────────────────────────────

const problemStatusConfig = {
  open: { variant: 'green' as BadgeVariant, label: 'Open' },
  'in-progress': { variant: 'indigo' as BadgeVariant, label: 'In Progress' },
  solved: { variant: 'slate' as BadgeVariant, label: 'Solved' },
};

export function ProblemStatusBadge({ status }: { status: 'open' | 'in-progress' | 'solved' }) {
  const cfg = problemStatusConfig[status];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

const difficultyConfig = {
  beginner: { variant: 'green' as BadgeVariant, label: 'Beginner' },
  intermediate: { variant: 'amber' as BadgeVariant, label: 'Intermediate' },
  advanced: { variant: 'red' as BadgeVariant, label: 'Advanced' },
};

export function DifficultyBadge({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' }) {
  const cfg = difficultyConfig[difficulty];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// ─── SkillTag ─────────────────────────────────────────────────────────────────

const skillColors: BadgeVariant[] = ['indigo', 'violet', 'sky', 'teal', 'green', 'pink', 'amber'];

export function SkillTag({ skill, index = 0 }: { skill: string; index?: number }) {
  return <Badge variant={skillColors[index % skillColors.length]}>{skill}</Badge>;
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-slate-200 ${className}`} />;
}

// ─── SearchInput ─────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 placeholder:text-slate-400 transition-colors"
      />
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const modalWidths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({ open, onClose, title, children, width = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${modalWidths[width]} fade-in`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 font-display">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  change?: string;
  positive?: boolean;
}

export function StatCard({ label, value, icon, iconColor, change, positive }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <span className="w-4 h-4 text-white">{icon}</span>
        </div>
        {change && (
          <span className={`text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 font-display">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </Card>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-700 font-display">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded ${className}`} />;
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

interface DropdownItem { label: string; icon?: React.ReactNode; onClick: () => void; danger?: boolean }

export function Dropdown({ trigger, items }: { trigger: React.ReactNode; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-lg min-w-[160px] py-1 fade-in">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${item.danger ? 'text-red-600' : 'text-slate-700'}`}
            >
              {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'left-5' : 'left-1'}`} />
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
