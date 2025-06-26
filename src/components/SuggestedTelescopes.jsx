import React, { useEffect, useState } from "react";
import axios from "axios";
import getRecommendedTelescopes from "../utils/getRecommendedTelescopes";
import angularSizes from "../utils/angularSizes";

const SuggestedTelescopes = ({ celestialBody }) => {
  const [telescopes, setTelescopes] = useState([]);
  const [eyepieces, setEyepieces] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [eyepieceCombos, setEyepieceCombos] = useState([]);
  const [cameraCombos, setCameraCombos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/telescopes").then((res) => setTelescopes(res.data));
    axios.get("http://localhost:5000/eyepieces").then((res) => setEyepieces(res.data));
    axios.get("http://localhost:5000/cameras").then((res) => setCameras(res.data));
  }, []);

  useEffect(() => {
    const data = angularSizes[celestialBody?.toLowerCase()];
    if (data && telescopes.length && eyepieces.length && cameras.length) {
      const epCombos = getRecommendedTelescopes(telescopes, eyepieces, data.angularSize, "eyepiece");
      const camCombos = getRecommendedTelescopes(telescopes, cameras, data.angularSize, "camera");
      setEyepieceCombos(epCombos);
      setCameraCombos(camCombos);
    } else {
      setEyepieceCombos([]);
      setCameraCombos([]);
    }
  }, [telescopes, eyepieces, cameras, celestialBody]);

  return (
    <div style={{ color: "white", marginTop: "20px" }}>
      <h3>🔭 Suggested Telescope + Eyepiece Combos for {celestialBody}</h3>
      {eyepieceCombos.length > 0 ? (
        <ul>
          {eyepieceCombos.map((combo, index) => (
            <li key={index}>
              – <strong>{combo.telescope_name}</strong> + <em>{combo.eyepiece_name}</em> |
              {combo.focal_length}mm FL / {combo.aperture}mm aperture |
              TFoV: {combo.tfov.toFixed(2)}°
            </li>
          ))}
        </ul>
      ) : (
        <p>No eyepiece recommendations found.</p>
      )}

      <h3 style={{ marginTop: "30px" }}>📸 Suggested Telescope + Camera Combos for {celestialBody}</h3>
      {cameraCombos.length > 0 ? (
        <ul>
          {cameraCombos.map((combo, index) => (
            <li key={index}>
              – <strong>{combo.telescope_name}</strong> + <em>{combo.camera_name}</em> |
              {combo.focal_length}mm FL / {combo.aperture}mm aperture |
              TFoV: {combo.tfov.toFixed(2)}°
            </li>
          ))}
        </ul>
      ) : (
        <p>No camera recommendations found.</p>
      )}
    </div>
  );
};

export default SuggestedTelescopes;
