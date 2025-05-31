import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/OrderForm.css';

function OrderForm({ products, selectedProduct, onSubmit, onClose, loading, initialQuantity, isUpdate }) {
  const [product, setProduct] = useState(selectedProduct || '');
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  // Update form when selectedProduct or initialQuantity changes
  useEffect(() => {
    setProduct(selectedProduct || '');
    setQuantity(initialQuantity || 1);
  }, [selectedProduct, initialQuantity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product || quantity < 1) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }
    onSubmit({ product, quantity });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isUpdate ? 'Update Order' : 'Place Order'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product:</label>
            <select
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              disabled={loading || isUpdate}
            >
              <option value="">Select a product</option>
              {products.map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <span className="spinner"></span> : (isUpdate ? 'Update Order' : 'Place Order')}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

OrderForm.propTypes = {
  products: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedProduct: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  initialQuantity: PropTypes.number,
  isUpdate: PropTypes.bool,
};

OrderForm.defaultProps = {
  initialQuantity: 1,
  isUpdate: false,
};

export default OrderForm;