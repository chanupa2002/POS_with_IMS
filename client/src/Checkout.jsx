import React, { useEffect, useState } from 'react';
import './styles/checkout.css';
import Header from './Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Checkout() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(''); // Added confirmation message state
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate(); // Initialize navigate

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
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const saleData = {
      customerName,
      cashierName,
      totalAmount,
      itemDetails: cart,
    };

    axios.post('http://localhost:3001/sales', saleData)
      .then(response => {
        console.log('Sale saved successfully:', response.data);

        // Update inventory after order confirmation
        const updateInventoryPromises = cart.map(item => {
          const newQuantity = item.cartQuantity; // Calculate the new quantity
          return axios.put(`http://localhost:3001/items/${item._id}`, {
            quantity: newQuantity, // Update with the new quantity
          });
        });

        // Wait for all inventory updates to complete
        Promise.all(updateInventoryPromises)
          .then(() => {
            console.log("All inventory updated successfully");

            // Clear cart from localStorage and state
            localStorage.removeItem('cart');
            setCart([]); // Clear cart state

            // Display confirmation message
            setConfirmationMessage("Order confirmed. Thank you for your purchase!");

            // Trigger printing and navigation to home
            window.print();

            // Use setTimeout to navigate to home after the print dialog is closed
            setTimeout(() => {
              setCustomerName('');
              localStorage.removeItem('customerName');
              navigate('/menu'); // Navigate to the home page
            }, 1000);
          })
          .catch(error => {
            console.error("Error updating inventory:", error);
          });

      })
      .catch(error => {
        console.error('Error saving sale:', error);
      });
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

      {/* Show confirmation message */}
      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}

      <div className="checkout-buttons">
        <button onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
    </div>
  );
}

export default Checkout;
