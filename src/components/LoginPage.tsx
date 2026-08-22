import { useState, type FormEvent } from 'react';
import { Activity, Mail, Lock, LogIn, UserPlus, ArrowLeft, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Button, Input } from './ui';

type Role = 'judge' | 'organizer';

export default function LoginPage({ role, onBack }: { role: Role; onBack: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const roleLabel = role === 'judge' ? 'Judge' : 'Organizer';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        {/* Back link */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="rounded-2xl border border-white/5 bg-ink-800/80 backdrop-blur-md shadow-card overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/5 px-6 py-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15 shadow-glow">
              <Activity className="h-6 w-6 text-accent-300" />
            </div>
            <h1 className="text-xl font-bold text-white">HackSort</h1>
            <p className="text-xs uppercase tracking-widest text-slate-500">AI Triage Dashboard</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              {roleLabel} Portal
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Mail className="h-4 w-4 text-slate-500" /> Email
              </label>
              <Input
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Lock className="h-4 w-4 text-slate-500" /> Password
              </label>
              <Input
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type="password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>
              ) : mode === 'signin' ? (
                <><LogIn className="h-4 w-4" /> Sign In</>
              ) : (
                <><UserPlus className="h-4 w-4" /> Create Account</>
              )}
            </Button>

            <p className="text-center text-sm text-slate-400">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                className="font-medium text-accent-300 hover:underline"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
