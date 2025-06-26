import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBestEyepieceCombinations } from "../utils/getBestViewingCombinations";

const BestCombinations = ({ celestialBody }) => {
  const [telescopes, setTelescopes] = useState([]);
  const [eyepieces, setEyepieces] = useState([]);
  const [combinations, setCombinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [tel, eye] = await Promise.all([
        axios.get("http://localhost:5000/telescopes"),
        axios.get("http://localhost:5000/eyepieces")
      ]);
      setTelescopes(tel.data);
      setEyepieces(eye.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (telescopes.length && eyepieces.length && celestialBody) {
      const combos = getBestEyepieceCombinations(telescopes, eyepieces, celestialBody);
      setCombinations(combos);
    }
  }, [telescopes, eyepieces, celestialBody]);

  return (
    <div style={{ color: "white", marginTop: "20px" }}>
      <h3>🔭 Best Telescope + Eyepiece Combinations for {celestialBody}</h3>
      <ul>
        {combinations.map((combo, idx) => (
          <li key={idx}>
            <strong>{combo.telescope.telescope_name}</strong> + {combo.eyepiece.eyepiece_name} |
            TFoV: {combo.tfov.toFixed(2)}° | Mag: {combo.magnification.toFixed(1)}x
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestCombinations;
