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
      <div className="card">
        <div className="card-header">
          <div className="inventory-header-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.001 14H4z"/>
              <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"/>
            </svg>
            <h2>Inventory Management</h2>
            <p>Manage your products and stock levels</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Item
          </button>
        </div>

        <div className="card-body">
          <div className="inventory-items-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 4H3v6h8v-6z"/>
            </svg>
            <h3>Inventory Items</h3>
            <span className="item-count">{inventory.length} items</span>
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.product}</td>
                    <td><strong>{item.stock} units</strong></td>
                    <td><div className="status-badge status-in-stock">In Stock</div></td>
                    <td className="inventory-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(item)}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <div className="modal-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <h3>{editingItem ? 'Update Order' : 'Add New Inventory Item'}</h3>
              </div>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product">Product Name</label>
                <input
                  type="text"
                  id="product"
                  placeholder="Enter product name"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner"></span> : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
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