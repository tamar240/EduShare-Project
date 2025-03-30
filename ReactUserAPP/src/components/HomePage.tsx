"use client";

import Login from "./login/Login";

export default function Homepage() {


  return (
    <div id="homePage"  style={{backgroundImage:"url('./../assets/homeBackground.jpg')" ,position: "relative", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", color: "white", fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
      {/* רקע עם תמונה */}
      <div id="backgroundImageContainer"></div>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "15px 30px", background: "rgba(255, 255, 255, 0.1)", position: "fixed", top: 0, left: 0, zIndex: 1 }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "white", textShadow: "0 0 10px rgba(58, 129, 255, 0.8)", transition: "all 0.3s ease-in-out" }}>EduShare </h1>
      </header>

      {/* Hero Section */}
      <main style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100vh", padding: "20px", textAlign: "center", zIndex: 1, animation: "fadeIn 3s ease-out" }}>
        <h2 style={{ fontSize: "60px", fontWeight: "bold", textShadow: "0 0 25px rgba(255, 255, 255, 0.7)", animation: "slideIn 2s ease-out" }}>
          Revolutionize Your
          <span style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)", WebkitBackgroundClip: "text", color: "transparent" }}> Teaching Experience</span>
        </h2>
        <p style={{ fontSize: "20px", margin: "20px 0", color: "rgba(255, 255, 255, 0.8)", animation: "fadeInText 4s ease-in-out" }}>
          EduShare is a platform that helps teachers to organize, share, and manage learning materials in an intuitive, smart, and futuristic way.
          Our goal is to make teaching easier, faster, and more organized for both teachers and students.
        </p>

        {/* הכפתור */}
        <div style={{ display: "flex", gap: "20px", marginTop: "30px", justifyContent: "center" }}>
          <Login></Login>
        </div>
      </main>

      <style>{`
        #backgroundImageContainer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-image: url('/assets/homeBackground.jpg');
          background-size: cover;
          background-position: center;
          z-index: -1;
        }

        #homePage {
          position: relative;
        }

        @keyframes backgroundPulse {
          0% { background: radial-gradient(circle, rgba(58,129,255,0.1) 10%, rgba(0,0,0,1) 100%); }
          50% { background: radial-gradient(circle, rgba(58,129,255,0.5) 10%, rgba(0,0,0,1) 100%); }
          100% { background: radial-gradient(circle, rgba(58,129,255,0.1) 10%, rgba(0,0,0,1) 100%); }
        }

        @keyframes slideIn {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fadeInText {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}