import { useState } from 'react';
import { Star, Flag, X, ChevronDown, GitBranch, ExternalLink, Sparkles, Lightbulb } from 'lucide-react';
import { Badge, ScorePill } from './ui';
import { type Project, compositeScore, isLowComplexity } from '@/data/mockData';

export default function ProjectCard({
  project,
  weights,
  onJudge,
  rank,
}: {
  project: Project;
  weights: { technical: number; design: number; presentation: number };
  onJudge: (id: string, key: keyof Project['judge']) => void;
  rank?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const composite = compositeScore(project, weights);
  const low = isLowComplexity(project);

  return (
    <div className={`rounded-xl border bg-ink-800/80 backdrop-blur-sm transition-all duration-200 ${project.judge.rejected ? 'border-rose-400/20 opacity-60' : 'border-white/5 hover:border-accent-400/20'}`}>
      <div className="flex items-center gap-3 p-4">
        {rank !== undefined && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">
            {rank}
          </div>
        )}

        <button onClick={() => setExpanded(!expanded)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-white">{project.teamName}</span>
              {low && <Badge color="amber"><Lightbulb className="h-3 w-3" />Simplicity Lane</Badge>}
              {project.judge.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
              {project.judge.flagged && <Flag className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />}
            </div>
            <p className="truncate text-xs text-slate-400">{project.projectName} · {project.theme}</p>
          </div>
        </button>

        <div className="hidden items-center gap-1.5 sm:flex">
          <ScorePill label="Tech" value={project.technicalScore} color="indigo" />
          <ScorePill label="Design" value={project.designScore} color="emerald" />
          <ScorePill label="Pres" value={project.presentationScore} color="amber" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Composite</span>
            <span className="text-base font-bold text-accent-300">{composite.toFixed(2)}</span>
          </div>
          <Badge color="neutral" className="hidden lg:inline-flex">{project.clusterId === 'OUTLIER' ? 'Outlier' : `Cluster ${project.clusterId}`}</Badge>
        </div>

        <div className="flex items-center gap-1">
          <ActionBtn active={project.judge.starred} activeClass="text-amber-400" onClick={() => onJudge(project.id, 'starred')} title="Star">
            <Star className={`h-4 w-4 ${project.judge.starred ? 'fill-amber-400' : ''}`} />
          </ActionBtn>
          <ActionBtn active={project.judge.flagged} activeClass="text-rose-400" onClick={() => onJudge(project.id, 'flagged')} title="Flag">
            <Flag className={`h-4 w-4 ${project.judge.flagged ? 'fill-rose-400' : ''}`} />
          </ActionBtn>
          <ActionBtn active={project.judge.rejected} activeClass="text-rose-400" onClick={() => onJudge(project.id, 'rejected')} title="Reject">
            <X className="h-4 w-4" />
          </ActionBtn>
          <button onClick={() => setExpanded(!expanded)} className="ml-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile scores */}
      <div className="flex items-center gap-1.5 px-4 pb-3 sm:hidden">
        <ScorePill label="Tech" value={project.technicalScore} color="indigo" />
        <ScorePill label="Design" value={project.designScore} color="emerald" />
        <ScorePill label="Pres" value={project.presentationScore} color="amber" />
        <div className="ml-auto flex flex-col items-end">
          <span className="text-[10px] uppercase text-slate-500">Composite</span>
          <span className="text-sm font-bold text-accent-300">{composite.toFixed(2)}</span>
        </div>
      </div>

      {expanded && (
        <div className="animate-slide-up border-t border-white/5 px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <GitBranch className="h-3.5 w-3.5" /> Project Links
              </h4>
              <div className="space-y-1.5 text-sm">
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent-300 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> {project.githubUrl.replace('https://', '')}
                </a>
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent-300 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> Demo Video
                </a>
              </div>
              <h4 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <Badge key={t} color="blue">{t}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-accent-300" /> AI-Generated Notes
              </h4>
              <ul className="space-y-1.5">
                {project.aiNotes.map((note, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                    {note}
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2 text-center">
                  <p className="text-[10px] uppercase text-slate-500">Innovation</p>
                  <p className="text-sm font-bold text-indigo-300">{project.innovationScore.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 text-center">
                  <p className="text-[10px] uppercase text-slate-500">Impact</p>
                  <p className="text-sm font-bold text-emerald-300">{project.impactScore.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Problem Statement</p>
              <p className="text-sm text-slate-300">{project.problemStatement}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Solution Summary</p>
              <p className="text-sm text-slate-300">{project.solutionSummary}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-accent-500/5 px-3 py-2">
            <span className="text-xs text-slate-400">
              AI Similarity to <span className="text-white">{project.clusterName}</span>
            </span>
            <span className="text-sm font-bold text-accent-300">{project.similarityScore}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ active, activeClass, onClick, title, children }: { active: boolean; activeClass: string; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-md p-1.5 transition-colors hover:bg-white/5 ${active ? activeClass : 'text-slate-500 hover:text-white'}`}
    >
      {children}
    </button>
  );
}
