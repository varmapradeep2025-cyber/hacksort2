import { useState, useMemo } from 'react';
import {
  SlidersHorizontal, BarChart3, Network, Layers, TrendingUp,
  Inbox, Palette, Gauge, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell,
} from 'recharts';
import { Card, Badge, Button, Select, StatCard, ScorePill } from './ui';
import ClusterView, { ThemeDistributionChart } from './ClusterView';
import { type Project, type ClusterInfo, compositeScore, buildClusters, CLUSTER_COLORS, THEMES } from '@/data/mockData';

export default function OrganizerPanel({ projects }: { projects: Project[] }) {
  const [techW, setTechW] = useState(40);
  const [designW, setDesignW] = useState(30);
  const [presW, setPresW] = useState(30);
  const [clusterFilter, setClusterFilter] = useState('');
  const [showAllClusters, setShowAllClusters] = useState(false);

  const weights = { technical: techW / 100, design: designW / 100, presentation: presW / 100 };
  const clusters: ClusterInfo[] = useMemo(() => buildClusters(projects), [projects]);

  const ranked = useMemo(() => {
    return [...projects]
      .map((p) => ({ ...p, _composite: compositeScore(p, weights) }))
      .sort((a, b) => b._composite - a._composite);
  }, [projects, weights]);

  const totalSubs = projects.length;
  const themesCovered = new Set(projects.map((p) => p.theme)).size;
  const avgComposite = (ranked.reduce((s, p) => s + p._composite, 0) / ranked.length).toFixed(2);
  const totalClusters = clusters.filter((c) => c.id !== 'OUTLIER').length;
  const largestCluster = Math.max(...clusters.filter((c) => c.id !== 'OUTLIER').map((c) => c.count));
  const avgSimilarity = Math.round(clusters.filter((c) => c.id !== 'OUTLIER').reduce((s, c) => s + c.avgSimilarity, 0) / Math.max(1, totalClusters));
  const outlierCount = projects.filter((p) => p.clusterId === 'OUTLIER').length;

  const adjustWeight = (which: 'tech' | 'design' | 'pres', value: number) => {
    value = Math.max(0, Math.min(100, value));
    if (which === 'tech') setTechW(value);
    else if (which === 'design') setDesignW(value);
    else setPresW(value);
  };

  const sum = techW + designW + presW;
  const sumValid = sum === 100;

  // Scatter data
  const scatterData = useMemo(() => {
    const groups: Record<string, { teamName: string; theme: string; cluster: string; composite: number; x: number; y: number; size: number }[]> = {};
    for (const p of ranked) {
      if (clusterFilter && p.clusterId !== clusterFilter) continue;
      const key = p.clusterId;
      if (!groups[key]) groups[key] = [];
      groups[key].push({
        teamName: p.teamName, theme: p.theme,
        cluster: p.clusterId === 'OUTLIER' ? 'Outliers' : `Cluster ${p.clusterId}`,
        composite: p._composite, x: p.x, y: p.y,
        size: 1 + (p._composite / 10) * 3,
      });
    }
    return groups;
  }, [ranked, clusterFilter]);

  // Theme distribution within clusters (for bar chart)
  const themeDistData = useMemo(() => {
    const sorted = [...clusters].filter((c) => c.id !== 'OUTLIER').sort((a, b) => b.count - a.count);
    const visible = showAllClusters ? sorted : sorted.slice(0, 8);
    return visible.map((c) => {
      const themeCounts: Record<string, number> = {};
      for (const p of c.projects) themeCounts[p.theme] = (themeCounts[p.theme] || 0) + 1;
      return { cluster: `Cluster ${c.id}`, ...themeCounts, total: c.count };
    });
  }, [clusters, showAllClusters]);

  const themeColors: Record<string, string> = {
    'Crop Rotation': '#fbbf24',
    'Farming/Agriculture': '#2dd4bf',
    'Hospital Management': '#818cf8',
    'Student Attendance System': '#34d399',
    'Open Innovation': '#60a5fa',
    'Fake Documents Detection': '#fb7185',
  };

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Total Submissions" value={totalSubs} accent />
        <StatCard icon={Palette} label="Themes Covered" value={themesCovered} sublabel={`of ${THEMES.length} themes`} />
        <StatCard icon={Gauge} label="Avg Composite Score" value={avgComposite} sublabel="current weights" />
        <StatCard icon={Network} label="AI Clusters" value={totalClusters} sublabel={`${outlierCount} outliers`} />
      </div>

      {/* Weight sliders + live preview */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent-300" />
          <h3 className="text-sm font-semibold text-white">Scoring Weights</h3>
          <Badge color={sumValid ? 'success' : 'error'} className="ml-auto">
            Sum: {sum}% {sumValid ? '✓' : '(must equal 100)'}
          </Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <WeightSlider label="Technical Weight" value={techW} onChange={(v) => adjustWeight('tech', v)} color="indigo" />
          <WeightSlider label="Design / UX Weight" value={designW} onChange={(v) => adjustWeight('design', v)} color="emerald" />
          <WeightSlider label="Presentation Weight" value={presW} onChange={(v) => adjustWeight('pres', v)} color="amber" />
        </div>

        {!sumValid && (
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => {
              const remaining = 100 - techW;
              setDesignW(Math.round(remaining / 2));
              setPresW(100 - techW - Math.round(remaining / 2));
            }}>
              Auto-balance remaining {100 - techW}% across Design & Presentation
            </Button>
          </div>
        )}

        {/* Live preview ranking */}
        <div className="mt-5 border-t border-white/5 pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Live Ranking Preview</h4>
          <div className="space-y-1.5">
            {ranked.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm transition-all">
                <span className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-slate-400">{i + 1}</span>
                <span className="flex-1 truncate text-white">{p.teamName}</span>
                <span className="hidden text-xs text-slate-500 sm:inline">{p.theme}</span>
                <span className="font-bold text-accent-300">{p._composite.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Cluster Analysis section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent-300" />
            <h2 className="text-lg font-bold text-white">Cluster Analysis</h2>
          </div>
          <Select
            value={clusterFilter}
            onChange={setClusterFilter}
            placeholder="All Clusters"
            options={clusters.map((c) => ({ value: c.id, label: c.id === 'OUTLIER' ? 'Outliers' : `Cluster ${c.id}` }))}
          />
        </div>

        <ClusterView clusters={clusters} projects={projects} onSelectCluster={setClusterFilter} />
      </div>

      {/* Analytics summary bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Network} label="Total Clusters" value={totalClusters} />
        <StatCard icon={Layers} label="Largest Cluster" value={`${largestCluster} projects`} />
        <StatCard icon={TrendingUp} label="Avg Similarity" value={`${avgSimilarity}%`} />
        <StatCard icon={Eye} label="Outlier Count" value={outlierCount} sublabel="Most original" />
      </div>

      {/* Scatter plot with recharts */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-accent-300" />
            Embedding Space — Scatter Visualization
          </h3>
          {clusterFilter && (
            <Button size="sm" variant="ghost" onClick={() => setClusterFilter('')}>Clear filter</Button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#1b2438" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="dim-1" stroke="#3a4663" tick={{ fill: '#3a4663', fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="dim-2" stroke="#3a4663" tick={{ fill: '#3a4663', fontSize: 11 }} />
            <ZAxis type="number" dataKey="size" range={[40, 200]} name="score" />
            <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#27324a' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            {Object.entries(scatterData).map(([clusterId, data]) => (
              <Scatter
                key={clusterId}
                name={clusterId === 'OUTLIER' ? 'Outliers' : `Cluster ${clusterId}`}
                data={data}
                fill={CLUSTER_COLORS[clusterId] ?? CLUSTER_COLORS.OUTLIER}
                fillOpacity={0.75}
                stroke={CLUSTER_COLORS[clusterId] ?? CLUSTER_COLORS.OUTLIER}
                strokeWidth={0.5}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-xs text-slate-600">
          Point size represents composite score · Hover for details · Add react-zoom-pan-pinch for zoom/pan
        </p>
      </Card>

      {/* Theme distribution within clusters */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp className="h-4 w-4 text-accent-300" />
            Theme Distribution Within Clusters
          </h3>
          {clusters.filter((c) => c.id !== 'OUTLIER').length > 8 && (
            <Button size="sm" variant="ghost" onClick={() => setShowAllClusters((s) => !s)}>
              {showAllClusters ? 'Show top 8' : 'View all'}
              {showAllClusters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={themeDistData} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid stroke="#1b2438" strokeDasharray="3 3" />
            <XAxis dataKey="cluster" stroke="#3a4663" tick={{ fill: '#3a4663', fontSize: 11 }} />
            <YAxis stroke="#3a4663" tick={{ fill: '#3a4663', fontSize: 11 }} />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            {THEMES.map((theme) => (
              <Bar key={theme} dataKey={theme} stackId="a" fill={themeColors[theme]} radius={[0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cluster size distribution */}
      <ThemeDistributionChart clusters={clusters} />
    </div>
  );
}

function WeightSlider({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-300',
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-slate-300">{label}</label>
        <span className={`text-sm font-bold ${colors[color]}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: { payload: { teamName: string; theme: string; cluster: string; composite: number } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-card">
      <p className="font-semibold text-white">{d.teamName}</p>
      <p className="text-slate-400">Theme: {d.theme}</p>
      <p className="text-slate-400">Cluster: {d.cluster}</p>
      <p className="text-accent-300">Composite: {d.composite.toFixed(2)}</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const entries = payload.filter((p) => p.value > 0);
  return (
    <div className="rounded-lg border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-semibold text-white">{label}</p>
      {entries.map((e) => (
        <p key={e.name} className="flex items-center gap-1.5 text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
          {e.name}: {e.value}
        </p>
      ))}
    </div>
  );
}

export function SubmissionList({ projects }: { projects: Project[] }) {
  const [statusTab, setStatusTab] = useState<'All' | 'Pending' | 'Scored' | 'Reviewed'>('All');
  const [loading] = useState(false);
  const filtered = useMemo(() => statusTab === 'All' ? projects : projects.filter((p) => p.status === statusTab), [projects, statusTab]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2">
        {(['All', 'Pending', 'Scored', 'Reviewed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${statusTab === tab ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:bg-white/5'}`}
          >
            {tab} {tab !== 'All' && `(${projects.filter((p) => p.status === tab).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {filtered.slice(0, 10).map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
            <Badge color={p.status === 'Pending' ? 'warning' : p.status === 'Reviewed' ? 'success' : 'accent'}>{p.status}</Badge>
            <span className="flex-1 truncate text-white">{p.teamName}</span>
            <span className="hidden text-xs text-slate-500 sm:inline">{p.theme}</span>
            <span className="text-xs text-slate-400">{p.clusterId === 'OUTLIER' ? 'Outlier' : `Cluster ${p.clusterId}`}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
