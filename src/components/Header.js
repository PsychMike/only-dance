import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import defaultProfilePic from "../assets/imgs/default-profile.webp";
import "../assets/css/header.css"; // ✅ Import CSS

const Header = ({ currentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ✅ Create reference to detect outside clicks

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/"; // Redirect to home after logout
  };

  // ✅ Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // ✅ Close dropdown when clicking outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo">OnlyDance</Link>

      {currentUser && (
        <div className="dropdown" ref={dropdownRef}>
<img
  src={currentUser.photoURL || defaultProfilePic}
  alt="Profile"
  className="profile-picture"
  onClick={() => {
    console.log("Profile picture clicked!");
    console.log(currentUser)
    setDropdownOpen(!dropdownOpen);
  }}
/>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <button onClick={handleLogout} className="dropdown-item">Log Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
