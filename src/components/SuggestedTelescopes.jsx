import React, { useEffect, useState } from "react";
import axios from "axios";
import getRecommendedTelescopes from "../utils/getRecommendedTelescopes";
import angularSizes from "../utils/angularSizes";
import { CSVLink } from "react-csv";

// Eyepiece CSV headers
const eyepieceCSVHeaders = [
  { label: "Telescope", key: "telescope_name" },
  { label: "Eyepiece", key: "eyepiece_name" },
  { label: "Rank", key: "rank" },
  { label: "Focal Length", key: "focal_length" },
  { label: "Aperture", key: "aperture" },
  { label: "TFoV", key: "tfov" },
  { label: "Perfect Fit", key: "isPerfectFit" },
  { label: "Score", key: "score" },
  { label: "Scaled Score", key: "scoreScaled" },
  { label: "Aperture Score", key: "apertureScore" },
  { label: "Fit Score", key: "fitScore" },
  { label: "FOV Score", key: "fovScore" },
];

// Camera CSV headers
const cameraCSVHeaders = [
  { label: "Telescope", key: "telescope_name" },
  { label: "Camera", key: "camera_name" },
  { label: "Rank", key: "rank" },
  { label: "Focal Length", key: "focal_length" },
  { label: "Aperture", key: "aperture" },
  { label: "TFoV", key: "tfov" },
  { label: "Perfect Fit", key: "isPerfectFit" },
  { label: "Scale", key: "imageScale" },
  { label: "Score", key: "score" },
  { label: "Scaled Score", key: "scoreScaled" },
  { label: "Aperture Score", key: "apertureScore" },
  { label: "Fit Score", key: "fitScore" },
  { label: "FOV Score", key: "fovScore" },
  { label: "Scale Score", key: "imageScaleScore" },
  { label: "DSO Bonus", key: "dsoBonus" },
];

const SuggestedTelescopes = ({ celestialBody }) => {
  const [telescopes, setTelescopes] = useState([]);
  const [eyepieces, setEyepieces] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [eyepieceCombos, setEyepieceCombos] = useState([]);
const [cameraCombos, setCameraCombos] = useState([]);
const [focalMultiplier, setFocalMultiplier] = useState(1); // default = 1 (original)



  const [showPerfectOnly, setShowPerfectOnly] = useState(false);
  const [sortOption, setSortOption] = useState("score");
  const [viewMode, setViewMode] = useState("pro");

  useEffect(() => {
    axios.get("http://localhost:5000/telescopes").then((res) => setTelescopes(res.data));
    axios.get("http://localhost:5000/eyepieces").then((res) => setEyepieces(res.data));
    axios.get("http://localhost:5000/cameras").then((res) => setCameras(res.data));
  }, []);

  useEffect(() => {
  const generateCombos = () => {
    const data = angularSizes[celestialBody?.toLowerCase()];
    if (!data || !telescopes.length || !eyepieces.length || !cameras.length) {
      setEyepieceCombos([]);
      setCameraCombos([]);
      return;
    }

    let filteredTelescopes = telescopes.filter((t) => {
      const aperture = parseFloat(t.aperture);
      if (viewMode === "amateur") {
        return aperture >= 76.2 && aperture <= 304.8;
      } else if (viewMode === "pro") {
        return aperture >= 330.2 && aperture <= 762;
      }
      return true;
    });

    try {
      const epCombos = getRecommendedTelescopes(
        filteredTelescopes,
        eyepieces,
        data.angularSize,
        "eyepiece",
        celestialBody,
        { mode: viewMode }
      );

      const camCombos = getRecommendedTelescopes(
        filteredTelescopes,
        cameras,
        data.angularSize,
        "camera",
        celestialBody,
        { mode: viewMode }
      );

      setEyepieceCombos(epCombos);
      setCameraCombos(camCombos);
    } catch (err) {
      console.error("Error generating telescope combos:", err);
      setEyepieceCombos([]);
      setCameraCombos([]);
    }
  };

  generateCombos();
}, [telescopes, eyepieces, cameras, celestialBody, viewMode]);


  const filterCombos = (combos) => {
    const filtered = showPerfectOnly ? combos.filter((c) => c.isPerfectFit) : combos;

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "score":
          return (b.score ?? 0) - (a.score ?? 0);
        case "aperture":
          return (b.aperture ?? 0) - (a.aperture ?? 0);
        case "focal_length":
          return (b.focal_length ?? 0) - (a.focal_length ?? 0);
        case "tfov":
          return (b.tfov ?? 0) - (a.tfov ?? 0);
        case "imageScale":
          return (a.imageScale ?? Infinity) - (b.imageScale ?? Infinity);
        default:
          return 0;
      }
    });
  };

  return (
    <div style={{ color: "white", marginTop: "20px" }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "10px",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showPerfectOnly}
            onChange={() => setShowPerfectOnly(!showPerfectOnly)}
          />
          &nbsp;Show only Perfect Fit
        </label>

        <label>
          Sort by:&nbsp;
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="score">🔢 Score</option>
            <option value="aperture">🔭 Aperture</option>
            <option value="focal_length">📏 Focal Length</option>
            <option value="tfov">🌌 TFoV</option>
            <option value="imageScale">📐 Image Scale</option>
          </select>
        </label>

        <label>
          Mode:&nbsp;
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="pro">🔬 Pro</option>
            <option value="amateur">🔭 Amateur</option>
          </select>
        </label>
      </div>

      {/* 🔭 Eyepiece Combo Table */}
      <h3>🔭 Suggested Telescope + Eyepiece Combos for {celestialBody}</h3>
      {filterCombos(eyepieceCombos).length > 0 ? (
        <>
          <CSVLink
            data={eyepieceCombos}
            headers={eyepieceCSVHeaders}
            filename={`eyepiece_combos_${celestialBody}.csv`}
            className="csv-button"
          >
            📥 Export Eyepiece CSV
          </CSVLink>

          <div className="simulator-scroll-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Telescope</th>
                  <th>Eyepiece</th>
                  <th>FL / Aperture</th>
                  <th>TFoV</th>
                  <th>Fit</th>
                  <th>Rank</th>
                  <th>Total</th>
                  <th>Scaled Score</th>
                  <th>Aperture</th>
                  <th>Fit Score</th>
                  <th>FOV Score</th>
                </tr>
              </thead>
              <tbody>
                {filterCombos(eyepieceCombos) .slice(0, 5).map((combo) => (
                  <tr key={`${combo.telescope_name}-${combo.eyepiece_name}`}>
                    <td>{combo.telescope_name}</td>
                    <td>{combo.eyepiece_name}</td>
                    <td>{combo.focal_length}mm / {combo.aperture}mm</td>
                    <td>{combo.tfov.toFixed(2)}°</td>
                    <td>{combo.isPerfectFit ? "Perfect" : "-"}</td>
                    <td>#{combo.rank}</td>
                    <td>{combo.score.toFixed(1)}</td>
                    <td>{combo.scoreScaled?.toFixed(1)}</td>
                    <td>{combo.apertureScore?.toFixed(1)}</td>
                    <td>{combo.fitScore?.toFixed(1)}</td>
                    <td>{combo.fovScore?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No eyepiece recommendations found.</p>
      )}

      {/* 📸 Camera Combo Table */}
      <h3>📸 Suggested Telescope + Camera Combos for {celestialBody}</h3>
      {filterCombos(cameraCombos).length > 0 ? (
        <>
          <CSVLink
            data={cameraCombos}
            headers={cameraCSVHeaders}
            filename={`camera_combos_${celestialBody}.csv`}
            className="csv-button"
          >
            📥 Export Camera CSV
          </CSVLink>

          <div className="simulator-scroll-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Telescope</th>
                  <th>Camera</th>
                  <th>FL / Aperture</th>
                  <th>TFoV</th>
                  <th>Fit</th>
                  <th>Rank</th>
                  <th>Scale</th>
                  <th>Score</th>
                  <th>Scaled Score</th>
                  <th>Aperture</th>
                  <th>Fit Score</th>
                  <th>FOV Score</th>
                  <th>Scale Score</th>
                  <th>DSO Bonus</th>
                </tr>
              </thead>
              <tbody>
                {filterCombos(cameraCombos). slice(0, 5).map((combo) => (
                  <tr key={`${combo.telescope_name}-${combo.camera_name}`}>
                    <td>{combo.telescope_name}</td>
                    <td>{combo.camera_name}</td>
                    <td>{combo.focal_length}mm / {combo.aperture}mm</td>
                    <td>{combo.tfov.toFixed(2)}°</td>
                    <td>{combo.isPerfectFit ? "Perfect" : "-"}</td>
                    <td>#{combo.rank}</td>
                    <td>{combo.imageScale.toFixed(2)}"/px</td>
                    <td>{combo.score.toFixed(1)}</td>
                    <td>{combo.scoreScaled?.toFixed(1)}</td>
                    <td>{combo.apertureScore?.toFixed(1)}</td>
                    <td>{combo.fitScore?.toFixed(1)}</td>
                    <td>{combo.fovScore?.toFixed(1)}</td>
                    <td>{combo.imageScaleScore?.toFixed(1)}</td>
                    <td>{combo.dsoBonus?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No camera recommendations found.</p>
      )}
    </div>
  );
};

export default SuggestedTelescopes;
