function getRecommendedTelescopes(telescopes, accessories, angularSize, mode = "eyepiece") {
  const bestCombos = [];

  telescopes.forEach((telescope) => {
    if (!telescope || !telescope.focal_length || !telescope.aperture) return;

    const scopeFL = parseFloat(telescope.focal_length);
    const scopeAperture = parseFloat(telescope.aperture);

    const name = telescope.telescope_name?.toLowerCase() || "";
    if (
      name.includes("camera") ||
      name.includes("lens") ||
      name.includes("canon") ||
      name.includes("nikon") ||
      name.includes("f/")
    )
      return;

    accessories.forEach((accessory) => {
      if (mode === "eyepiece") {
        const epFL = parseFloat(accessory.eyepiece_focal_length);
        const afov = parseFloat(accessory.AFOV);
        if (isNaN(epFL) || isNaN(afov) || epFL === 0) return;

        const magnification = scopeFL / epFL;
        const tfov = afov / magnification;
        const dawesLimit = 116 / scopeAperture;

        if (tfov >= angularSize * 0.8 && tfov <= angularSize * 2) {
          bestCombos.push({
            telescope_name: telescope.telescope_name,
            focal_length: scopeFL,
            aperture: scopeAperture,
            eyepiece_name: accessory.eyepiece_name,
            eyepiece_focal_length: epFL,
            afov,
            magnification,
            tfov,
            dawesLimit,
            type: "eyepiece"
          });
        }
      } else if (mode === "camera") {
        const sensorWidth = parseFloat(accessory.sensor_size?.width);
        const sensorHeight = parseFloat(accessory.sensor_size?.height);

        if (isNaN(sensorWidth) || isNaN(sensorHeight) || scopeFL === 0) return;

        const horizontalFov = (sensorWidth / scopeFL) * (180 / Math.PI);
        const verticalFov = (sensorHeight / scopeFL) * (180 / Math.PI);
        const tfov = Math.max(horizontalFov, verticalFov); // approximate

        if (tfov >= angularSize * 0.8 && tfov <= angularSize * 2) {
          bestCombos.push({
            telescope_name: telescope.telescope_name,
            focal_length: scopeFL,
            aperture: scopeAperture,
            camera_name: accessory.camera_name,
            sensorWidth,
            sensorHeight,
            tfov,
            type: "camera"
          });
        }
      }
    });
  });

  return bestCombos
    .sort((a, b) => Math.abs(a.tfov - angularSize) - Math.abs(b.tfov - angularSize))
    .slice(0, 5);
}

export default getRecommendedTelescopes;
