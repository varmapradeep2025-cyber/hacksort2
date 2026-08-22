import { useState } from 'react';
import {
  Network, ChevronRight, X, GitCompare, Sparkles, AlertTriangle,
  Cpu, Layers, ScanSearch, Workflow, ListTree, BarChart3,
} from 'lucide-react';
import { Card, Badge, Button, ScorePill } from './ui';
import { type Project, type ClusterInfo, CLUSTER_COLORS, findHighSimilarityPairs, compositeScore } from '@/data/mockData';

export default function AIClustersSection({ clusters, projects }: { clusters: ClusterInfo[]; projects: Project[] }) {
  const [selectedCluster, setSelectedCluster] = useState<ClusterInfo | null>(null);
  const [comparePair, setComparePair] = useState<{ a: Project; b: Project; similarity: number; sharedConcepts: string[] } | null>(null);

  const pairs = findHighSimilarityPairs(projects);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 bg-accent-500/5 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15">
              <Network className="h-4 w-4 text-accent-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Project Clusters</h2>
              <p className="text-xs text-slate-400">Submissions grouped by semantic similarity</p>
            </div>
          </div>
          <Badge color="accent"><Sparkles className="h-3 w-3" />AI Detected</Badge>
        </div>

        {/* Cluster cards grid */}
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {clusters.filter((c) => c.id !== 'OUTLIER').map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c)}
              className="group rounded-xl border border-white/5 bg-ink-700/50 p-4 text-left transition-all hover:border-accent-400/30 hover:bg-ink-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ background: `${CLUSTER_COLORS[c.id]}22`, color: CLUSTER_COLORS[c.id] }}>
                    {c.id}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">Cluster {c.id}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-300" />
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="text-slate-400">{c.count} projects</span>
                <span className="text-accent-300">Similarity: {c.avgSimilarity}%</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {c.dominantTech.slice(0, 3).map((t) => (
                  <Badge key={t} color="neutral">{t}</Badge>
                ))}
              </div>
              <div className="mt-2 text-xs text-accent-300 opacity-0 transition-opacity group-hover:opacity-100">View Cluster →</div>
            </button>
          ))}
        </div>
      </Card>

      {/* High similarity alerts */}
      {pairs.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Highly Similar Submissions
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {pairs.slice(0, 4).map((pair, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-amber-400/15 bg-amber-500/5 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">
                    <span className="font-medium">{pair.a.teamName}</span>
                    <span className="mx-1.5 text-slate-500">↔</span>
                    <span className="font-medium">{pair.b.teamName}</span>
                  </p>
                  <p className="text-xs text-amber-300">{pair.similarity}% similar · {pair.sharedConcepts.length} shared tech</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setComparePair(pair)}>
                  <GitCompare className="h-3 w-3" /> Compare
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How AI Clustering Works */}
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">How AI Clustering Works</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { icon: ScanSearch, label: 'Data Selection' },
            { icon: Cpu, label: 'Preprocessing' },
            { icon: Layers, label: 'Feature Extraction' },
            { icon: GitCompare, label: 'Similarity Analysis' },
            { icon: ListTree, label: 'Project Clustering' },
            { icon: BarChart3, label: 'Cluster Insights' },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-slate-300">
                <step.icon className="h-3.5 w-3.5 text-accent-300" />
                {step.label}
              </div>
              {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-slate-600" />}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          AI analyzes project descriptions, problem statements, solutions and technologies to identify submissions with similar concepts.
        </p>
      </Card>

      {/* Cluster Detail Panel */}
      {selectedCluster && (
        <ClusterDetailPanel
          cluster={selectedCluster}
          onClose={() => setSelectedCluster(null)}
          onCompare={(pair) => setComparePair(pair)}
        />
      )}

      {/* Compare Modal */}
      {comparePair && (
        <CompareModal pair={comparePair} onClose={() => setComparePair(null)} />
      )}
    </div>
  );
}

function ClusterDetailPanel({ cluster, onClose, onCompare }: {
  cluster: ClusterInfo;
  onClose: () => void;
  onCompare: (pair: { a: Project; b: Project; similarity: number; sharedConcepts: string[] }) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="my-8 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4" style={{ background: `${CLUSTER_COLORS[cluster.id]}11` }}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold" style={{ background: `${CLUSTER_COLORS[cluster.id]}22`, color: CLUSTER_COLORS[cluster.id] }}>
                {cluster.id}
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Cluster {cluster.id} — {cluster.name}</h2>
                <p className="text-xs text-slate-400">{cluster.count} projects · {cluster.avgSimilarity}% avg similarity</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Common Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {cluster.dominantTech.map((t) => <Badge key={t} color="blue">{t}</Badge>)}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Common Concepts</h4>
              <div className="flex flex-wrap gap-1.5">
                {cluster.concepts.map((c) => <Badge key={c} color="accent">{c}</Badge>)}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 px-5 py-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Projects in this Cluster ({cluster.projects.length})
            </h4>
            <div className="space-y-2">
              {cluster.projects.map((p) => {
                const pair = findHighSimilarityPairs([p, ...cluster.projects.filter((x) => x.id !== p.id)]).find((pr) => pr.a.id === p.id || pr.b.id === p.id);
                return (
                  <div key={p.id} className="rounded-lg border border-white/5 bg-ink-700/50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{p.teamName}</span>
                          <Badge color="accent">{p.similarityScore}%</Badge>
                          {pair && <Badge color="warning">High Similarity</Badge>}
                        </div>
                        <p className="text-xs text-slate-400">{p.projectName}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ScorePill label="Tech" value={p.technicalScore} color="indigo" />
                        <ScorePill label="Design" value={p.designScore} color="emerald" />
                        <ScorePill label="Pres" value={p.presentationScore} color="amber" />
                        <div className="flex flex-col items-center rounded-lg bg-accent-500/10 px-2 py-1">
                          <span className="text-[10px] uppercase text-slate-500">Overall</span>
                          <span className="text-sm font-bold text-accent-300">{compositeScore(p).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{p.problemStatement}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {p.techStack.map((t) => <Badge key={t} color="neutral">{t}</Badge>)}
                      {pair && (
                        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => onCompare(pair)}>
                          <GitCompare className="h-3 w-3" /> Compare
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CompareModal({ pair, onClose }: { pair: { a: Project; b: Project; similarity: number; sharedConcepts: string[] }; onClose: () => void }) {
  const { a, b } = pair;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-amber-500/5 px-5 py-3">
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Project Comparison</h3>
              <Badge color="warning">{pair.similarity}% Similar</Badge>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {[a, b].map((p, idx) => (
              <div key={p.id} className="rounded-lg border border-white/5 bg-ink-700/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">{p.teamName}</span>
                  <Badge color="accent">{p.similarityScore}%</Badge>
                </div>
                <p className="mb-2 text-xs text-slate-400">{p.projectName}</p>
                <p className="mb-3 text-xs text-slate-400">{p.problemStatement}</p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {p.techStack.map((t) => (
                    <Badge key={t} color={pair.sharedConcepts.includes(t) ? 'accent' : 'neutral'}>{t}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <ScorePill label="Tech" value={p.technicalScore} color="indigo" />
                  <ScorePill label="Design" value={p.designScore} color="emerald" />
                  <ScorePill label="Pres" value={p.presentationScore} color="amber" />
                </div>
                {idx === 0 && (
                  <p className="mt-3 text-[10px] text-slate-600">↔ Compare with {b.teamName}</p>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 px-5 py-3">
            <p className="text-xs font-semibold text-slate-400">Both projects share:</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {pair.sharedConcepts.length > 0 ? pair.sharedConcepts.map((t) => <Badge key={t} color="accent">{t}</Badge>) : <span className="text-xs text-slate-500">No shared technologies detected</span>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function WorkflowPipeline() {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Judge Workflow</h3>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['All Submissions', 'AI Clusters', 'Select Cluster', 'View Similar', 'Compare', 'Evaluate', 'Assign Score'].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <span className={`rounded-lg px-2.5 py-1.5 ${i === 1 ? 'bg-accent-500/15 text-accent-300' : 'bg-white/5 text-slate-300'}`}>{step}</span>
            {i < arr.length - 1 && <Workflow className="h-3 w-3 text-slate-600" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
