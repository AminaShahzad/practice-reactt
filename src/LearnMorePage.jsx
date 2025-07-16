import React from "react";
import { useNavigate } from "react-router-dom";
import "./LearnMorePage.css"; // Import the corresponding CSS

const LearnMorePage = () => {
  const navigate = useNavigate();

  return (
    <div className="learnmore-container">
      <header className="learnmore-header">
        <h1>✨ Learn About Celestial Viewing ✨</h1>
        <p>Your gateway to the universe</p>
      </header>

      <nav className="learnmore-navbar">
        <button onClick={() => navigate("/dashboard")}>←Configuration</button>
      </nav>

      <div className="learnmore-content">
        <section className="learnmore-section">
          <h2>🔭 Telescopes</h2>
          <p>
            Telescopes are powerful tools that allow us to observe distant
            celestial objects. They use lenses or mirrors to collect and
            magnify light from stars, planets, and galaxies. Choose your
            telescope based on aperture and focal length for optimal viewing.
          </p>
        </section>

        <section className="learnmore-section">
          <h2>👁️‍🗨️ Eyepieces</h2>
          <p>
            Eyepieces determine the magnification and field of view. A shorter
            focal length gives more magnification but a smaller viewing angle.
            Combining the right eyepiece with your telescope enhances
            observation dramatically.
          </p>
        </section>

        <section className="learnmore-section">
          <h2>📸 Cameras</h2>
          <p>
            Astrophotography cameras capture stunning images of the night sky.
            Sensor size, resolution, and pixel size affect clarity. Use
            high-resolution cameras for deep-sky imaging or compact ones for
            planetary shots.
          </p>
        </section>

        <section className="learnmore-section">
          <h2>🌌 What Can You See?</h2>
          <ul>
            <li>🌙 The Moon: craters, valleys, and lunar maria</li>
            <li>🪐 Planets: observe Jupiter’s bands or Saturn’s rings</li>
            <li>🌟 Deep Sky: galaxies, nebulae, and star clusters</li>
            <li>☀️ The Sun: with a solar filter, view sunspots and flares</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LearnMorePage;