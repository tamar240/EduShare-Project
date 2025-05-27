import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: "white",
      padding: "10px",
      textAlign: "center",
      marginTop: "auto", // הסוד כאן
    }}>
      <p>Created by Tamar Vurzel</p>
      <p><a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=tamar36603@gmail.com&su=פנייה%20מאתר%20EduShare&body=שלום%20רציתי%20לפנות%20בנוגע%20ל..."
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0077cc', textDecoration: 'none', marginLeft: '5px' }}
        >
          support@EDUShare.co.il
        </a></p>
    </footer>
  );
};

export default Footer;
