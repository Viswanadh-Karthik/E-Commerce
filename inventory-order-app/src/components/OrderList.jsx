import PropTypes from 'prop-types';
import '../styles/OrderList.css';

function OrderList({ orders, onUpdate, onDelete }) {
  if (orders.length === 0) {
    return <p className="no-orders">No orders placed yet.</p>;
  }

  return (
    <div className="order-list card">
      <div className="card-header">
        <div className="order-list-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011.5 19c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L22.5 22l-4.5-4.5v-.79l-.27-.28A6.516 6.516 0 0113 18c-2.5 0-4.55-1.79-5-4.15C5.5 13.08 4 10.92 4 8.5V8c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v.5c0 2.42-1.5 4.58-4 5.35"/>
          </svg>
          <h2>Order History</h2>
        </div>
        <div className="order-count">{orders.length} orders</div>
      </div>
      <div className="card-body">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.product}</td>
                <td>{order.quantity} units</td>
                <td className="order-actions">
                  <button 
                    className="btn btn-edit"
                    onClick={() => onUpdate(order)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => onDelete(order.id)}
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
      </div>
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