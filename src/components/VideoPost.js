import React, { useState } from "react";
import ReactPlayer from "react-player";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const VideoPost = () => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handlePost = async () => {
    if (!url.trim()) {
      alert("Please enter a YouTube URL.");
      return;
    }

    try {
      await addDoc(collection(db, "videos"), {
        userId: auth.currentUser.uid,
        youtubeURL: url,
        description,
        timestamp: serverTimestamp(),
      });

      setUrl("");
      setDescription("");
      alert("Video posted successfully!");
    } catch (error) {
      console.error("Error posting video:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Post a YouTube Video</h2>
      <input
        type="text"
        placeholder="YouTube Video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handlePost}
        className="bg-green-500 text-black px-4 py-2 rounded"
      >
        Post Video
      </button>

      {url && (
        <div className="mt-4">
          <ReactPlayer url={url} controls />
        </div>
      )}
    </div>
  );
};

export default VideoPost;
