import { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Inbox, Star, Flag, X, Network,
} from 'lucide-react';
import { Card, Badge, Button, Input, Select, StatCard, EmptyState, Spinner } from './ui';
import ProjectCard from './ProjectCard';
import AIClustersSection from './AIClustersSection';
import { type Project, type ClusterInfo, compositeScore, THEMES, buildClusters } from '@/data/mockData';

type SortKey = 'composite' | 'technical' | 'design' | 'presentation' | 'newest';
const PAGE_SIZE = 12;

export default function JudgeDashboard({ projects, setProjects }: { projects: Project[]; setProjects: (updater: (prev: Project[]) => Project[]) => void }) {
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('composite');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showClusters, setShowClusters] = useState(true);
  const [loading] = useState(false);

  const clusters: ClusterInfo[] = useMemo(() => buildClusters(projects), [projects]);
  const clusterOptions = useMemo(() => clusters.map((c) => ({ value: c.id, label: c.id === 'OUTLIER' ? 'Outliers' : `Cluster ${c.id} — ${c.name}` })), [clusters]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      if (search && !p.teamName.toLowerCase().includes(search.toLowerCase()) && !p.projectName.toLowerCase().includes(search.toLowerCase())) return false;
      if (themeFilter && p.theme !== themeFilter) return false;
      if (clusterFilter && p.clusterId !== clusterFilter) return false;
      return true;
    });
    const weights = { technical: 0.4, design: 0.3, presentation: 0.3 };
    list = [...list].sort((a, b) => {
      let av: number, bv: number;
      switch (sortKey) {
        case 'technical': av = a.technicalScore; bv = b.technicalScore; break;
        case 'design': av = a.designScore; bv = b.designScore; break;
        case 'presentation': av = a.presentationScore; bv = b.presentationScore; break;
        case 'newest': av = a.createdAt; bv = b.createdAt; break;
        default: av = compositeScore(a, weights); bv = compositeScore(b, weights);
      }
      return sortDir === 'desc' ? bv - av : av - bv;
    });
    return list;
  }, [projects, search, themeFilter, clusterFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  const filterKey = `${search}-${themeFilter}-${clusterFilter}-${sortKey}-${sortDir}`;
  const lastFilterKey = useMemo(() => filterKey, [filterKey]);
  const [lastKey, setLastKey] = useState(lastFilterKey);
  if (lastKey !== lastFilterKey) {
    setLastKey(lastFilterKey);
    if (page !== 1) setPage(1);
  }

  const handleJudge = (id: string, key: keyof Project['judge']) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, judge: { ...p.judge, [key]: !p.judge[key] } } : p)));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const starredCount = projects.filter((p) => p.judge.starred).length;
  const flaggedCount = projects.filter((p) => p.judge.flagged).length;
  const rejectedCount = projects.filter((p) => p.judge.rejected).length;
  const avgComposite = (projects.reduce((s, p) => s + compositeScore(p), 0) / projects.length).toFixed(2);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Inbox} label="Total Submissions" value={projects.length} accent />
        <StatCard icon={Network} label="AI Clusters" value={clusters.filter((c) => c.id !== 'OUTLIER').length} />
        <StatCard icon={Star} label="Starred" value={starredCount} />
        <StatCard icon={Flag} label="Flagged" value={flaggedCount} />
        <StatCard icon={X} label="Avg Composite" value={avgComposite} />
      </div>

      {/* AI Clusters section */}
      {showClusters && (
        <AIClustersSection clusters={clusters} projects={projects} />
      )}

      {/* Filters bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input value={search} onChange={setSearch} placeholder="Search by team or project name..." className="pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={themeFilter} onChange={setThemeFilter} placeholder="All Themes" options={THEMES.map((t) => ({ value: t, label: t }))} />
            <Select value={clusterFilter} onChange={setClusterFilter} placeholder="All Clusters" options={clusterOptions} />
            <Select value={sortKey} onChange={(v) => { setSortKey(v as SortKey); setSortDir('desc'); }} options={[
              { value: 'composite', label: 'Composite Score' },
              { value: 'technical', label: 'Technical Score' },
              { value: 'design', label: 'Design Score' },
              { value: 'presentation', label: 'Presentation Score' },
              { value: 'newest', label: 'Newest' },
            ]} />
            <Button variant="secondary" size="md" onClick={() => setShowClusters((s) => !s)}>
              <Network className="h-4 w-4" />
              {showClusters ? 'Hide' : 'Show'} Clusters
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <p className="text-xs text-slate-400">
            Showing <span className="text-white font-medium">{paged.length}</span> of <span className="text-white font-medium">{filtered.length}</span> submissions
            {(starredCount > 0 || flaggedCount > 0 || rejectedCount > 0) && (
              <span className="ml-2">
                · <span className="text-amber-300">{starredCount} starred</span>
                <span className="mx-1">·</span>
                <span className="text-rose-300">{flaggedCount} flagged</span>
                <span className="mx-1">·</span>
                <span className="text-slate-400">{rejectedCount} rejected</span>
              </span>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => handleSort('composite')} className={`rounded px-2 py-1 text-xs ${sortKey === 'composite' ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:bg-white/5'}`}>
              Composite {sortKey === 'composite' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
            <button onClick={() => handleSort('technical')} className={`rounded px-2 py-1 text-xs ${sortKey === 'technical' ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:bg-white/5'}`}>
              Tech {sortKey === 'technical' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
            <button onClick={() => handleSort('design')} className={`rounded px-2 py-1 text-xs ${sortKey === 'design' ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:bg-white/5'}`}>
              Design {sortKey === 'design' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </Card>

      {/* Project list / loading skeletons */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-800/80 p-4">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-64 animate-pulse rounded bg-white/5" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : paged.length === 0 ? (
        <Card><EmptyState icon={Inbox} message="No submissions match your filters." /></Card>
      ) : (
        <div className="space-y-2">
          {paged.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              weights={{ technical: 0.4, design: 0.3, presentation: 0.3 }}
              onJudge={handleJudge}
              rank={sortKey === 'composite' && sortDir === 'desc' ? filtered.indexOf(p) + 1 : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${page === pageNum ? 'bg-accent-500 text-ink-900' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 7 && <span className="px-1 text-slate-500">…</span>}
          </div>
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
