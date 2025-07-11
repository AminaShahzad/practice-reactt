// getRecommendedTelescopes.js with advanced scoring logic based on celestial object type

function getRecommendedTelescopes(
  telescopes,
  accessories,
  angularSize,
  mode = "eyepiece",
  celestialBody = "",
  options = {}
) {
  const bestCombos = [];
  const fitMultiplier = 1.2;
  const lowerBound = angularSize * 0.95;
  const upperBound = angularSize * fitMultiplier;

  const objectType = classifyCelestialObject(celestialBody);

  // Define weight profiles for each type
  const weightProfiles = {
    planet: {
      aperture: 1.5,
      fit: 20,
      tfov: -10,
      imageScale: -10,
      dsoBonus: 0,
    },
    moon: {
      aperture: 1.5,
      fit: 20,
      tfov: -10,
      imageScale: -10,
      dsoBonus: 0,
    },
    sun: {
      aperture: 1.2,
      fit: 15,
      tfov: -10,
      imageScale: -8,
      dsoBonus: 0,
    },
    dso: {
      aperture: 0.5,
      fit: 10,
      tfov: 5,
      imageScale: -2,
      dsoBonus: 5,
    },
    default: {
      aperture: 1.0,
      fit: 10,
      tfov: -5,
      imageScale: -5,
      dsoBonus: 0,
    },
  };

  const weights = weightProfiles[objectType] || weightProfiles.default;

  telescopes.forEach((telescope) => {
    const scopeFL = parseFloat(telescope.focal_length);
    const scopeAperture = parseFloat(telescope.aperture);
    const name = telescope.telescope_name?.toLowerCase() || "";

    if (!scopeFL || !scopeAperture || name.includes("camera") || name.includes("lens")) return;

    accessories.forEach((accessory) => {
      if (mode === "eyepiece") {
        const epFL = parseFloat(accessory.eyepiece_focal_length);
        const afov = parseFloat(accessory.AFOV);
        if (!epFL || !afov) return;

        const magnification = scopeFL / epFL;
        const tfov = afov / magnification;
        const isPerfectFit = tfov >= lowerBound && tfov <= upperBound;

        let detailLevel = scopeAperture >= 250 ? "High" : scopeAperture >= 150 ? "Moderate" : "Basic";

        const apertureScore = scopeAperture * weights.aperture;
        const fitScore = isPerfectFit ? weights.fit : 0;
        const fovScore = (tfov - angularSize) * weights.tfov;

        const score = apertureScore + fitScore + fovScore;

        bestCombos.push({
          telescope_name: telescope.telescope_name,
          eyepiece_name: accessory.eyepiece_name,
          focal_length: scopeFL,
          aperture: scopeAperture,
          tfov,
          magnification,
          isPerfectFit,
          detailLevel,
          score,
          apertureScore,
          fitScore,
          fovScore,
        });
      } else {
        const sensorWidth = parseFloat(accessory.sensor_size?.width);
        const sensorHeight = parseFloat(accessory.sensor_size?.height);
        const pixelSize = parseFloat(accessory.pixel_size || 4.3);
        if (!sensorWidth || !sensorHeight || !pixelSize || !scopeFL) return;

        const horizontalFov = (sensorWidth / scopeFL) * (180 / Math.PI);
        const verticalFov = (sensorHeight / scopeFL) * (180 / Math.PI);
        const diagonalFov = Math.sqrt(horizontalFov ** 2 + verticalFov ** 2);
        const tfov = Math.max(horizontalFov, verticalFov);
        const isPerfectFit = diagonalFov >= lowerBound && diagonalFov <= upperBound;

        const imageScale = (206.265 * pixelSize) / scopeFL;
        const detailLevel = imageScale < 1.5 ? "High" : imageScale < 3 ? "Moderate" : "Basic";

        const apertureScore = scopeAperture * weights.aperture;
        const fitScore = isPerfectFit ? weights.fit : 0;
        const fovScore = (tfov - angularSize) * weights.tfov;
        const imageScaleScore = imageScale * weights.imageScale;
        const dsoBonus = objectType === "dso" ? tfov * weights.dsoBonus : 0;

        const score = apertureScore + fitScore + fovScore + imageScaleScore + dsoBonus;

        bestCombos.push({
          telescope_name: telescope.telescope_name,
          camera_name: accessory.camera_name,
          focal_length: scopeFL,
          aperture: scopeAperture,
          tfov,
          imageScale,
          isPerfectFit,
          detailLevel,
          score,
          apertureScore,
          fitScore,
          fovScore,
          imageScaleScore,
          dsoBonus,
        });
      }
    });
  });


  
  const sortedCombos = bestCombos.sort((a, b) => b.score - a.score);

// Assign rank starting from 1
sortedCombos.forEach((combo, index) => {
  combo.rank = index + 1;
});

return sortedCombos;

}

function classifyCelestialObject(name = "") {
  const lower = name.toLowerCase();
  if (["mercury", "venus", "mars", "jupiter", "saturn","neptune","uranus"].includes(lower)) return "planet";
  if (["sun"].includes(lower)) return "sun";
  if (["moon"].includes(lower)) return "moon";
  if (["andromeda", "orion", "pleiades", "nebula", "galaxy"].some(d => lower.includes(d))) return "dso";
  return "default";
}

export default getRecommendedTelescopes;
