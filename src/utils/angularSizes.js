const angularSizes = {
  sun: {
    angularSize: 0.53, // degrees (varies ~0.52–0.54)
    imageWidth: 2048,
    imageHeight: 2048,
  },
  moon: {
    angularSize: 0.52, // degrees (varies ~0.49–0.56)
    imageWidth: 2580,
    imageHeight: 2482,
  },
  mercury: {
    angularSize: 0.005, // degrees (avg ~5-13 arcseconds)
    imageWidth: 1040,
    imageHeight: 1040,
  },
  venus: {
    angularSize: 0.01, // degrees (avg ~10-60 arcseconds)
    imageWidth: 480,
    imageHeight: 480,
  },
  
  mars: {
    angularSize: 0.007, // degrees (varies ~3.5-25 arcseconds)
    imageWidth: 1552,
    imageHeight: 1552,
  },
  jupiter: {
    angularSize: 0.02, // degrees (varies ~30-50 arcseconds)
    imageWidth: 840,
    imageHeight: 840,
  },
  saturn: {
    angularSize: 0.017, // degrees (including rings)
    imageWidth: 4613,
    imageHeight: 2233,
  },
  uranus: {
    angularSize: 0.0037, // degrees (~3.7 arcseconds)
    imageWidth: 1720,
    imageHeight: 1720,
  },
  neptune: {
    angularSize: 0.0023, // degrees (~2.3 arcseconds)
    imageWidth: 2200,
    imageHeight: 2200,
  },
};

export default angularSizes;
