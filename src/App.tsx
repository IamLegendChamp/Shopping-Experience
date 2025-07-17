import { createContext, useState, useContext } from 'react';

// 1. Create Cart Context (inside App.js)
const CartContext = createContext();

// 2. Custom Provider Component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom Hook (also inside App.js)
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 4. Product Component
const Product = ({ product }) => {
  const { addItem } = useCart();
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
};

// 5. Cart Component
const Cart = () => {
  const { cart, removeItem, clearCart } = useCart();

  return (
    <div>
      <h2>Cart ({cart.length})</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} (x{item.quantity})
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

// 6. Main App Component
export default function App() {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Headphones', price: 149 },
  ];

  return (
    <CartProvider>
      <div style={{ padding: '20px' }}>
        <h1>Shop</h1>
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Product List */}
          <div>
            <h2>Products</h2>
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>

          {/* Cart */}
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}