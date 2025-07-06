import React from "react";
import "./Header.css";

// Image URLs from public folder
const LOGO_URL = "/logo.png";

interface HeaderProps {
  onViewMoreClick: () => void;
}

function Header({ onViewMoreClick }: HeaderProps) {
  return (
    <header className="header">
      <img src={LOGO_URL} alt="LawVriksh Logo" className="logo" />
      <nav className="navigation">
        <button className="nav-button" onClick={onViewMoreClick}>
          View More
        </button>
      </nav>
    </header>
  );
}

export default Header;
