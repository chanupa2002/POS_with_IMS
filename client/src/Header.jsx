import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/header.css';  // Assuming we have header.css for styling

function Header({title}) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    // Clear the localStorage to log out
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    // Navigate back to the login page
    navigate('/login');
  };

  const navigateHome = () => {
    navigate('/menu');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        {username && <span className="welcome-message">Welcome, {username} !</span>}

        <button className="home-btn" onClick={navigateHome}>Home</button>

        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </header>
  );
}

export default Header;
