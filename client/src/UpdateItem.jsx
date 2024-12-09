import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function UpdateItem() {
  const { id } = useParams();  // Get the item ID from the URL
  const [item, setItem] = useState(null);  // State to hold the item data
  const [quantity, setQuantity] = useState('');  // State for the updated quantity
  const navigate = useNavigate();  // For programmatic navigation

  useEffect(() => {
    // Fetch the item by ID
    axios.get(`http://localhost:3001/items/${id}`)
      .then((response) => {
        setItem(response.data);  // Store the item data
        setQuantity(response.data.quantity);  // Set the current quantity
      })
      .catch((error) => {
        console.log("Error fetching item:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the item's quantity in the backend
    axios.put(`http://localhost:3001/items/${id}`, { quantity })
      .then((response) => {
        console.log("Item updated successfully");
        // Navigate back to the home page after successful update
        navigate('/home');
      })
      .catch((error) => {
        console.log("Error updating item:", error);
      });
  };

  return (
    <div className="update-item-container">
      <Header title="Inventory Management" ></Header>
      <h2>Update Item Quantity</h2>
      {item ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={item.name}
              disabled
            />
          </div>

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}  // Update quantity value
            />
          </div>

          <button type="submit" className="btn btn-primary">Update Quantity</button>
        </form>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
}

export default UpdateItem;
