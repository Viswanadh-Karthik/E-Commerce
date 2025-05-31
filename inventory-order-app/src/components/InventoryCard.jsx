import PropTypes from 'prop-types';
import '../styles/InventoryCard.css';

function InventoryCard({ item, onOrder }) {
  return (
    <div className="inventory-card">
      <h3>{item.product}</h3>
      <p>Stock: {item.stock}</p>
      <button onClick={onOrder} className="order-button">
        Order
      </button>
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