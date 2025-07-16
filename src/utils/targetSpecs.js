const targetSpecs = {
  mercury: {
    minAperture: 76,
    goodAperture: 100,
    excellentAperture: 150,
    desiredTFOV: 0.3,
    imageScaleRange: [0.3, 0.7],
    type: "both"
  },
  venus: {
    minAperture: 76,
    goodAperture: 100,
    excellentAperture: 150,
    desiredTFOV: 0.5,
    imageScaleRange: [0.4, 0.8],
    type: "both"
  },
  moon: {
    minAperture: 76,
    goodAperture: 150,
    excellentAperture: 254,
    desiredTFOV: 0.5,
    imageScaleRange: [0.3, 1.0],
    type: "both"
  },
  sun: {
    minAperture: 76,
    goodAperture: 150,
    excellentAperture: 254,
    desiredTFOV: 0.5,
    imageScaleRange: [0.3, 1.0],
    type: "both"
  },
  mars: {
    minAperture: 100,
    goodAperture: 150,
    excellentAperture: 200,
    desiredTFOV: 0.4,
    imageScaleRange: [0.2, 0.5],
    type: "both"
  },
  jupiter: {
    minAperture: 100,
    goodAperture: 150,
    excellentAperture: 200,
    desiredTFOV: 0.4,
    imageScaleRange: [0.2, 0.5],
    type: "both"
  },
  saturn: {
    minAperture: 100,
    goodAperture: 150,
    excellentAperture: 200,
    desiredTFOV: 0.4,
    imageScaleRange: [0.2, 0.5],
    type: "both"
  },
  uranus: {
    minAperture: 150,
    goodAperture: 200,
    excellentAperture: 250,
    desiredTFOV: 0.3,
    imageScaleRange: [0.15, 0.4],
    type: "imaging"
  },
  neptune: {
    minAperture: 150,
    goodAperture: 200,
    excellentAperture: 250,
    desiredTFOV: 0.2,
    imageScaleRange: [0.1, 0.3],
    type: "imaging"
  }
};

export default targetSpecs;
