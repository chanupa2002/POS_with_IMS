import React, { useState } from 'react';
import './styles/additem.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate after item is added
import Header from './Header';  // Import the Header component


function Additem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the inputs (optional but a good practice)
    if (!name || !description || !price || !quantity) {
      alert('All fields are required!');
      return;
    }

    // Send POST request to add the item
    axios
      .post('http://localhost:3001/additem', { name, description, price, quantity })
      .then((result) => {
        console.log(result);
        // Redirect to home page or show success message
        navigate('/home');
      })
      .catch((err) => {
        console.log(err);
        alert('There was an error adding the item.');
      });
  };

  return (
    <div>
      <Header title="Inventory Management" />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h3 className="text-center mb-4">Add New Item</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter item name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    placeholder="Enter item description"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    placeholder="Enter item price"
                    value={price}
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    placeholder="Enter item quantity"
                    value={quantity}
                    required
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Add Item
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Additem;
