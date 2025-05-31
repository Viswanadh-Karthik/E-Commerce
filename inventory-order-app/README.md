# Inventory & Order Management System

A React-based frontend application for managing inventory and orders, built with Vite and integrated with Spring Boot backend services.

## Features

- View inventory items in a responsive grid layout
- Place orders with real-time stock validation
- View order history
- Delete orders
- Real-time notifications for actions
- Responsive design for mobile and desktop
- Modern UI with smooth animations

## Tech Stack

- React 18+ with Vite
- React Router for navigation
- Axios for API requests
- React Toastify for notifications
- Vanilla CSS for styling

## Prerequisites

- Node.js 16+ and npm
- Running Spring Boot backend services:
  - Inventory Service (http://localhost:8081)
  - Order Service (http://localhost:8086)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-order-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/
│   ├── InventoryCard.jsx    # Card component for inventory items
│   ├── OrderForm.jsx        # Modal form for placing orders
│   └── OrderList.jsx        # Component for displaying orders
├── services/
│   └── api.js              # API integration with Axios
├── styles/
│   ├── App.css             # Global styles
│   ├── InventoryCard.css   # Styles for inventory cards
│   ├── OrderForm.css       # Styles for order form modal
│   └── OrderList.css       # Styles for order list
├── App.jsx                 # Main application component
└── main.jsx               # Application entry point
```

## API Integration

The application integrates with two backend services:

### Inventory Service (http://localhost:8081/inventory)
- GET /inventory - List all inventory items
- GET /inventory/check - Check stock availability
- PUT /inventory/reduce - Reduce stock
- POST /inventory - Add new inventory item
- PUT /inventory/{id} - Update inventory item

### Order Service (http://localhost:8086/orders)
- POST /orders - Create new order
- GET /orders - List all orders
- GET /orders/{id} - Get specific order
- PUT /orders/{id} - Update order
- DELETE /orders/{id} - Delete order

## Development

- The application uses Vite for fast development and building
- CSS variables are defined in App.css for consistent theming
- Components are built with reusability and maintainability in mind
- Error handling and loading states are implemented throughout

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
