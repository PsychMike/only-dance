import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM Loaded. Waiting for Firebase authentication...");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("🚨 No user found. Redirecting to login.");
            window.location.href = "page-login.html";
            return;
        }

        console.log("✅ User is logged in:", user.email);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("📌 User data loaded:", userData);

            // ✅ Populate Profile Data
            document.getElementById("profile-name").textContent = userData.username || "Your Name";
            document.getElementById("profile-picture").src = userData.profilePicture || "default-profile.png";
            document.getElementById("followers-count").textContent = userData.followers || 0;
            document.getElementById("following-count").textContent = userData.following || 0;

            // ✅ Load User Videos into Carousel
            loadUserVideos(userData.videos || []);
        } else {
            console.log("🚨 No user data found in Firestore.");
        }

        // ✅ Add event listener for adding Instagram Reels
        document.getElementById("add-video-btn").addEventListener("click", async () => {
            const videoURL = document.getElementById("video-url-input").value.trim();
            if (!videoURL) {
                alert("Please enter a valid Instagram Reel URL.");
                return;
            }

            // Check if it's an Instagram Reel
            if (!isInstagramReel(videoURL)) {
                alert("Invalid URL. Only Instagram Reels are allowed.");
                return;
            }

            // Ensure Reel is Public
            const isPublic = await isInstagramReelPublic(videoURL);
            if (!isPublic) {
                alert("🚨 This Instagram Reel is private or does not exist. Please enter a public Reel.");
                return;
            }

            try {
                await updateDoc(userRef, {
                    videos: arrayUnion(videoURL)
                });

                console.log(`✅ Instagram Reel added successfully:`, videoURL);
                loadUserVideos([...userSnap.data().videos, videoURL]);

                document.getElementById("video-url-input").value = ""; // Clear input
            } catch (error) {
                console.error("🔥 Error adding video:", error);
                alert("Failed to add video. Try again.");
            }
        });
    });
});

// ✅ Function to Load User Videos
function loadUserVideos(videos) {
    const videoSlider = document.getElementById("user-video-slider");
    const noVideosText = document.getElementById("no-videos-text");

    // Clear previous content
    videoSlider.innerHTML = "";

    if (videos.length > 0) {
        console.log("🎥 Loading user videos:", videos);
        noVideosText.style.display = "none";
        document.getElementById("posts-count").textContent = videos.length;

        videos.forEach(videoURL => {
            if (isInstagramReel(videoURL)) {
                const videoSlide = document.createElement("div");
                videoSlide.classList.add("splide__slide", "ps-3");

                videoSlide.innerHTML = `
                    <div data-card-height="220" class="card shadow-xl rounded-m">
                        <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${videoURL}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                        </blockquote>
                    </div>
                `;

                videoSlider.appendChild(videoSlide);
            }
        });

        // ✅ Ensure Splide Carousel Loads Properly
        setTimeout(() => {
            if (typeof Splide !== "undefined") {
                new Splide("#user-video-carousel", {
                    type: "loop",
                    perPage: 2,
                    autoplay: true,
                    gap: "1rem",
                    pagination: false,
                }).mount();
                console.log("✅ Splide.js carousel initialized.");
            } else {
                console.error("🚨 Splide.js is not loaded.");
            }

            // ✅ Process Instagram embeds dynamically
            if (typeof window.instgrm !== "undefined" && window.instgrm.Embeds) {
                window.instgrm.Embeds.process();
                console.log("✅ Instagram embeds processed.");
            } else {
                console.error("🚨 Instagram embed script not loaded.");
            }
        }, 500);
    } else {
        console.log("🚨 No videos found for user.");
        noVideosText.style.display = "block";
        document.getElementById("posts-count").textContent = "0";
    }
}

// ✅ Function to Check if URL is an Instagram Reel
function isInstagramReel(url) {
    const instagramReelRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9-_]+)/;
    return instagramReelRegex.test(url);
}

// ✅ Function to Check if Instagram Reel is Public
async function isInstagramReelPublic(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });

        // If response is OK (200-299), the reel is public
        return response.ok;
    } catch (error) {
        console.error("🚨 Error checking Instagram Reel privacy:", error);
        return false;
    }
}

// ✅ Ensure Instagram Embed Script is Loaded
function ensureInstagramEmbedScript() {
    if (!document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
        let script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }
}
