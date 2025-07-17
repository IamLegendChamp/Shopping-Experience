import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type ReactElement
} from 'react';

// 1. Define types
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

// 2. Create Context with default value
const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => { },
  removeItem: () => { },
  clearCart: () => { },
});

// 3. Type the Provider props
const CartProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>): void => {
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

  const removeItem = (id: number): void => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = (): void => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom hook with proper typing
const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 5. Type Product props
interface ProductProps {
  product: Omit<CartItem, 'quantity'>;
}

const Product = ({ product }: ProductProps): ReactElement => {
  const { addItem } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
};

// 6. Cart component
const Cart = (): ReactElement => {
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

// 7. Main App component
export default function App(): ReactElement {
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
          <div>
            <h2>Products</h2>
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}