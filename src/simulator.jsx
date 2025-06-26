import React, { useEffect, useState } from "react";
import angularSizes from "./utils/angularSizes";
import planetImages from "./planetImages";
import SuggestedTelescopes from "./components/SuggestedTelescopes";
import telescopes from "./utils/telescopeDatabase";
import getRecommendedTelescopes from "./utils/getRecommendedTelescopes";




const Simulator = ({ telescope, eyepiece, camera, celestialBody }) => {
  const [angularSize, setAngularSize] = useState(0.01);

  const focalLength = Number(telescope?.focal_length) || 1;

  // Eyepiece or camera FoV
  const afov = eyepiece ? Number(eyepiece.AFOV) || 50 : 50;
  const magnification = eyepiece ? focalLength / eyepiece.eyepiece_focal_length : 1;
  const eyepieceFoV = afov / magnification;
  const sensorWidth = camera?.sensor_size?.width ? Number(camera.sensor_size.width) : null;
  const cameraFoV = camera && sensorWidth ? (57.3 * sensorWidth) / focalLength : null;

  const finalFoV = cameraFoV || eyepieceFoV;

  useEffect(() => {
    const data = angularSizes[celestialBody?.toLowerCase()];
    if (data) {
      setAngularSize(data.angularSize);
    }
  }, [celestialBody]);

  const frameSize = 300; // px
  const scaleRatio = angularSize / finalFoV;
  const imageDiameter = frameSize * scaleRatio * 1.1;


  return (
    <div style={{ background: "black", padding: "20px", borderRadius: "10px", color: "white" }}>
      <h2>
        Simulated View of {celestialBody?.charAt(0).toUpperCase() + celestialBody?.slice(1)}
      </h2>
      <p>Angular Size: {angularSize.toFixed(4)}°</p>
      <p>Simulated Field of View: {finalFoV.toFixed(2)}°</p>

      <div
        style={{
          width: `${frameSize}px`,
          height: `${frameSize}px`,
          borderRadius: "50%",
          background: "#000",
          overflow: "hidden",
          border: "2px solid white",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {planetImages[celestialBody?.toLowerCase()] ? (
          <img
            src={planetImages[celestialBody.toLowerCase()]}
            alt={celestialBody}
            style={{
              width: `${imageDiameter}px`,
              height: `${imageDiameter}px`,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
            }}
          />
        ) : (
          <p>No image available.</p>
        )}
      </div>
      <SuggestedTelescopes celestialBody={celestialBody} eyepiece={eyepiece} /> 

    </div>
  );
};

export default Simulator;
