import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import InventoryCard from './components/InventoryCard';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import InventoryManagement from './components/InventoryManagement';
import { fetchInventory, placeOrder, fetchOrders, updateOrder, deleteOrder } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

function OrderPage() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);

  // Fetch inventory on mount
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          console.error('Received non-array inventory data:', data);
          toast.error('Invalid inventory data format received');
        }
      } catch (error) {
        console.error('Inventory fetch error in App:', error);
        toast.error('Failed to load inventory: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Received non-array orders data:', data);
          toast.error('Invalid orders data format received');
        }
      } catch (error) {
        console.error('Orders fetch error in App:', error);
        toast.error('Failed to load orders: ' + error.message);
      }
    };
    loadOrders();
  }, []);

  // Handle order submission (both new and update)
  const handleOrderSubmit = async (order) => {
    setLoading(true);
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, order);
        toast.success('Order updated successfully!');
        setEditingOrder(null);
      } else {
        await placeOrder(order);
        toast.success('Order placed successfully!');
      }
      const [inventoryData, ordersData] = await Promise.all([
        fetchInventory(),
        fetchOrders()
      ]);
      setInventory(inventoryData);
      setOrders(ordersData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Order operation error in App:', error);
      toast.error(`Failed to ${editingOrder ? 'update' : 'place'} order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = (order) => {
    setEditingOrder(order);
    setSelectedProduct(order.product);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteOrder(orderId);
      toast.success('Order deleted successfully!');
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Order deletion error in App:', error);
      toast.error('Failed to delete order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (product) => {
    setEditingOrder(null);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setSelectedProduct('');
  };

  return (
    <div className="order-page">
      {loading && inventory.length === 0 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading inventory...</p>
        </div>
      ) : (
        <>
          <section className="inventory-section">
            <h2>Available Inventory</h2>
            {inventory.length === 0 ? (
              <p className="no-data">No inventory items available.</p>
            ) : (
              <div className="inventory-grid">
                {inventory.map((item) => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    onOrder={() => openOrderModal(item.product)}
                  />
                ))}
              </div>
            )}
          </section>
          <section className="orders-section">
            <OrderList
              orders={orders}
              onUpdate={handleUpdateOrder}
              onDelete={handleDeleteOrder}
            />
          </section>
        </>
      )}
      {isModalOpen && (
        <OrderForm
          products={inventory.map(item => item.product)}
          selectedProduct={selectedProduct}
          onSubmit={handleOrderSubmit}
          onClose={handleCloseModal}
          loading={loading}
          initialQuantity={editingOrder?.quantity}
          isUpdate={!!editingOrder}
        />
      )}
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'active' : ''}
      >
        Orders
      </Link>
      <Link 
        to="/inventory" 
        className={location.pathname === '/inventory' ? 'active' : ''}
      >
        Inventory Management
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Inventory & Order Management</h1>
          <Navigation />
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/inventory" element={<InventoryManagement />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Powered by xAI</p>
        </footer>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;