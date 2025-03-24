export const calculateParameters = (telescope, eyepiece, camera) => {
    if (!telescope) return null;

    const aperture = Number(telescope.aperture) || 1; // Prevents division by zero
    const focalLength = Number(telescope.focal_length) || 1;

    const eyepieceFocalLength = eyepiece ? Number(eyepiece.eyepiece_focal_length) || 1 : null;
    const afov = eyepiece ? Number(eyepiece.AFOV) || 0 : null;

    // Telescope Calculations
    const magnification = eyepieceFocalLength ? focalLength / eyepieceFocalLength : 0;
    const maxMagnification = 2 * aperture;
    const focalRatio = focalLength / aperture;
    const trueFoV = (magnification && afov) ? afov / magnification : 0;
    const dawesLimit = 116 / aperture;
    const rayleighLimit = 138 / aperture;
    const limitingMagnitude = 7.98 + 5 * Math.log10(aperture);
    const lightGatheringPower = (aperture / 7) ** 2;

    // CCD Camera Calculations
    let ccdResolution = 0;
    let ccdPixelSize = 0;
    let ccdSensorSize = 0;
    let ccdSuitability = "N/A";

    if (camera) {
        const pixelSize = camera.pixel_size ? Number(camera.pixel_size) : null;
        const resolutionPx = camera.resolution ? 
            [Number(camera.resolution.width) || 1, Number(camera.resolution.height) || 1] 
            : [1, 1];
        const sensorWidth = camera.sensor_size ? Number(camera.sensor_size.width) : 1;
        const sensorHeight = camera.sensor_size ? Number(camera.sensor_size.height) : 1;

        // ✅ FIX: Correcting CCD Pixel Size and Sensor Size
        ccdPixelSize = pixelSize; // Directly use the provided pixel size (in µm)
        ccdSensorSize = Math.sqrt(sensorWidth * sensorWidth + sensorHeight * sensorHeight); // Diagonal of the sensor

        // Calculate the CCD resolution (in arcsec/pixel)
        ccdResolution = (pixelSize * 206.265) / focalLength;

        // Suitability Conditions
        if (ccdResolution > 2) {
            ccdSuitability = "Under-sampling (Resolution too high)";
        } else if (ccdResolution < 0.67) {
            ccdSuitability = "Over-sampling (Resolution too low)";
        } else {
            ccdSuitability = "Optimal (Good resolution)";
        }
    }

    return {
        magnification,
        maxMagnification,
        focalRatio,
        trueFoV,
        dawesLimit,
        rayleighLimit,
        limitingMagnitude,
        lightGatheringPower,
        ccdResolution,
        ccdPixelSize,
        ccdSensorSize,
        ccdSuitability
    };
};
