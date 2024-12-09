import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/menu.css'; 
import Header from './Header';
import billingImage from './assets/billing.png';
import invImage from './assets/inventory.png';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
        <Header></Header>
      <div className="menu-card" onClick={() => navigate('/home')}>
        <h2>Inventory Management</h2>
        <img src={invImage} alt="Inventory" className="menu-card-image" />
      </div>
      <div className="menu-card" onClick={() => navigate('/billing')}>
        <h2>Billing System</h2>
        <img src={billingImage} alt="Inventory" className="menu-card-image" />
      </div>
    </div>
  );
};

export default Menu;
