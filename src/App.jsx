import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0.0, category: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/grocery-items');
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    // Validation
    if (!newItem.name.trim() || !newItem.category.trim() || newItem.quantity <= 0 || newItem.price < 0) {
      setError('Please enter valid name, category, quantity (>0), and price (>=0).');
      return;
    }
    try {
      if (editingItem) {
        await axios.put(`/api/grocery-items/${editingItem.id}`, newItem);
        setMessage('Item updated successfully!');
        setEditingItem(null);
      } else {
        await axios.post('/api/grocery-items', newItem);
        setMessage('Item added successfully!');
      }
      setNewItem({ name: '', quantity: 1, price: 0.0, category: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to save item.');
    }
  };

  const handleEdit = (item) => {
    setNewItem({ name: item.name, quantity: item.quantity, price: item.price, category: item.category || '' });
    setEditingItem(item);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setMessage('');
    setError('');
    try {
      await axios.delete(`/api/grocery-items/${id}`);
      setMessage('Item deleted successfully!');
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  return (
    <div className="App">
      <h1>Grocery Tracker</h1>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={newItem.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          min="1"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={newItem.price}
          onChange={handleInputChange}
          min="0"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newItem.category}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
        {editingItem && <button type="button" onClick={() => { setEditingItem(null); setNewItem({ name: '', quantity: 1, price: 0.0, category: '' }); }}>Cancel</button>}
      </form>
      <button onClick={fetchItems} style={{ marginBottom: '1rem' }}>List Items</button>
      {/* Table UI below will be rendered */}
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: '60%' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${Number(item.price).toFixed(2)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.category || ''}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                <button type="button" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;