import { useState } from 'react';
import { Upload, Github, Link as LinkIcon, CheckCircle2, AlertCircle, Loader2, FileText, Send } from 'lucide-react';
import { Button, Card, Input, Select } from './ui';
import { THEMES, type Theme } from '@/data/mockData';

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

export default function SubmissionForm() {
  const [teamName, setTeamName] = useState('');
  const [theme, setTheme] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [pptName, setPptName] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const githubError = touched && githubUrl.length > 0 && !GITHUB_URL_REGEX.test(githubUrl);
  const teamError = touched && teamName.trim().length < 2;
  const themeError = touched && theme === '';
  const canSubmit = teamName.trim().length >= 2 && theme !== '' && GITHUB_URL_REGEX.test(githubUrl) && demoUrl.trim().length > 0;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPptName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setTeamName(''); setTheme(''); setGithubUrl(''); setPptName(''); setDemoUrl('');
    setSubmitted(false); setTouched(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl animate-slide-up">
        <Card className="overflow-hidden">
          <div className="border-b border-white/5 bg-accent-500/5 px-6 py-4">
            <div className="flex items-center gap-2 text-accent-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Submission Status</span>
            </div>
          </div>
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15">
              <Loader2 className="h-8 w-8 animate-spin text-accent-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Submission received — processing...</h3>
            <p className="mb-1 text-sm text-slate-400">Team <span className="text-white font-medium">{teamName}</span> · {theme}</p>
            <p className="mb-6 text-sm text-slate-500">AI is now analyzing your repository, README, and demo. You'll see scores and cluster assignment shortly.</p>
            <div className="mx-auto mb-6 max-w-xs space-y-2 text-left">
              <ProcessingStep label="Repository cloned & parsed" done />
              <ProcessingStep label="Extracting tech stack & architecture" active />
              <ProcessingStep label="Computing similarity & cluster" />
              <ProcessingStep label="Generating AI judge notes" />
            </div>
            <Button onClick={handleReset} variant="secondary">Submit Another Project</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Submit Your Project</h1>
        <p className="mt-1 text-sm text-slate-400">Enter your team's details below. AI will analyze your submission and place it among similar projects.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Team Name" icon={null} error={teamError ? 'Team name must be at least 2 characters' : ''}>
            <Input value={teamName} onChange={setTeamName} placeholder="e.g. Pixelverse" error={teamError} />
          </Field>

          <Field label="Theme" icon={null} error={themeError ? 'Please select a theme' : ''}>
            <Select
              value={theme}
              onChange={setTheme}
              placeholder="Select a theme"
              options={THEMES.map((t: Theme) => ({ value: t, label: t }))}
              className={`w-full ${themeError ? 'border-rose-400/60' : ''}`}
            />
          </Field>

          <Field label="GitHub Repo URL" icon={<Github className="h-4 w-4 text-slate-500" />} error={githubError ? 'Enter a valid GitHub URL (https://github.com/team/repo)' : ''}>
            <Input value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/your-team/your-repo" error={githubError} />
          </Field>

          <Field label="PPT Upload" icon={<FileText className="h-4 w-4 text-slate-500" />} error="">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-ink-700/80 px-3 py-2.5 text-sm text-slate-400 transition-colors hover:border-accent-400/40 hover:bg-ink-700">
              <Upload className="h-4 w-4 text-accent-300" />
              <span className={pptName ? 'text-white' : ''}>{pptName || 'Click to upload .pptx / .pdf (max 10MB)'}</span>
              <input type="file" accept=".pptx,.pdf,.ppt" className="hidden" onChange={handleFile} />
            </label>
          </Field>

          <Field label="Demo Video Link" icon={<LinkIcon className="h-4 w-4 text-slate-500" />} error="">
            <Input value={demoUrl} onChange={setDemoUrl} placeholder="https://youtu.be/..." type="url" />
          </Field>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" disabled={!canSubmit && touched}>
              <Send className="h-4 w-4" />
              Submit Project
            </Button>
            {touched && !canSubmit && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-300">
                <AlertCircle className="h-3.5 w-3.5" />
                Please fix the highlighted fields before submitting.
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, icon, error, children }: { label: string; icon: React.ReactNode; error: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-300"><AlertCircle className="h-3 w-3" />{error}</p>}
    </div>
  );
}

function ProcessingStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : active ? (
        <Loader2 className="h-4 w-4 animate-spin text-accent-300" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-white/15" />
      )}
      <span className={done ? 'text-slate-400 line-through' : active ? 'text-white' : 'text-slate-500'}>{label}</span>
    </div>
  );
}
