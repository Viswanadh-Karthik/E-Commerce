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
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      let updatedOrder;
      if (editingOrder) {
        updatedOrder = await updateOrder(editingOrder.id, order);
        toast.success('Order updated successfully!');
      } else {
        updatedOrder = await placeOrder(order);
        toast.success('Order placed successfully!');
      }
      
      // Refresh both inventory and orders data
      const [inventoryData, ordersData] = await Promise.all([
        fetchInventory(),
        fetchOrders()
      ]);
      
      if (Array.isArray(inventoryData) && Array.isArray(ordersData)) {
        setInventory(inventoryData);
        setOrders(ordersData);
        setIsModalOpen(false);
        setEditingOrder(null);
      } else {
        throw new Error('Invalid data received from server');
      }
    } catch (error) {
      console.error('Order operation error in App:', error);
      toast.error(`Failed to ${editingOrder ? 'update' : 'place'} order: ${error.message}`);
      // Refresh inventory even on error to ensure UI is in sync
      try {
        const inventoryData = await fetchInventory();
        if (Array.isArray(inventoryData)) {
          setInventory(inventoryData);
        }
      } catch (refreshError) {
        console.error('Failed to refresh inventory after error:', refreshError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = (order) => {
    setEditingOrder(order);
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
    setSelectedProduct(product);
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setSelectedProduct(null);
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
            <div className="card">
              <div className="card-header">
                <div className="inventory-header-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/>
                  </svg>
                  <h2>Available Inventory</h2>
                  <p>Browse and order from available products</p>
                </div>
              </div>
              <div className="card-body">
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
              </div>
            </div>
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
          isOpen={isModalOpen}
          inventory={inventory}
          onSubmit={handleOrderSubmit}
          onClose={handleCloseModal}
          editingOrder={editingOrder}
          selectedProduct={selectedProduct}
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        Orders
      </Link>
      <Link 
        to="/inventory" 
        className={location.pathname === '/inventory' ? 'active' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.001 14H4z"/>
          <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"/>
        </svg>
        Inventory
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z"/>
            </svg>
            <h1>Inventory & Order Management</h1>
          </div>
          <Navigation />
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/inventory" element={<InventoryManagement />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2025 Inventory & Order Management System</p>
        </footer>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;