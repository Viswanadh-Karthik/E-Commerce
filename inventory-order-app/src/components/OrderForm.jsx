import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/OrderForm.css';

function OrderForm({ isOpen, onClose, inventory, onSubmit, editingOrder, selectedProduct }) {
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        product: editingOrder.product,
        quantity: editingOrder.quantity
      });
    } else if (selectedProduct) {
      setFormData({
        product: selectedProduct,
        quantity: 1
      });
    } else if (inventory.length > 0) {
      setFormData({
        product: inventory[0].product,
        quantity: 1
      });
    }
  }, [editingOrder, inventory, selectedProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <div className="modal-header">
          <div className="modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <h3>{editingOrder ? 'Update Order' : 'Place New Order'}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <select
              id="product"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.product}>
                  {item.product} (Stock: {item.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
              {editingOrder ? 'Update Order' : 'Place Order'}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

OrderForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  inventory: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingOrder: PropTypes.object,
  selectedProduct: PropTypes.string
};

export default OrderForm;