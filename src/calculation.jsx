// Function to calculate telescope parameters
const calculateParameters = () => {
    if (!selectedTelescope || !selectedEyepiece) return;

    const aperture = parseFloat(selectedTelescope.aperture);
    const focalLength = parseFloat(selectedTelescope.focal_length);
    const eyepieceFocalLength = parseFloat(selectedEyepiece.eyepiece_focal_length);
    const eyepieceFoV = parseFloat(selectedEyepiece.AFOV);

    // Correct Focal Ratio calculation
    const focalRatio = (focalLength / aperture).toFixed(2);

    // Magnification
    const magnification = (focalLength / eyepieceFocalLength).toFixed(2);

    // Maximum Magnification
    const maxMagnification = (2.5 * aperture).toFixed(2);

    // True Field of View
    const trueFoV = (eyepieceFoV * (eyepieceFocalLength / focalLength)).toFixed(2);

    // Dawes' Limit (Resolution Limit)
    const dawesLimit = (116 / aperture).toFixed(2);

    // Rayleigh Limit
    const rayleighLimit = (138 / aperture).toFixed(2);

    // Limiting Magnitude
    const limitingMagnitude = (7.7 + (5 * Math.log10(aperture / 10))).toFixed(2);

    // Light Gathering Power
    const lightGatheringPower = ((aperture ** 2) / (7 ** 2)).toFixed(2);

    setCalculatedValues({
        focalRatio,  // Ensuring proper display format
        magnification,
        maxMagnification,
        trueFoV,
        dawesLimit,
        rayleighLimit,
        limitingMagnitude,
        lightGatheringPower
    });
}
