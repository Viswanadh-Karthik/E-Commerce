import axios from 'axios';

const INVENTORY_API = 'http://127.0.0.1:8081';
const ORDER_API = 'http://127.0.0.1:8086';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Request Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const fetchInventory = async () => {
  try {
    console.log('Fetching inventory from:', `${INVENTORY_API}/inventory`);
    const response = await axios.get(`${INVENTORY_API}/inventory`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Raw inventory response:', response);
    if (!Array.isArray(response.data)) {
      console.error('Inventory data is not an array:', response.data);
      throw new Error('Invalid inventory data format');
    }
    return response.data;
  } catch (error) {
    console.error('Inventory fetch error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the inventory service. Please ensure the service is running at http://127.0.0.1:8081');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch inventory');
  }
};

export const placeOrder = async (order) => {
  try {
    const response = await axios.post(`${ORDER_API}/orders`, order, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Order placement error:', error);
    throw new Error(error.response?.data?.message || 'Failed to place order');
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${ORDER_API}/orders`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Orders fetch error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${ORDER_API}/orders/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Order fetch error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrder = async (id, order) => {
  try {
    const response = await axios.put(`${ORDER_API}/orders/${id}`, order, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Order update error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${ORDER_API}/orders/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Order deletion error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};

// Inventory Management APIs
export const addInventoryItem = async (inventory) => {
  try {
    const response = await axios.post(`${INVENTORY_API}/inventory`, inventory, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Inventory addition error:', error);
    throw new Error(error.response?.data?.message || 'Failed to add inventory item');
  }
};

export const updateInventoryItem = async (id, inventory) => {
  try {
    const response = await axios.put(`${INVENTORY_API}/inventory/${id}`, inventory, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Inventory update error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update inventory item');
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${INVENTORY_API}/inventory/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Inventory deletion error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete inventory item');
  }
};