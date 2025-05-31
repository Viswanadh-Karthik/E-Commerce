import PropTypes from 'prop-types';
import '../styles/OrderList.css';

function OrderList({ orders, onUpdate, onDelete }) {
  if (orders.length === 0) {
    return <p className="no-orders">No orders placed yet.</p>;
  }

  return (
    <div className="order-list">
      <h2>Order History</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td className="order-actions">
                <button 
                  className="update-button"
                  onClick={() => onUpdate(order)}
                >
                  Update
                </button>
                <button 
                  className="delete-button"
                  onClick={() => onDelete(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OrderList;