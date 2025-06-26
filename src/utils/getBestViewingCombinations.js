import angularSizes from "./angularSizes";

export function getBestEyepieceCombinations(telescopes, eyepieces, celestialBody) {
  const results = [];
  const targetSize = angularSizes[celestialBody?.toLowerCase()]?.angularSize || 0.5;

  for (const telescope of telescopes) {
    const fl = Number(telescope.focal_length);
    for (const eyepiece of eyepieces) {
      const epFL = Number(eyepiece.eyepiece_focal_length);
      const afov = Number(eyepiece.AFOV) || 50;
      const magnification = fl / epFL;
      const tfov = afov / magnification;

      const fitScore = 1 - Math.abs(tfov - targetSize) / targetSize; // closer to 1 is better
      results.push({
        telescope,
        eyepiece,
        tfov,
        magnification,
        score: fitScore,
      });
    }
  }

  // Sort by best fit (highest score)
  return results.sort((a, b) => b.score - a.score).slice(0, 10); // Top 10
}
