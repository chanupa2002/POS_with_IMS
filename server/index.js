const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./models/Employee');
const ItemModel = require('./models/Item');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee")
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// Register endpoint for employees
app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(emps => res.json(emps))
    .catch(err => res.json(err));
});

// Login endpoint for employees
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json({ status: "success", user: user.name });
        } else {
          res.json({ status: "incorrect_password" });
        }
      } else {
        res.json({ status: "No_account_found" });
      }
    })
    .catch(err => res.json({ status: "error", error: err }));
});

// Add item to inventory
app.post('/additem', (req, res) => {
  const { name, description, price, quantity } = req.body;

  ItemModel.create({ name, description, price, quantity })
    .then(item => res.json({ message: "Item added successfully", item }))
    .catch(err => res.status(500).json({ message: "Error adding item", error: err }));
});

// Get all items
app.get('/items', (req, res) => {
  ItemModel.find()
    .then(items => res.json(items))
    .catch(err => res.status(500).json({ message: "Error fetching items", error: err }));
});

// Fetch item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  ItemModel.findById(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching item', error: err }));
});

// Update item by ID (for quantity update)
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  ItemModel.findByIdAndUpdate(id, { quantity }, { new: true })
    .then(updatedItem => {
      if (updatedItem) {
        res.json({ message: 'Item updated successfully', updatedItem });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Error updating item', error: err }));
});

// DELETE Route (remove item)
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  ItemModel.findByIdAndDelete(id)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json({ message: "Item deleted successfully", deletedItem });
    })
    .catch((error) => {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Endpoint to handle adding items to the cart (update inventory)
app.put('/cart/add/:itemId', (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Decrease the quantity of the item in the database
  ItemModel.findById(itemId)
    .then(item => {
      if (item && item.quantity >= quantity) {
        // Update the item quantity in the database
        ItemModel.findByIdAndUpdate(itemId, { quantity: item.quantity - quantity }, { new: true })
          .then(updatedItem => res.json({ message: 'Item quantity updated', updatedItem }))
          .catch(err => res.status(500).json({ message: 'Error updating item', error: err }));
      } else {
        res.status(400).json({ message: 'Not enough stock available' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Item not found', error: err }));
});

// Endpoint to handle removing items from the cart (update inventory)
app.put('/cart/remove/:itemId', (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Increase the quantity of the item in the database
  ItemModel.findById(itemId)
    .then(item => {
      if (item) {
        ItemModel.findByIdAndUpdate(itemId, { quantity: item.quantity + quantity }, { new: true })
          .then(updatedItem => res.json({ message: 'Item quantity updated', updatedItem }))
          .catch(err => res.status(500).json({ message: 'Error updating item', error: err }));
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Error updating item', error: err }));
});

// Endpoint to revert changes when canceling the order (restore previous quantities)
// This can be done by tracking the previous quantity before making any updates
app.post('/cart/cancel', (req, res) => {
  const { cartItems } = req.body;  // An array of items with the previous quantity and id
  
  cartItems.forEach(item => {
    ItemModel.findById(item._id)
      .then(existingItem => {
        if (existingItem) {
          // Restore the quantity by updating it back to the previous quantity
          ItemModel.findByIdAndUpdate(item._id, { quantity: existingItem.quantity + item.quantity }, { new: true })
            .then(updatedItem => console.log(`Reverted ${updatedItem.name} quantity`))
            .catch(err => console.log('Error reverting item quantity:', err));
        }
      })
      .catch(err => console.log('Error fetching item for cancellation:', err));
  });

  res.json({ message: 'Order canceled, quantities reverted' });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
