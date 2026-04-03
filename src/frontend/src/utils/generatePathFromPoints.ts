export default function generatePathFromPoints(
  points: number[][],
  displayType: LandmarkDisplayType
) {
  if (displayType === "no_lines") return [];
  let paths: number[][][] = [];
  const safePoint = (idx: number) => {
    const p = points[idx];
    if (!p || p.length !== 2) return null;
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
    return p;
  };

  const POINTS_PER_VERTEBRAE = 4;
  switch (displayType) {
    case "all_lines":
      for (let i = 0; i < points.length; i += POINTS_PER_VERTEBRAE) {
        if (i + 3 >= points.length) break;
        const p0 = safePoint(i);
        const p1 = safePoint(i + 1);
        const p2 = safePoint(i + 2);
        const p3 = safePoint(i + 3);
        if (!p0 || !p1 || !p2 || !p3) continue;
        paths.push([
          p0,
          p1,
          p3,
          p2,
          p0,
        ]);
      }
      break;
    case "top_lines":
      for (let i = 0; i < points.length; i += POINTS_PER_VERTEBRAE) {
        if (i + 1 >= points.length) break;
        const p0 = safePoint(i);
        const p1 = safePoint(i + 1);
        if (!p0 || !p1) continue;
        paths.push([p0, p1]);
      }
      break;
    case "bottom_lines":
      for (let i = 0; i < points.length; i += POINTS_PER_VERTEBRAE) {
        if (i + 3 >= points.length) break;
        const p2 = safePoint(i + 2);
        const p3 = safePoint(i + 3);
        if (!p2 || !p3) continue;
        paths.push([p2, p3]);
      }
      break;
    default:
      return [];
  }
  return paths;
}
