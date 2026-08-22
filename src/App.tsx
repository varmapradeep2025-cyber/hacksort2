import { useState, useMemo } from 'react';
import { Gavel, Users, Settings, Activity, LogOut } from 'lucide-react';
import ThreeDWaveBackground from '@/components/ThreeDWaveBackground';
import SubmissionForm from '@/components/SubmissionForm';
import JudgeDashboard from '@/components/JudgeDashboard';
import OrganizerPanel from '@/components/OrganizerPanel';
import LoginPage from '@/components/LoginPage';
import { useAuth } from '@/components/AuthProvider';
import { generateProjects, type Project } from '@/data/mockData';

type View = 'participant' | 'judge' | 'organizer';

const NAV: { id: View; label: string; icon: typeof Gavel }[] = [
  { id: 'participant', label: 'Participant', icon: Users },
  { id: 'judge', label: 'Judge', icon: Gavel },
  { id: 'organizer', label: 'Organizer', icon: Settings },
];

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>('judge');
  const [projects, setProjects] = useState<Project[]>(() => generateProjects(50));

  const waveVariant = view === 'judge' ? 'judge' : view === 'participant' ? 'participant' : 'organizer';

  const scoredCount = useMemo(() => projects.filter((p) => p.status === 'Scored' || p.status === 'Reviewed').length, [projects]);

  const needsAuth = (view === 'judge' || view === 'organizer') && !user;

  const handleNav = (v: View) => {
    setView(v);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <ThreeDWaveBackground variant="judge" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-ink-900/40 via-ink-900/60 to-ink-900/80" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="h-5 w-5 animate-pulse-soft text-accent-300" />
            <span className="text-sm">Loading HackSort...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show login page for gated views
  if (needsAuth) {
    return (
      <div className="relative min-h-screen">
        <ThreeDWaveBackground variant={view === 'judge' ? 'judge' : 'organizer'} />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-ink-900/40 via-ink-900/60 to-ink-900/80" />
        <LoginPage role={view === 'judge' ? 'judge' : 'organizer'} onBack={() => setView('participant')} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-200">
      {/* 3D animated wave background — fixed, behind everything */}
      <ThreeDWaveBackground variant={waveVariant} />
      {/* Dark atmospheric overlay for readability */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-ink-900/40 via-ink-900/60 to-ink-900/80" />

      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15 shadow-glow">
              <Activity className="h-5 w-5 text-accent-300" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none text-white">HackSort</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">AI Triage Dashboard</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-xl border border-white/5 bg-ink-800/50 p-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  view === item.id
                    ? 'bg-accent-500 text-ink-900 shadow-glow'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user && (view === 'judge' || view === 'organizer') ? (
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 lg:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {user.email}
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 lg:flex">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent-400" />
                {scoredCount}/{projects.length} scored
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {view === 'participant' && <SubmissionForm />}
        {view === 'judge' && <JudgeDashboard projects={projects} setProjects={setProjects} />}
        {view === 'organizer' && <OrganizerPanel projects={projects} />}
      </main>

      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-600">
        HackSort · AI-Powered Hackathon Triage · Mock data for demonstration
      </footer>
    </div>
  );
}
