import React, { useState } from "react";
import { storage, db, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

const UploadProfilePic = ({ setUser }) => {
  const [uploadStatus, setUploadStatus] = useState("Upload Profile Picture");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus("Compressing..."); // ✅ Show compression status

    const options = {
      maxSizeMB: 1, // Limit to 1MB
      maxWidthOrHeight: 500, // Resize if larger
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options); // ✅ Compress file

      setUploadStatus("Uploading..."); // ✅ Update status before upload
      const user = auth.currentUser;
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);

      // ✅ Upload the compressed file
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // ✅ Update Firestore with new profile picture URL
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profilePicture: downloadURL });

      // ✅ Update UI with new profile picture
      setUser((prevUser) => ({ ...prevUser, profilePicture: downloadURL }));

      setUploadStatus("✅ Uploaded Successfully!"); // ✅ Show success message
      setTimeout(() => setUploadStatus("Upload Profile Picture"), 3000); // Reset after 3 seconds
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("❌ Upload Failed, Try Again"); // ✅ Show error message
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        id="profile-pic-upload"
        className="hidden"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="profile-pic-upload"
        className={`cursor-pointer px-4 py-2 rounded border border-black text-black ${
          uploadStatus.includes("Compressing")
            ? "bg-blue-300"
            : uploadStatus.includes("Uploading")
            ? "bg-yellow-300"
            : uploadStatus.includes("✅")
            ? "bg-green-300"
            : uploadStatus.includes("❌")
            ? "bg-red-300"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {uploadStatus}
      </label>
    </div>
  );
};

export default UploadProfilePic;
