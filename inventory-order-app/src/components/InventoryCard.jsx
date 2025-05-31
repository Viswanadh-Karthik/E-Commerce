import PropTypes from 'prop-types';
import '../styles/InventoryCard.css';

function InventoryCard({ item, onOrder }) {
  // Determine stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) return { class: 'status-out-of-stock', text: 'Out of Stock' };
    if (stock < 10) return { class: 'status-low-stock', text: 'Low Stock' };
    return { class: 'status-in-stock', text: 'In Stock' };
  };

  const stockStatus = getStockStatus(item.stock);

  return (
    <div className="inventory-card card">
      <div className="inventory-card-header">
        <div className="inventory-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.001 14H4z"/>
            <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"/>
          </svg>
        </div>
        <div className={`status-badge ${stockStatus.class}`}>{stockStatus.text}</div>
      </div>
      <div className="inventory-card-content">
        <h3>{item.product}</h3>
        <div className="inventory-card-quantity">
          <span>Available:</span> <strong>{item.stock} units</strong>
        </div>
        <button 
          onClick={onOrder} 
          className="btn btn-primary order-button"
          disabled={item.stock <= 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          {item.stock > 0 ? 'Order Now' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

InventoryCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    product: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onOrder: PropTypes.func.isRequired,
};

export default InventoryCard;