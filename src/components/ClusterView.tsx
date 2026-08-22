import { useState } from 'react';
import { Network, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { Card, Badge, ProgressBar } from './ui';
import { type Project, type ClusterInfo, clusterPastelBg, CLUSTER_COLORS } from '@/data/mockData';

export default function ClusterView({
  clusters,
  projects,
  onSelectCluster,
}: {
  clusters: ClusterInfo[];
  projects: Project[];
  onSelectCluster?: (clusterId: string) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Cluster cards */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Network className="h-4 w-4 text-accent-300" />
          Grouped Cluster Cards
        </h3>
        {clusters.map((c) => (
          <ClusterCard key={c.id} cluster={c} onSelect={onSelectCluster} />
        ))}
      </div>

      {/* Right: Scatter plot */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles className="h-4 w-4 text-accent-300" />
          Embedding Space (2D Projection)
        </h3>
        <ScatterPreview clusters={clusters} projects={projects} />
        <div className="mt-3 flex flex-wrap gap-2">
          {clusters.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: CLUSTER_COLORS[c.id] ?? CLUSTER_COLORS.OUTLIER }} />
              {c.id === 'OUTLIER' ? 'Outliers' : `Cluster ${c.id}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClusterCard({ cluster, onSelect }: { cluster: ClusterInfo; onSelect?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const showMore = cluster.projects.length > 6;
  const visible = expanded ? cluster.projects : cluster.projects.slice(0, 5);

  return (
    <Card className={`border p-4 ${clusterPastelBg(cluster.id)}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{cluster.id === 'OUTLIER' ? 'Most Original Submissions' : `Cluster ${cluster.id}`}</span>
            <Badge color="neutral">{cluster.count} projects</Badge>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">{cluster.name} · {cluster.theme}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-500">Avg Similarity</p>
          <p className="text-sm font-bold text-accent-300">{cluster.avgSimilarity}%</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {visible.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white"
            title={`${p.teamName} — ${p.similarityScore}% similar`}
          >
            {p.teamName}
            <span className="text-accent-300">— {p.similarityScore}%</span>
          </span>
        ))}
        {showMore && !expanded && (
          <button onClick={() => setExpanded(true)} className="inline-flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-xs text-accent-300 hover:bg-white/15">
            +{cluster.projects.length - 5} more <ChevronDown className="h-3 w-3" />
          </button>
        )}
        {showMore && expanded && (
          <button onClick={() => setExpanded(false)} className="inline-flex items-center gap-0.5 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400 hover:bg-white/15">
            Show less
          </button>
        )}
      </div>

      {cluster.id !== 'OUTLIER' && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cluster.dominantTech.map((t) => (
            <Badge key={t} color="blue">{t}</Badge>
          ))}
        </div>
      )}

      {onSelect && (
        <button
          onClick={() => onSelect(cluster.id)}
          className="mt-3 text-xs text-accent-300 hover:underline"
        >
          View Cluster Details →
        </button>
      )}
    </Card>
  );
}

function ScatterPreview({ projects }: { clusters: ClusterInfo[]; projects: Project[] }) {
  // Find bounding box for mock coords
  const xs = projects.map((p) => p.x);
  const ys = projects.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const [hovered, setHovered] = useState<Project | null>(null);

  return (
    <Card className="relative aspect-square overflow-hidden p-0">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <radialGradient id="scatterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#scatterGlow)" />
        {/* Grid lines */}
        {[100, 200, 300].map((v) => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={400} stroke="#1b2438" strokeWidth="0.5" />
            <line x1={0} y1={v} x2={400} y2={v} stroke="#1b2438" strokeWidth="0.5" />
          </g>
        ))}
        {projects.map((p) => {
          const cx = ((p.x - minX) / (maxX - minX || 1)) * 360 + 20;
          const cy = ((p.y - minY) / (maxY - minY || 1)) * 360 + 20;
          const composite = (p.technicalScore + p.designScore + p.presentationScore) / 3;
          const r = 3 + (composite / 10) * 5;
          const color = CLUSTER_COLORS[p.clusterId] ?? CLUSTER_COLORS.OUTLIER;
          return (
            <circle
              key={p.id}
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              opacity={hovered?.id === p.id ? 1 : 0.75}
              stroke={hovered?.id === p.id ? '#fff' : 'transparent'}
              strokeWidth="1"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-card">
          <p className="font-semibold text-white">{hovered.teamName}</p>
          <p className="text-slate-400">{hovered.projectName}</p>
          <p className="mt-1 text-slate-500">Theme: <span className="text-slate-300">{hovered.theme}</span></p>
          <p className="text-slate-500">Cluster: <span className="text-slate-300">{hovered.clusterId === 'OUTLIER' ? 'Outlier' : `Cluster ${hovered.clusterId}`}</span></p>
          <p className="text-slate-500">Composite: <span className="text-accent-300">{((hovered.technicalScore + hovered.designScore + hovered.presentationScore) / 3).toFixed(2)}</span></p>
        </div>
      )}
      <p className="absolute bottom-2 right-3 text-[10px] text-slate-600">Mock 2D embedding projection</p>
    </Card>
  );
}

export function ThemeDistributionChart({ clusters }: { clusters: ClusterInfo[] }) {
  const sorted = [...clusters].sort((a, b) => b.count - a.count).slice(0, 8);
  return (
    <Card className="p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <TrendingUp className="h-4 w-4 text-accent-300" />
        Cluster Size Distribution
      </h4>
      <div className="space-y-2.5">
        {sorted.map((c) => {
          const max = Math.max(...clusters.map((cl) => cl.count));
          return (
            <div key={c.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{c.id === 'OUTLIER' ? 'Outliers' : `Cluster ${c.id} — ${c.name}`}</span>
                <span className="text-slate-500">{c.count} projects · {c.avgSimilarity}%</span>
              </div>
              <ProgressBar value={c.count} max={max} color={c.id === 'OUTLIER' ? 'accent' : c.id.toLowerCase() === 'a' ? 'indigo' : c.id.toLowerCase() === 'b' ? 'teal' : c.id.toLowerCase() === 'c' ? 'amber' : c.id.toLowerCase() === 'd' ? 'emerald' : c.id.toLowerCase() === 'e' ? 'rose' : 'blue'} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
