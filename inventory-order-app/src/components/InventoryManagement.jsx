import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/InventoryManagement.css';

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    stock: 0
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (error) {
      toast.error('Failed to load inventory: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || formData.stock < 0) {
      toast.error('Please enter valid product name and stock quantity');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, formData);
        toast.success('Inventory item updated successfully!');
      } else {
        await addInventoryItem(formData);
        toast.success('Inventory item added successfully!');
      }
      await loadInventory();
      handleCloseModal();
    } catch (error) {
      toast.error(`Failed to ${editingItem ? 'update' : 'add'} inventory item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteInventoryItem(id);
      toast.success('Inventory item deleted successfully!');
      await loadInventory();
    } catch (error) {
      toast.error('Failed to delete inventory item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      product: item.product,
      stock: item.stock
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      product: '',
      stock: 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      product: '',
      stock: 0
    });
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button className="add-button" onClick={handleAddNew}>
          Add New Item
        </button>
      </div>

      {inventory.length === 0 ? (
        <p className="no-data">No inventory items available.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product}</td>
                <td>{item.stock}</td>
                <td className="inventory-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product">Product Name:</label>
                <input
                  type="text"
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity:</label>
                <input
                  type="number"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? <span className="spinner"></span> : (editingItem ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement; 