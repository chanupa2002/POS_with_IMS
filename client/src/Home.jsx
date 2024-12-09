import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for programmatic navigation
import './styles/home.css';
import Header from './Header';  // Import the Header component
import axios from 'axios';  // To make HTTP requests

function Home() {
  const [items, setItems] = useState([]); // State to hold fetched items
  const navigate = useNavigate();  // Initialize the navigate function

  // Fetch items when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/items')
      .then((response) => {
        setItems(response.data); // Store fetched items in state
      })
      .catch((error) => {
        console.log("Error fetching items:", error);
      });
  }, []);

  // Handle update action
  const handleUpdate = (id) => {
    // Use the navigate function to redirect to the update item page
    navigate(`/updateItem/${id}`);
  };

  // Handle delete action with confirmation
  const handleDelete = (id) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    
    if (isConfirmed) {
      // Send a DELETE request to the backend to delete the item
      axios.delete(`http://localhost:3001/items/${id}`)
        .then((response) => {
          console.log('Item deleted successfully:', response.data);
          // Remove the deleted item from the state
          setItems(items.filter(item => item._id !== id));
        })
        .catch((error) => {
          console.log("Error deleting item:", error);
        });
    }
  };

  return (
    <div className="home-container">
      <Header title="Inventory Management" />

      <div className="action-container">
        <button className="add-item-btn" onClick={() => navigate('/additem')}>Add Item</button>
      </div>

      <div className="table-container">
        <h2 className="table-title">Items List</h2>
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  {
                    item.quantity === 0?(
                      <span className='oos'>Out of Stock</span>
                    ):(
                      item.quantity
                    )
                  }
                </td>
                <td>
                  <button 
                    className="update-btn" 
                    onClick={() => handleUpdate(item._id)}  // Pass item ID for redirection
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}  // Trigger delete with confirmation
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
