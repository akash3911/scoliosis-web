type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "cobb-angle",
    title: "Cobb Angle",
    content:
      "The Cobb angle is the standard measure used to estimate scoliosis curve severity. It is formed from the most tilted vertebrae at the top and bottom of a curve and is commonly used to track progression over time.",
    keywords: ["cobb", "angle", "severity", "curve", "vertebrae"],
  },
  {
    id: "curve-c",
    title: "C-Shape Curve",
    content:
      "A C-shaped curve usually has one dominant arc. In reports, the largest Cobb angle typically corresponds to the main structural curve that needs the closest review.",
    keywords: ["c", "curve", "main", "dominant", "structural"],
  },
  {
    id: "curve-s",
    title: "S-Shape Curve",
    content:
      "An S-shaped curve has two compensatory arcs that bend in opposite directions. It often involves a proximal thoracic component and a thoracolumbar or lumbar component.",
    keywords: ["s", "curve", "proximal", "thoracic", "lumbar", "compensatory"],
  },
  {
    id: "severity-guide",
    title: "Severity Guide",
    content:
      "Angle thresholds used for interpretation: angle < 10 Normal, angle < 25 Mild, angle < 40 Moderate, otherwise Severe. Normal means the curve is within an expected range, Mild usually means a small curve that should be monitored, Moderate indicates a more noticeable deformity that deserves follow-up, and Severe suggests a large curve that warrants close clinical review.",
    keywords: ["normal", "mild", "moderate", "severe", "clinical", "attention", "large", "threshold"],
  },
  {
    id: "regional-reading",
    title: "Regional Reading of PT MT TL/L",
    content:
      "PT reflects proximal thoracic behavior, MT usually captures the dominant thoracic curve, and TL/L captures thoracolumbar or lumbar contribution. Comparing PT, MT, and TL/L helps identify which region drives overall severity.",
    keywords: ["pt", "mt", "tl", "tl/l", "thoracic", "lumbar", "dominant", "region"],
  },
  {
    id: "mild-management",
    title: "When Results Are Mild",
    content:
      "Mild curves are commonly observed with periodic follow-up imaging and clinical assessment. Trend over time is often more important than a single isolated value.",
    keywords: ["mild", "follow-up", "trend", "monitoring", "periodic"],
  },
  {
    id: "normal-management",
    title: "When Results Are Normal",
    content:
      "Values in the normal range usually do not drive deformity and are often not the primary treatment target.",
    keywords: ["normal", "within", "range", "no concern", "not primary"],
  },
  {
    id: "moderate-management",
    title: "When Results Are Moderate",
    content:
      "Moderate curves usually require closer surveillance and clinical decision-making. Progression risk and patient growth status are important factors for management planning.",
    keywords: ["moderate", "surveillance", "progression", "growth", "management"],
  },
  {
    id: "bracing-range",
    title: "Bracing Consideration Range",
    content:
      "For growing patients, Cobb angles in the 25-40 degree range are commonly considered for bracing discussions under widely used scoliosis management guidance.",
    keywords: ["brace", "bracing", "25", "40", "moderate", "guideline", "srs"],
  },
  {
    id: "balanced-s-curve",
    title: "Balanced S-Curve Pattern",
    content:
      "When thoracic and thoracolumbar/lumbar magnitudes are close, the pattern may represent a balanced S-curve with compensatory behavior between regions.",
    keywords: ["balanced", "s-curve", "compensatory", "mt", "tl", "close"],
  },
  {
    id: "risser-stage-note",
    title: "Risser Stage Relevance",
    content:
      "Skeletal maturity (for example, Risser stage) strongly influences progression risk and treatment planning, so it should be considered during clinical decision-making.",
    keywords: ["risser", "skeletal", "maturity", "progression", "decision"],
  },
  {
    id: "severe-management",
    title: "When Results Are Severe",
    content:
      "Severe curves warrant prompt specialist review. The primary clinical focus is to evaluate progression, deformity impact, and treatment options in a timely manner.",
    keywords: ["severe", "specialist", "prompt", "treatment", "review"],
  },
  {
    id: "keypoints-endplates",
    title: "Keypoints and Endplates",
    content:
      "Accurate landmark detection matters because the measured angle depends on the superior and inferior endplates selected from the vertebrae. Better keypoints usually lead to more stable angle estimation.",
    keywords: ["keypoints", "endplates", "landmark", "vertebrae", "stable"],
  },
];

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function getRelevantScoliosisInsights(query: string, topK = 2) {
  const tokens = new Set(tokenize(query));

  return KNOWLEDGE_BASE.map((chunk) => {
    const keywordHits = chunk.keywords.reduce(
      (score, keyword) => score + (tokens.has(keyword.toLowerCase()) ? 2 : 0),
      0
    );

    const titleHits = tokenize(chunk.title).reduce(
      (score, token) => score + (tokens.has(token) ? 1 : 0),
      0
    );

    const contentHits = tokenize(chunk.content).reduce(
      (score, token) => score + (tokens.has(token) ? 1 : 0),
      0
    );

    return {
      ...chunk,
      score: keywordHits + titleHits + Math.min(contentHits, 6),
    };
  })
    .sort((left, right) => right.score - left.score)
    .slice(0, topK)
    .map(({ score, ...chunk }) => chunk);
}

export default KNOWLEDGE_BASE;