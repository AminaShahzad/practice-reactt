import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";
import "./App.css";
import visual from "./vis.jpg";
import image from "./imag.jpg";
import { calculateParameters } from "./calculation"; // Import function


const App = () => {
    const [telescopes, setTelescopes] = useState([]);
    const [eyepieces, setEyepieces] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [selectedTelescope, setSelectedTelescope] = useState(null);
    const [selectedEyepiece, setSelectedEyepiece] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activePanel, setActivePanel] = useState("");
    const [configType, setConfigType] = useState(null);
    const [isSliding, setIsSliding] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [calculatedValues, setCalculatedValues] = useState(null);

    // Fetch data for telescopes, eyepieces, and cameras
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [telescopesRes, eyepiecesRes, camerasRes] = await Promise.all([
                axios.get("http://localhost:5000/telescopes"),
                axios.get("http://localhost:5000/eyepieces"),
                axios.get("http://localhost:5000/cameras"),
            ]);

            setTelescopes(telescopesRes.data || []);
            setEyepieces(eyepiecesRes.data || []);
            setCameras(camerasRes.data || []);
        } catch (err) {
            setError("Error fetching data. Check your API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setTimeout(() => setIsSliding(false), 3000);
    }, []);
    
    useEffect(() => {
        console.log("Fetched Cameras:", cameras);
    }, [cameras]); // ✅ Correct closing structure
    
    const handleBack = () => {
        setError(""); // Clear errors when going back
        if (configType) {
            setConfigType(null);
            setSelectedTelescope(null);
            setSelectedEyepiece(null);
            setSelectedCamera(null);
        } else {
            setActivePanel("");
        }
    };

    // Handle Configuration Submission
    const handleConfigSubmit = () => {
        setError(""); // Clear previous error before validation

        if (!selectedTelescope) {
            setError("Please select a telescope.");
            return;
        }

        if (configType === "Eyepiece" && !selectedEyepiece) {
            setError("Please select an eyepiece.");
            return;
        }

        if (configType === "Camera" && !selectedCamera) {
            setError("Please select a camera.");
            return;
        }
        console.log("Selected Camera:", selectedCamera); // Check in the console
        console.log("Configuration Saved:", { selectedTelescope, configType, selectedEyepiece, selectedCamera });

        setShowDetails(true);
        setActivePanel("");
    };

    // Custom styles for search bars
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: "black",
            color: "white",
            border: "1px solid white",
            boxShadow: "none",
            "&:hover": { borderColor: "gray" },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "black",
            border: "1px solid gray",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "gray" : "black",
            color: "white",
            borderBottom: "1px solid white",
            padding: 10,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "gray",
        }),
    };

    return (
        <div className="app">
            <header className={`header ${isSliding ? "slide" : ""}`}>
                <h1>TELESCOPIC VIEWS LIVE!</h1>
            </header>

            {/* Navbar */}
            <nav className="navbar">
                <button onClick={() => setActivePanel("config")}>Configuration</button>
                <button onClick={() => setActivePanel("learnmore")}>Learn More</button>
            </nav>

            {/* Configuration Panel */}
            {activePanel === "config" && (
                <div className="config-panel">
                    {!configType ? (
                        <div className="main-config">
                            <button className="back-button" onClick={handleBack}><FaArrowLeft /></button>
                            <h2>Make your choice</h2>

                            <button onClick={() => setConfigType("Eyepiece")} className="config-button">
                                <span className="button-text">Virtualizing &rarr;</span>
                                <img src={visual} alt="Eyepiece" className="button-image" />
                            </button>
                            <button onClick={() => setConfigType("Camera")} className="config-button">
                                <span className="button-text">Imaging &rarr;</span>
                                <img src={image} alt="Camera" className="button-image" />
                            </button>
                        </div>
                    ) : (
                        <div className="Selection">
                            <button className="back-button" onClick={handleBack}><FaArrowLeft /></button>
                            <h2>Configure {configType}</h2>

                            <label>Select Telescope:</label>
                            <Select
                                options={telescopes.map(t => ({ value: t.telescope_name, label: t.telescope_name }))}
                                onChange={(option) => setSelectedTelescope(telescopes.find(t => t.telescope_name === option.value))}
                                isLoading={loading}
                                placeholder="Search telescope..."
                                styles={customStyles}
                            />

                            {configType === "Eyepiece" && (
                                <>
                                    <label>Select Eyepiece:</label>
                                    <Select
                                        options={eyepieces.map(e => ({ value: e.eyepiece_name, label: `${e.eyepiece_name}mm` }))}
                                        onChange={(option) => setSelectedEyepiece(eyepieces.find(e => e.eyepiece_name === option.value))}
                                        isLoading={loading}
                                        placeholder="Search eyepiece..."
                                        styles={customStyles}
                                    />
                                </>
                            )}

                            {configType === "Camera" && (
                                <div>
                                    <label>Select Camera:</label>
                                    <Select
                                        options={cameras.map(c => ({ value: c.camera_name, label: c.camera_name }))}
                                        onChange={(option) => setSelectedCamera(cameras.find(c => c.camera_name === option.value))}
                                        isLoading={loading}
                                        placeholder="Search camera..."
                                        styles={customStyles}
                                    />
                                </div>
                            )}

                            {error && <p className="error">{error}</p>}
                            <button className="enter-button" onClick={handleConfigSubmit}>Enter</button>
                        </div>
                    )}
                </div>
            )}

{showDetails && (
                <div className="equipment-details">
                <h3>Selected Equipment Details</h3>

                {selectedTelescope && (
                    <div className="equipment-box">
                        <h4>Telescope: {selectedTelescope.telescope_name}</h4>
                        <p><strong>Aperture:</strong> {selectedTelescope.aperture} mm</p>
                        <p><strong>Focal Length:</strong> {selectedTelescope.focal_length} mm</p>
                    </div>
                )}

{configType === "Eyepiece" && selectedEyepiece && (
    <div className="equipment-box">
        <h4>Eyepiece: {selectedEyepiece.eyepiece_name} </h4>
        <p><strong>Focal Length:</strong> {selectedEyepiece.eyepiece_focal_length} mm</p>
        <p><strong>Field of View:</strong> {selectedEyepiece.AFOV}°</p>
    </div>
)}

{configType === "Camera" && selectedCamera && (
    <div className="equipment-box">
        <h4>Camera: {selectedCamera.camera_name}</h4>
        <p><strong>Pixel Size:</strong> {selectedCamera.pixel_size} µm</p>
        <p><strong>Resolution:</strong> {selectedCamera.resolution.width} x {selectedCamera.resolution.height} pixels</p>
        <p><strong>Sensor Size:</strong> {selectedCamera.sensor_size.width} x {selectedCamera.sensor_size.height} mm</p>
    </div>
)}    <button
onClick={() => {
  console.log("⚡ Button Clicked! Starting Calculation...");
  setCalculatedValues(calculateParameters(selectedTelescope, selectedEyepiece, selectedCamera));
}}
className="calculate-button"
>
Calculate Parameters
</button>

{selectedEyepiece && calculatedValues && calculatedValues.magnification !== undefined && (
    <div className="calculated-parameters">
        <h3>Calculated Parameters</h3>
        <p><strong>Magnification:</strong> {calculatedValues.magnification.toFixed(2)}x</p>
        <p><strong>Max Magnification:</strong> {calculatedValues.maxMagnification.toFixed(2)}x</p>
        <p><strong>Focal Ratio:</strong> {calculatedValues.focalRatio.toFixed(2)}</p>
        <p><strong>True FoV:</strong> {calculatedValues.trueFoV.toFixed(2)}°</p>
        <p><strong>Dawes' Limit:</strong> {calculatedValues.dawesLimit.toFixed(2)} arcsec</p>
    </div>


    
                    )}
                     {/* CCD Camera Parameters */}
                     {selectedCamera && calculatedValues && (
                    <div className="calculated-parameters">
                            <h3>Calculated Parameters</h3>
       
        <p><strong>CCD Resolution:</strong> {calculatedValues.ccdResolution?.toFixed(2)} arcsec/pixel</p>
        <p><strong>CCD Pixel Size:</strong> {calculatedValues.ccdPixelSize?.toFixed(2)} µm</p>
        <p><strong>CCD Sensor Size:</strong> {calculatedValues.ccdSensorSize?.toFixed(2)} mm</p>
        <p><strong>CCD Suitability:</strong> {calculatedValues.ccdSuitability}</p>
    </div>
)}
                </div>
            )}
        </div>
    );
};
export default App;
