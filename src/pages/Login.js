import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css"; // ✅ Import external CSS

const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome to OnlyDance!</h1>
      <button onClick={signInWithGoogle} className="login-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
