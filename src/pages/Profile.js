import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, doc, where, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import ReactPlayer from "react-player";
import VideoPost from "../components/VideoPost";
import UploadProfilePic from "../components/UploadProfilePic"; // ✅ Import Upload Component
import defaultProfilePic from "../assets/imgs/default-profile.webp"; // ✅ Default profile picture

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      let profilePicture = userSnap.exists() ? userSnap.data().profilePicture : null;
      if (!profilePicture) {
        profilePicture = defaultProfilePic;
      }

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: currentUser.displayName || "Anonymous",
          email: currentUser.email,
          profilePicture: profilePicture,
        });
      }

      setUser({
        ...currentUser,
        profilePicture,
      });

      fetchVideos(currentUser.uid);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchVideos = async (userId) => {
    const q = query(collection(db, "videos"), where("userId", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // ✅ **Function to Remove a Video**
  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteDoc(doc(db, "videos", videoId));
      setVideos(videos.filter((video) => video.id !== videoId)); // ✅ Remove from UI
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Home Button */}
      <Link to="/" className="absolute top-4 left-4 bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">
        Home
      </Link>

      {/* Profile Picture (Top Right) */}
      {user && (
        <div className="absolute top-4 right-4">
          <img
            src={user?.profilePicture || defaultProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md object-cover"
            onError={(e) => (e.target.src = defaultProfilePic)} // ✅ Fallback if image fails to load
          />
        </div>
      )}

      {/* User Info */}
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold">{user?.displayName || "User"}</h2>
        <p className="text-gray-600">{user?.email}</p>

        {/* Upload Profile Picture Button */}
        <UploadProfilePic setUser={setUser} />
      </div>

      {/* Video Upload Section */}
      <VideoPost />

      {/* User's Videos */}
      <div className="mt-6">
        <h3 className="text-2xl font-bold">My Videos</h3>
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos posted yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="p-4 bg-white rounded-lg shadow-md border mt-4 relative">
              <h4 className="font-semibold">{video.description}</h4>
              <ReactPlayer url={video.youtubeURL} controls />

              {/* ✅ Delete Button */}
              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="absolute top-2 right-2 bg-red-500 text-black px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
