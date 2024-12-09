import React, { useEffect, useState } from 'react';
import './styles/checkout.css';
import Header from './Header';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    const storedCustomerName = localStorage.getItem('customerName');
    const storedCashierName = localStorage.getItem('username'); 

    if (storedCart) {
      setCart(storedCart);
    }
    if (storedCustomerName) {
      setCustomerName(storedCustomerName);
    }
    if (storedCashierName) {
      setCashierName(storedCashierName);
    }
  }, []);

  const handleConfirmOrder = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      <div className="header-container">
        <Header title="Billing System : Invoice" />
      </div>

      <div className="invoice-header">
        <div className="company-info">
          <h2>Business Name</h2>
          <p>Business Address, City, Country</p>
          <p>Phone: (94)76 699 2183</p>
        </div>
        <div className="invoice-details">
          <h3>Invoice</h3>
          <p>Invoice No: #123456</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="customer-info">
        <h3>Customer Info</h3>
        <p>Name: {customerName}</p>
      </div>

      <div className="cart-details">
        <h3>Items</h3>
        {cart.length > 0 ? (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total items: {cart.length}</p>
        <p>Total amount: {cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
      </div>
      <p>Cashier: {cashierName}</p>

      <div className="checkout-buttons">
        <button onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
    </div>
  );
}

export default Checkout;
