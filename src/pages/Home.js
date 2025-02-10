import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import "../assets/css/home.css"; // ✅ Import external CSS

const Home = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Listen for Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Handle Login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      navigate("/profile"); // ✅ Redirect to profile after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // ✅ Fetch Users for Profile Picture Row
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Fetch Random Videos from Firestore
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollection = collection(db, "videos");
        const videosSnapshot = await getDocs(videosCollection);
        let videoList = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Shuffle and select 10 random videos
        videoList = videoList.sort(() => Math.random() - 0.5).slice(0, 10);
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <>


      <div className="home-container">
        {/* ✅ Login Button (Only Show if Not Logged In) */}
        {!currentUser && (
          <div className="flex justify-center mb-6">
            <button onClick={handleLogin} className="login-button">
              Login with Google
            </button>
          </div>
        )}

        {/* ✅ User Profile Row */}
        <h2 className="text-3xl font-bold mb-4 text-center">Meet Our Dancers</h2>
        <div className="user-profile-row">
          {users.map((user) => (
            <Link to={`/profile/${user.id}`} key={user.id}>
              <img
                src={user.profilePicture || "/default-profile.png"}
                alt={user.username}
                className="user-profile-img"
              />
            </Link>
          ))}
        </div>

        {/* ✅ Random Videos Grid */}
        <h2 className="text-3xl font-bold mt-8 text-center">Featured Dance Videos</h2>
        <div className="video-grid">
          {videos.length === 0 ? (
            <p className="text-center text-gray-500">No videos available.</p>
          ) : (
            videos.map((video) => (
<div key={video.id} className="video-card">
  <h4 className="video-title">{video.description}</h4>
  <div className="video-wrapper">
    <ReactPlayer
      url={video.youtubeURL}
      controls
      width="100%"
      height="100%"
    />
  </div>
</div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
