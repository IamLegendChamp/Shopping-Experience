import { useState, useEffect, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import "./App.css";

const mockWebSocket = (callback) => {
  let id = 100;
  const intervalId = setInterval(() => {
    const newSale = {
      id: id++,
      product: `Product ${Math.floor(Math.random() * 10)}`,
      amount: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    };
    callback(newSale);
  }, 1000);
  return () => clearInterval(intervalId);
};

const TableRow = ({ data, index, style }) => {
  const product = data[index];
  return (
    <div style={style} className="table-row">
      <div className="table-cell">{product.id}</div>
      <div className="table-cell">{product.product}</div>
      <div className="table-cell">{product.amount}</div>
      <div className="table-cell">
        {new Date(product.timestamp).toLocaleTimeString([], { hour12: false })}
      </div>
    </div>
  );
};

function DashboardWidget({ products, onChangeOrder, order }) {
  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-cell">ID</div>
        <div className="table-cell">PRODUCT</div>
        <div className="table-cell">
          <button onClick={onChangeOrder}>
            AMOUNT ({order === 'asc' ? '↑' : order === 'desc' ? '↓' : '⇅'})
          </button>
        </div>
        <div className="table-cell">TIMESTAMP</div>
      </div>
      <List
        height={400}
        itemCount={products.length}
        itemSize={35}
        width="100%"
        itemData={products}
      >
        {TableRow}
      </List>
    </div>
  );
};

const App3 = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [order, setOrder] = useState(null);
  const [inputVal, setInputVal] = useState("");

  // useEffect(() => {
  //     const cleanup = mockWebSocket((newSale) => {
  //         setAllProducts(prev => [...prev, newSale]);
  //     });
  //     return cleanup;
  // }, []);

  // Initial test data
  useEffect(() => {
    const initialData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      product: `Product ${Math.floor(Math.random() * 10)}`,
      amount: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    }));
    setAllProducts(initialData);
  }, []);

  const products = useMemo(() => {
    let result = allProducts.filter(product =>
      inputVal && Number(inputVal) > 0
        ? product.amount > Number(inputVal)
        : true
    );

    if (order === 'asc') {
      result = [...result].sort((a, b) => a.amount - b.amount);
    } else if (order === 'desc') {
      result = [...result].sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [allProducts, inputVal, order]);

  const onChangeOrder = useCallback(() => {
    setOrder(prev => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  }, []);

  return (
    <div className="app-container">
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        placeholder="Enter threshold"
      />
      <DashboardWidget
        products={products}
        order={order}
        onChangeOrder={onChangeOrder}
      />
    </div>
  );
};

export default App3;