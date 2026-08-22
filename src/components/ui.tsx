import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/5 bg-ink-800/80 backdrop-blur-sm shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, color = 'accent', className = '' }: { children: ReactNode; color?: 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'indigo' | 'amber' | 'rose' | 'emerald' | 'blue'; className?: string }) {
  const colors: Record<string, string> = {
    accent: 'bg-accent-500/15 text-accent-300 border-accent-400/20',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    error: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
    neutral: 'bg-white/5 text-slate-300 border-white/10',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/20',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-400/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-accent-500 hover:bg-accent-400 text-ink-900 font-semibold shadow-glow',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
    ghost: 'hover:bg-white/5 text-slate-300 hover:text-white',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/20',
    success: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/20',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatCard({ icon: Icon, label, value, sublabel, accent = false }: { icon: LucideIcon; label: string; value: string | number; sublabel?: string; accent?: boolean }) {
  return (
    <Card className="p-4 transition-transform duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ? 'bg-accent-500/15 text-accent-300' : 'bg-white/5 text-slate-400'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-400 truncate">{label}</p>
          <p className="text-lg font-bold text-white truncate">{value}</p>
          {sublabel && <p className="text-xs text-slate-500 truncate">{sublabel}</p>}
        </div>
      </div>
    </Card>
  );
}

export function ProgressBar({ value, max = 100, color = 'accent' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors: Record<string, string> = {
    accent: 'bg-accent-400',
    indigo: 'bg-indigo-400',
    teal: 'bg-teal-400',
    amber: 'bg-amber-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    blue: 'bg-blue-400',
  };
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5">
      <div className={`h-full rounded-full transition-all duration-300 ${colors[color] ?? colors.accent}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-white/10 bg-ink-700/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-accent-400/50 focus:ring-1 focus:ring-accent-400/30 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
  className = '',
  accept,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  className?: string;
  accept?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      accept={accept}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-ink-700/80 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-1 ${error ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/30' : 'border-white/10 focus:border-accent-400/50 focus:ring-accent-400/30'} ${className}`}
    />
  );
}

export function ScorePill({ label, value, color = 'accent' }: { label: string; value: number; color?: string }) {
  const colors: Record<string, string> = {
    accent: 'text-accent-300',
    indigo: 'text-indigo-300',
    amber: 'text-amber-300',
    emerald: 'text-emerald-300',
    rose: 'text-rose-300',
    blue: 'text-blue-300',
  };
  return (
    <div className="flex flex-col items-center rounded-lg bg-white/5 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${colors[color] ?? colors.accent}`}>{value.toFixed(1)}</span>
    </div>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <Icon className="mb-3 h-8 w-8 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
