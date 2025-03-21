import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";
import "./App.css";
import  visual from "./vis.jpg"
import image from "./imag.jpg"

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
    const [configType, setConfigType] = useState(null); // Eyepiece or Camera selection
    const [isSliding, setIsSliding] = useState(true);

    // Fetch telescopes, eyepieces, and cameras
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
        setTimeout(() => setIsSliding(false), 3000); // Stop animation after 3 seconds
    }, []); 


    const handleBack = () => {
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
        if (!selectedTelescope) {
            setError("Please select a telescope.");
            return;
        }

        if (configType === "Eyepiece" && !selectedEyepiece) {
            setError("Please select an eyepiece.");
            return;
        }
        
        if (configType === "Camera" && (!selectedCamera )) {
            setError("Please fill all camera configuration fields.");
            return;
        }
        
        console.log("Configuration Saved:", { selectedTelescope, configType, selectedEyepiece, selectedCamera });
        setActivePanel(""); // Hide panel after saving
    };


    // cuustom styles d=for search bar
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
            borderBottom: "1px solid white", // Separator line
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
                        <   div className="main-config">
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
                        <>
                        <div  className="Selection">
                            <button className="back-button" onClick={handleBack}><FaArrowLeft /></button>
                            <h2>Configure {configType}</h2>

                            <label>Select Telescope:</label>
                            <Select
                                options={telescopes.map(t => ({ value: t.telescope_name, label: t.telescope_name }))}
                                onChange={setSelectedTelescope}
                                isLoading={loading}
                                placeholder="Search telescope..."
                                styles={customStyles}
                            />

                            {configType === "Eyepiece" && (
                                <>
                                    <label>Select Eyepiece:</label>
                                    <Select
                                        options={eyepieces.map(e => ({ value: e.eyepiece_name, label: `${e.eyepiece_name}mm` }))}
                                        onChange={setSelectedEyepiece}
                                        isLoading={loading}
                                        placeholder="Search eyepiece..."
                                        styles={customStyles}
                                    />
                                </>
                            )} 
                        </div>

                            {configType === "Camera" && (
                                
                                <div className="Selection">
                                    <label>Select Camera:</label>
                                    <Select
                                        options={cameras.map(c => ({ value: c.camera_name, label: c.camera_name }))}
                                        onChange={setSelectedCamera}
                                        isLoading={loading}
                                        placeholder="Search camera..."
                                        styles={customStyles}
                                    />
                                </div>
                                    
                                
                            )}

                            {error && <p className="error">{error}</p>}
                            <button className="enter-button" onClick={handleConfigSubmit}>Enter</button>
                            
                    </>
                    )}
                </div>
            )}

            {/* Learn More Panel */}
            {activePanel === "learnmore" && (
                <div className="config-panel">
                    <button className="back-button" onClick={handleBack}><FaArrowLeft /></button>
                    <h2>Learn More</h2>
                    <p>Coming soon...</p>
                </div>
            )}
        </div>
    );
};

export default App;
