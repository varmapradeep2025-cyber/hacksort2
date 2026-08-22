export type Theme =
  | 'Crop Rotation'
  | 'Farming/Agriculture'
  | 'Hospital Management'
  | 'Student Attendance System'
  | 'Open Innovation'
  | 'Fake Documents Detection';

export type ProjectStatus = 'Pending' | 'Scored' | 'Reviewed';

export interface JudgeState {
  starred: boolean;
  flagged: boolean;
  rejected: boolean;
}

export interface Project {
  id: string;
  teamName: string;
  projectName: string;
  theme: Theme;
  githubUrl: string;
  demoUrl: string;
  problemStatement: string;
  solutionSummary: string;
  techStack: string[];
  aiNotes: string[];
  technicalScore: number;
  designScore: number;
  presentationScore: number;
  innovationScore: number;
  impactScore: number;
  status: ProjectStatus;
  clusterId: string;
  clusterName: string;
  similarityScore: number;
  x: number;
  y: number;
  createdAt: number;
  judge: JudgeState;
}

export interface ClusterInfo {
  id: string;
  name: string;
  theme: Theme;
  count: number;
  avgSimilarity: number;
  dominantTech: string[];
  concepts: string[];
  color: string;
  projects: Project[];
}

export const THEMES: Theme[] = [
  'Crop Rotation',
  'Farming/Agriculture',
  'Hospital Management',
  'Student Attendance System',
  'Open Innovation',
  'Fake Documents Detection',
];

const CLUSTER_DEFS: { id: string; name: string; theme: Theme; concepts: string[]; tech: string[] }[] = [
  { id: 'A', name: 'Healthcare & Medical AI', theme: 'Hospital Management', concepts: ['Healthcare automation', 'Disease detection', 'Patient management', 'Medical analytics'], tech: ['Python', 'React', 'ML', 'OpenCV'] },
  { id: 'B', name: 'Agriculture & Smart Farming', theme: 'Farming/Agriculture', concepts: ['Smart irrigation', 'Crop health monitoring', 'Yield prediction', 'IoT sensors'], tech: ['Python', 'IoT', 'TensorFlow', 'React'] },
  { id: 'C', name: 'Crop Cycle Optimization', theme: 'Crop Rotation', concepts: ['Soil nutrient balancing', 'Crop sequencing', 'Yield planning', 'Sustainable farming'], tech: ['Python', 'ML', 'Pandas', 'React'] },
  { id: 'D', name: 'Education & Learning Systems', theme: 'Student Attendance System', concepts: ['Face recognition attendance', 'Automated roll call', 'Analytics dashboards', 'Fraud prevention'], tech: ['Python', 'OpenCV', 'React', 'Node.js'] },
  { id: 'E', name: 'Document Intelligence & Verification', theme: 'Fake Documents Detection', concepts: ['Document forgery detection', 'OCR analysis', 'Watermark verification', 'Fraud analytics'], tech: ['Python', 'OpenCV', 'TensorFlow', 'FastAPI'] },
  { id: 'F', name: 'Open Innovation Labs', theme: 'Open Innovation', concepts: ['Cross-domain solutions', 'Creative tooling', 'Community platforms', 'Novel integrations'], tech: ['React', 'Node.js', 'Python', 'TypeScript'] },
];

export const CLUSTER_COLORS: Record<string, string> = {
  A: '#818cf8', // indigo
  B: '#2dd4bf', // teal
  C: '#fbbf24', // amber
  D: '#34d399', // emerald
  E: '#fb7185', // rose
  F: '#60a5fa', // blue
  OUTLIER: '#94a3b8', // slate
};

const CLUSTER_PASTEL_BG: Record<string, string> = {
  A: 'bg-indigo-500/10 border-indigo-400/20',
  B: 'bg-teal-500/10 border-teal-400/20',
  C: 'bg-amber-500/10 border-amber-400/20',
  D: 'bg-emerald-500/10 border-emerald-400/20',
  E: 'bg-rose-500/10 border-rose-400/20',
  F: 'bg-blue-500/10 border-blue-400/20',
  OUTLIER: 'bg-slate-500/10 border-slate-400/20',
};

export function clusterPastelBg(clusterId: string): string {
  return CLUSTER_PASTEL_BG[clusterId] ?? CLUSTER_PASTEL_BG.OUTLIER;
}

const TEAM_PREFIXES = ['Pixel', 'Spark', 'Nova', 'Quantum', 'Hyper', 'Cyber', 'Neural', 'Solar', 'Lunar', 'Echo', 'Apex', 'Vertex', 'Nexus', 'Orbit', 'Pulse', 'Flux', 'Zenith', 'Atlas', 'Cipher', 'Vortex'];
const TEAM_SUFFIXES = ['verse', 'Sync', 'Labs', 'Works', 'Forge', 'Hub', 'Core', 'Bit', 'Wave', 'Grid', 'Link', 'Ops', 'AI', 'X', 'Stack', 'Craft', 'Base', 'Node', 'Flow', 'Mind'];

const PROJECT_NAMES_BY_THEME: Record<Theme, string[]> = {
  'Hospital Management': ['AI Hospital Manager', 'MediFlow', 'PatientPilot', 'CareSync AI', 'HospitalIQ', 'MedTrack Neural', 'HealthOps Cloud'],
  'Farming/Agriculture': ['SmartFarm AI', 'AgriSense', 'CropGuard', 'FarmVision', 'GreenField AI', 'AgroPulse', 'FieldAnalytics'],
  'Crop Rotation': ['CropCycle Optimizer', 'RotatAI', 'SoilSmart', 'CropPlanner AI', 'TerraCycle', 'AgriRotate'],
  'Student Attendance System': ['FaceRoll', 'AttendAI', 'ClassPulse', 'SmartRoll Call', 'PresenceAI', 'EduTrack Vision'],
  'Fake Documents Detection': ['DocuShield', 'ForgeryAI', 'VerifyNet', 'DocCheck ML', 'AuthDoc AI', 'ForgeryGuard'],
  'Open Innovation': ['InnoLab', 'OpenForge', 'CreativeStack', 'HackBoard', 'IdeaForge', 'OpenMind AI'],
};

const AI_NOTE_POOL = [
  'Strong commit history, modular architecture, README lacks setup instructions',
  'Well-documented code with clear API design, tests are sparse',
  'Frontend polished, backend minimal — consider server-side validation',
  'Novel approach to the problem, implementation needs optimization',
  'Good use of ML pipeline, model accuracy unverified',
  'Clean component separation, state management could be improved',
  'Impressive demo video, repo has incomplete dependencies',
  'Solid data pipeline, visualization layer underdeveloped',
  'Modular architecture with good separation of concerns',
  'README is thorough, but code style is inconsistent across files',
];

const PROBLEM_TEMPLATES: Record<Theme, string[]> = {
  'Hospital Management': [
    'Hospital management is inefficient with manual patient records causing delays and errors in care coordination.',
    'Patient data is scattered across systems making it hard for doctors to get a unified health view.',
    'Emergency response coordination is slow due to lack of real-time bed and resource tracking.',
  ],
  'Farming/Agriculture': [
    'Farmers lack real-time insights into soil health, leading to over-fertilization and reduced yields.',
    'Irrigation is wasteful because farmers water on fixed schedules regardless of actual soil moisture.',
    'Pest detection happens too late, causing crop losses that could have been prevented with early alerts.',
  ],
  'Crop Rotation': [
    'Farmers follow rigid crop rotation schedules ignoring soil nutrient data, degrading land over time.',
    'Lack of data-driven crop sequencing leads to nutrient depletion and falling yields season after season.',
    'Smallholders cannot access agronomy expertise to plan sustainable rotation cycles.',
  ],
  'Student Attendance System': [
    'Manual attendance is time-consuming and prone to proxy attendance in large classrooms.',
    'Schools lack reliable automated attendance with parent notification and analytics.',
    'Existing attendance systems are vulnerable to buddy punching and lack facial verification.',
  ],
  'Fake Documents Detection': [
    'Manual document verification is slow and error-prone, enabling fraud in admissions and finance.',
    'Forged certificates and IDs are hard to detect without ML-based watermark and content analysis.',
    'Organizations need automated verification of identity documents at scale.',
  ],
  'Open Innovation': [
    'Communities need accessible tools to prototype and share solutions to local problems.',
    'Cross-domain ideas lack a platform that connects hackers, mentors, and resources.',
    'Innovation pipelines are opaque — teams struggle to track progress from idea to demo.',
  ],
};

const SOLUTION_TEMPLATES: Record<Theme, string[]> = {
  'Hospital Management': [
    'A unified hospital management dashboard with AI patient prioritization and real-time bed tracking.',
    'An ML-powered patient record system that flags anomalies and auto-suggests care protocols.',
    'Real-time emergency coordination platform integrating bed availability, staff, and ambulance dispatch.',
  ],
  'Farming/Agriculture': [
    'An IoT + ML platform that monitors soil moisture and nutrients, sending adaptive irrigation recommendations.',
    'A computer vision app that detects crop diseases from leaf photos and recommends treatments.',
    'A smart irrigation controller using sensor data and weather forecasts to optimize water use.',
  ],
  'Crop Rotation': [
    'A data-driven crop rotation planner using soil tests and historical yield data to recommend optimal sequences.',
    'An ML model that predicts nutrient depletion and suggests crop sequences to maintain soil health.',
    'A mobile advisor app giving smallholders personalized rotation plans based on local soil data.',
  ],
  'Student Attendance System': [
    'A face-recognition attendance system with real-time dashboards and automated parent SMS alerts.',
    'An automated roll-call app using computer vision with anti-spoofing and analytics for schools.',
    'A classroom attendance platform with biometric verification and trend analytics for administrators.',
  ],
  'Fake Documents Detection': [
    'An ML-based document verifier that analyzes watermarks, fonts, and metadata to detect forgery.',
    'An OCR + CV pipeline that cross-checks document content against templates to flag anomalies.',
    'A verification API that scores document authenticity using texture analysis and security features.',
  ],
  'Open Innovation': [
    'A collaborative prototyping platform connecting hackers, mentors, and judges with live progress tracking.',
    'An idea-to-demo pipeline tool with task boards, mentor matching, and pitch prep resources.',
    'A community platform for sharing open-source hackathon projects with built-in feedback loops.',
  ],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function compositeScore(p: Pick<Project, 'technicalScore' | 'designScore' | 'presentationScore'>, weights = { technical: 0.4, design: 0.3, presentation: 0.3 }) {
  return clamp(p.technicalScore * weights.technical + p.designScore * weights.design + p.presentationScore * weights.presentation, 0, 10);
}

export function generateProjects(count = 50): Project[] {
  const rng = seededRandom(42);
  const projects: Project[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const clusterDef = CLUSTER_DEFS[i % CLUSTER_DEFS.length];
    const theme = clusterDef.theme;
    const isOutlier = rng() < 0.08;
    const clusterId = isOutlier ? 'OUTLIER' : clusterDef.id;
    const clusterName = isOutlier ? 'Most Original Submissions' : clusterDef.name;

    const techScore = clamp(5 + rng() * 4.5, 1, 10);
    const designScore = clamp(5 + rng() * 4.5, 1, 10);
    const presScore = clamp(5 + rng() * 4.5, 1, 10);
    const innovationScore = clamp(5 + rng() * 4.5, 1, 10);
    const impactScore = clamp(5 + rng() * 4.5, 1, 10);
    const status: ProjectStatus = i % 7 === 0 ? 'Pending' : i % 3 === 0 ? 'Reviewed' : 'Scored';

    // Generate x/y coordinates clustered around cluster centroid
    const clusterIdx = CLUSTER_DEFS.findIndex((c) => c.id === clusterDef.id);
    const angle = (clusterIdx / CLUSTER_DEFS.length) * Math.PI * 2;
    const cx = Math.cos(angle) * 40;
    const cy = Math.sin(angle) * 40;
    const x = isOutlier ? (rng() - 0.5) * 90 : cx + (rng() - 0.5) * 18;
    const y = isOutlier ? (rng() - 0.5) * 90 : cy + (rng() - 0.5) * 18;

    const teamName = `${pick(TEAM_PREFIXES, rng)}${pick(TEAM_SUFFIXES, rng)}`;
    const projectName = pick(PROJECT_NAMES_BY_THEME[theme], rng);

    projects.push({
      id: `proj-${i + 1}`,
      teamName,
      projectName,
      theme,
      githubUrl: `https://github.com/${teamName.toLowerCase()}/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
      demoUrl: `https://youtu.be/${Math.random().toString(36).slice(2, 10)}`,
      problemStatement: pick(PROBLEM_TEMPLATES[theme], rng),
      solutionSummary: pick(SOLUTION_TEMPLATES[theme], rng),
      techStack: pickN(clusterDef.tech, 3 + Math.floor(rng() * 2), rng),
      aiNotes: pickN(AI_NOTE_POOL, 2, rng),
      technicalScore: Number(techScore.toFixed(1)),
      designScore: Number(designScore.toFixed(1)),
      presentationScore: Number(presScore.toFixed(1)),
      innovationScore: Number(innovationScore.toFixed(1)),
      impactScore: Number(impactScore.toFixed(1)),
      status,
      clusterId,
      clusterName,
      similarityScore: isOutlier ? 30 + Math.floor(rng() * 20) : 70 + Math.floor(rng() * 25),
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      createdAt: now - i * 3600000,
      judge: { starred: false, flagged: false, rejected: false },
    });
  }
  return projects;
}

export function buildClusters(projects: Project[]): ClusterInfo[] {
  const map = new Map<string, ClusterInfo>();
  for (const p of projects) {
    if (!map.has(p.clusterId)) {
      const def = CLUSTER_DEFS.find((c) => c.id === p.clusterId);
      map.set(p.clusterId, {
        id: p.clusterId,
        name: p.clusterId === 'OUTLIER' ? 'Most Original Submissions' : def?.name ?? `Cluster ${p.clusterId}`,
        theme: p.theme,
        count: 0,
        avgSimilarity: 0,
        dominantTech: def?.tech ?? [],
        concepts: def?.concepts ?? ['Diverse approaches'],
        color: CLUSTER_COLORS[p.clusterId] ?? CLUSTER_COLORS.OUTLIER,
        projects: [],
      });
    }
    const c = map.get(p.clusterId)!;
    c.projects.push(p);
    c.count++;
  }
  for (const c of map.values()) {
    c.avgSimilarity = Math.round(c.projects.reduce((s, p) => s + p.similarityScore, 0) / c.projects.length);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function findHighSimilarityPairs(projects: Project[], threshold = 88): { a: Project; b: Project; similarity: number; sharedConcepts: string[] }[] {
  const pairs: { a: Project; b: Project; similarity: number; sharedConcepts: string[] }[] = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const a = projects[i];
      const b = projects[j];
      if (a.clusterId !== b.clusterId || a.clusterId === 'OUTLIER') continue;
      const sim = Math.max(a.similarityScore, b.similarityScore);
      if (sim >= threshold) {
        pairs.push({ a, b, similarity: sim, sharedConcepts: a.techStack.filter((t) => b.techStack.includes(t)) });
      }
    }
  }
  return pairs.slice(0, 6);
}

export function isLowComplexity(p: Project): boolean {
  return p.technicalScore < 6.5 && p.technicalScore >= 4;
}
