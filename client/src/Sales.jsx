import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for programmatic navigation
import './styles/home.css';
import Header from './Header';  // Import the Header component
import axios from 'axios';  // To make HTTP requests

function Sales() {
  const [sales, setSales] = useState([]); // State to hold fetched sales
  const [error, setError] = useState('');  // State to hold error message
  const navigate = useNavigate();  // Initialize the navigate function

  // Fetch sales when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/sales')  // Endpoint for fetching sales
      .then((response) => {
        setSales(response.data); // Store fetched sales in state
      })
      .catch((error) => {
        console.log("Error fetching sales:", error);
        setError('Failed to load sales data. Please try again later.');  // Set error message
      });
  }, []);

  // Handle view action for sale details
  const handleView = (id) => {
    // Use the navigate function to redirect to the sale detail page (if you have one)
    navigate(`/viewSale/${id}`);
  };

  return (
    <div className="home-container">
      <Header title="Sales History" />  {/* Title for the page */}

      {error && <div className="error-message">{error}</div>}  {/* Display error message if any */}

      <div className="table-container">
        <h2 className="table-title">Sales List</h2>
        <table className="item-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Cashier Name</th>
              <th>Items Sold</th> {/* New column for Items Sold */}
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.invoiceNumber}</td>
                  <td>{sale.customerName}</td>
                  <td>{sale.totalAmount}</td>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.cashierName}</td>
                  <td>
                    {/* Display items and their quantities */}
                    {sale.itemDetails.slice(0, 3).map((itemDetail, index) => (
                      <div key={index}>
                        <span>{itemDetail.name} (Qty: {itemDetail.quantity})</span>
                      </div>
                    ))}
                    {sale.itemDetails.length > 3 && (
                      <button onClick={() => handleView(sale._id)}>View All Items</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No sales available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sales;
