import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/billing.css';
import Header from './Header';
import axios from 'axios';

function Billing() {
  const [items, setItems] = useState([]);  // State to hold available items
  const [cart, setCart] = useState([]);  // State to hold items added to cart
  const [customerName, setCustomerName] = useState('');  // State for customer name
  const [isNameLocked, setIsNameLocked] = useState(false);  // Lock the name input after adding to cart
  const [quantityToAdd, setQuantityToAdd] = useState({});  // State to hold quantity for adding to cart
  const navigate = useNavigate();

  // Fetch items from the backend when the component mounts
  useEffect(() => {
    // Retrieve cart and customer name from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    const storedCustomerName = localStorage.getItem('customerName');

    if (storedCart) {
      setCart(storedCart);  // Set cart from localStorage
    }
    if (storedCustomerName) {
      setCustomerName(storedCustomerName);  // Set customer name from localStorage
    }

    // Fetch items from the backend when the component mounts
    axios.get('http://localhost:3001/items')
      .then((response) => {
        setItems(response.data);  // Store fetched items in state
      })
      .catch((error) => {
        console.log("Error fetching items:", error);
      });
  }, []);

  // Handle adding an item to the cart with a specified quantity
  const handleAddToCart = (item) => {
    const quantity = quantityToAdd[item._id] || 1;  // Get the quantity, default to 1 if not specified

    if (!customerName) {
      alert("Please enter a customer name!");
      return;
    }

    // Check if item is already in the cart
    const existingItem = cart.find(cartItem => cartItem._id === item._id);

    if (existingItem) {
      // If item is already in the cart, update the quantity
      setCart(cart.map(cartItem =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ));
    } else {
      // Add the new item to the cart
      setCart([...cart, { ...item, quantity }]);
    }

    // Update the quantity in the database and immediately update the UI
    axios.put(`http://localhost:3001/items/${item._id}`, {
      quantity: item.quantity - quantity
    })
      .then(() => {
        // After successful database update, reflect the updated quantity in the state
        setItems(items.map(i => i._id === item._id ? { ...i, quantity: i.quantity - quantity } : i));
      })
      .catch((error) => {
        console.log("Error updating item quantity:", error);
      });

    // Reset the quantity input field after adding to the cart
    setQuantityToAdd({ ...quantityToAdd, [item._id]: '' });

    // Lock the customer name input once an item is added to the cart
    setIsNameLocked(true);

    // Persist cart data in localStorage
    localStorage.setItem('cart', JSON.stringify([...cart, { ...item, quantity }]));
  };

  // Handle customer name input change
  const handleNameChange = (e) => {
    if (!isNameLocked) {
      setCustomerName(e.target.value);
    }
  };

  // In your Billing component
  const handleCheckout = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cashierName = "Cashier Name"; // This can be dynamically set
  const saleData = {
    customerName,
    cashierName,
    totalAmount,
    itemDetails: cart
  };

  // Store customerName in localStorage before navigating
  localStorage.setItem('customerName', customerName);

  // Remove the axios.post part to prevent saving data to the sales table
  // axios.post('http://localhost:3001/sales', saleData)
  //   .then((response) => {
  //     console.log('Sale saved successfully:', response.data);
  //     navigate('/checkout');
  //   })
  //   .catch((error) => {
  //     console.error('Error saving sale:', error);
  //   });

  // Directly navigate to the checkout page without saving to the database
  navigate('/checkout');
};

  
  // Cancel the order and clear the cart, reverting changes in the database
  const handleCancelOrder = () => {
    cart.forEach(cartItem => {
      const originalItem = items.find(item => item._id === cartItem._id);
  
      if (originalItem) {
        axios.put(`http://localhost:3001/items/${cartItem._id}`, {
          quantity: originalItem.quantity + cartItem.quantity,
        })
          .then(() => {
            console.log(`Restored quantity for item: ${cartItem.name}`);
          })
          .catch((error) => {
            console.error("Error restoring item quantity:", error);
          });
      }
    });
  
    setCart([]);
    setCustomerName('');
    setIsNameLocked(false);
  
    localStorage.removeItem('cart');
    localStorage.removeItem('customerName');
  
    axios.get('http://localhost:3001/items')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching items after canceling order:", error);
      });
  };
  

  // Handle removing a specific quantity of an item from the cart
  const handleRemoveFromCart = (itemId, quantity) => {
    // Find the item in the cart
    const itemInCart = cart.find(cartItem => cartItem._id === itemId);

    if (itemInCart && itemInCart.quantity >= quantity) {
      // Update the cart with the removed quantity
      const updatedCart = cart.map(cartItem =>
        cartItem._id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - quantity }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0); // Remove item if quantity becomes 0

      // Update the available items in the inventory
      setCart(updatedCart);

      // Update the item quantity in the backend (add the quantity back to stock)
      axios.put(`http://localhost:3001/items/${itemId}`, {
        quantity: itemInCart.quantity + quantity  // Add back the removed quantity
      })
        .then(() => {
          // After successful database update, reflect the updated quantity in the available items list
          setItems(items.map(i => i._id === itemId ? { ...i, quantity: i.quantity + quantity } : i));
        })
        .catch((error) => {
          console.log("Error updating item quantity:", error);
        });

      // Persist updated cart in localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Handle quantity change for adding to cart
  const handleQuantityChange = (itemId, e) => {
    const value = parseInt(e.target.value) || 1; // Default to 1 if invalid value
    setQuantityToAdd({ ...quantityToAdd, [itemId]: value });
  };

  return (
    <div className="billing-container">
      <Header title="Billing System" />

      

      <div className="table-container">
        <h2 className="table-title">Available Items</h2>
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
                  {item.quantity === 0 ? (
                    <span className="oos">Out of Stock</span>
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>
                  {/* Input for specifying quantity to add */}
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    placeholder="Qty"
                    value={quantityToAdd[item._id] || ''}
                    onChange={(e) => handleQuantityChange(item._id, e)}  // Handle quantity change
                  />
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}  // Add item to cart with the specified quantity
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="customer-details">
        <span>Customer Name : </span>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={handleNameChange}
          disabled={isNameLocked}  // Disable the input if the name is locked
        />
      </div>
      <div className="cart-container">
        <h2>Cart</h2>
        {cart.length > 0 ? (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem, index) => (
                <tr key={index}>
                  <td>{cartItem.name}</td>
                  <td>{cartItem.quantity}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={cartItem.quantity}
                      defaultValue="1"
                      id={`remove-quantity-${cartItem._id}`}
                    />
                    <button
                      className="remove-from-cart-btn"
                      onClick={() => {
                        const quantityToRemove = parseInt(document.getElementById(`remove-quantity-${cartItem._id}`).value);
                        handleRemoveFromCart(cartItem._id, quantityToRemove);
                      }}  // Remove item from cart
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="checkout-container">
        <button onClick={handleCheckout}>Proceed to Checkout</button>
        <button onClick={handleCancelOrder} className="cancel-order-btn">
          Cancel Order
        </button>
      </div>
    </div>
  );
}

export default Billing;
