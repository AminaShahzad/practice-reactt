import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { FaUser, FaUserLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if (savedUser) {
      setFormData({ ...formData, email: savedUser.email, password: savedUser.password });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) localStorage.removeItem("rememberedUser");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) return alert("All fields are required.");
    
    try {
      const res = await axios.post("http://localhost:5000/users/register", formData);
      alert(res.data.message);
      setIsRegister(false);
    } catch (err) {
      alert("Error registering user");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return alert("Please enter both email and password.");
    
    try {
      const res = await axios.post("http://localhost:5000/users/login", formData);
      console.log(res.data.message);
      
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify({ email: formData.email, password: formData.password }));
      }
      
      navigate("/dashboard");
    } catch (err) {
      alert("Error logging in: " + (err.response?.data?.error || err.message));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return alert("Please enter your email first.");
  
    try {
      const res = await axios.post("http://localhost:5000/users/check-email", { email: formData.email });
      if (res.data.exists) {
        setShowResetForm(true);
      } else {
        alert("Email not found. Please enter a registered email.");
      }
    } catch (err) {
      alert("Error verifying email. Check the console.");
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email.trim() || !newPassword.trim()) return alert("Please enter all required fields.");
  
    try {
      const res = await axios.post("http://localhost:5000/users/reset-password", { email: formData.email, newPassword });
      
      if (res.data?.success) {
        alert(res.data.message);
        setShowResetForm(false);
        setNewPassword("");
        setIsRegister(false); // Redirect back to login
      } else {
        alert("Failed to reset password. Try again.");
      }
    } catch (err) {
      alert("Error resetting password. Check the console.");
    }
  };

  return (
    <div>
      <div className="app-name">Virtual Telescope</div>

      <div className={`wrapper ${isRegister ? "active" : ""}`}>
        <div className="form-container">
          {/* Login Form */}
          <div className="form-box login">
            {!showResetForm ? (
              <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <div className="input-box">
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  <MdEmail className="icon" />
                </div>
                <div className="input-box">
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                  <FaUserLock className="icon" />
                </div>
                <div className="remember-forgot">
                  <label className="remember-me">
                    <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} /> 
                    <span>Remember me</span>
                  </label>
                  <a href="#" onClick={handleForgotPassword} className="forgot-password">
                   Forgot password?
                   </a>
                </div>
                <button type="submit">Sign In</button>
                <div className="register-link">
                  <p>
                    Don't have an account?{" "}
                    <span onClick={() => setIsRegister(true)} className="switch-form">Sign Up</span>
                  </p>
                </div>
              </form>
            ) : (
              // Reset Password Form
              <div className="reset-password-form">
                <h1>Reset Password</h1>
                <p>Enter a new password for {formData.email}</p>
                <div className="input-box">
                  <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <FaUserLock className="icon" />
                </div>
                <button onClick={handleResetPassword}>Reset Password</button>
                <button className="cancel-btn" onClick={() => setShowResetForm(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Sign Up</h1>
              <div className="input-box">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <MdEmail className="icon" />
              </div>
              <div className="input-box">
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <FaUserLock className="icon" />
              </div>
              <div className="remember-forgot">
               <label className="terms-label">
                  <input type="checkbox" /> 
                  <span>I agree to the terms & conditions</span>
                </label>
              </div>
              <button type="submit">Sign Up</button>
              <div className="register-link">
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setIsRegister(false)} className="switch-form">Sign In</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
