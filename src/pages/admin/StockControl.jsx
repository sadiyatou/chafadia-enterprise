import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";

function StockControl() {
  const { products } = useStore();

  const sampleProducts = [
    {
      id: 1,
      name: "Orange Juice",
      category: "Halal Drinks",
      price: 1500,
      stock: 8,
      image: "",
    },
    {
      id: 2,
      name: "Pineapple Juice",
      category: "Halal Drinks",
      price: 1500,
      stock: 3,
      image: "",
    },
    {
      id: 3,
      name: "Banana Chips",
      category: "Snacks",
      price: 1000,
      stock: 0,
      image: "",
    },
  ];

  const [stockProducts, setStockProducts] = useState(
    products?.length ? products : sampleProducts
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const totalProducts = stockProducts.length;

  const totalStock = stockProducts.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const lowStock = stockProducts.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
  ).length;

  const outOfStock = stockProducts.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;

  const stockValue = stockProducts.reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const filteredProducts = useMemo(() => {
    return stockProducts.filter((product) => {
      const text = `${product.name} ${product.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());

      const quantity = Number(product.stock || 0);

      const matchesFilter =
        filter === "All" ||
        (filter === "Low Stock" && quantity > 0 && quantity <= 5) ||
        (filter === "Out of Stock" && quantity <= 0) ||
        (filter === "Available" && quantity > 5);

      return matchesSearch && matchesFilter;
    });
  }, [stockProducts, search, filter]);

  const updateStock = (id, amount) => {
    setStockProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;

        const newStock = Math.max(0, Number(product.stock || 0) + amount);

        return {
          ...product,
          stock: newStock,
        };
      })
    );
  };

  const setExactStock = (id, value) => {
    const cleanValue = Math.max(0, Number(value || 0));

    setStockProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: cleanValue,
            }
          : product
      )
    );
  };

  const getStockStatus = (stock) => {
    const quantity = Number(stock || 0);

    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "Available";
  };

  const getStatusClass = (stock) => {
    const quantity = Number(stock || 0);

    if (quantity <= 0) return "stock-danger";
    if (quantity <= 5) return "stock-warning";
    return "stock-success";
  };

  return (
    <>
      <Navbar />

      <div className="stock-page">
        <style>{`
          .stock-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 28%),
              radial-gradient(circle at bottom right, rgba(0, 74, 173, 0.12), transparent 32%),
              #f6f8ff;
          }

          .stock-container {
            max-width: 1250px;
            margin: 0 auto;
          }

          .stock-hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 30px;
            border-radius: 30px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.97), rgba(246,248,255,0.93));
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 24px 55px rgba(0, 31, 77, 0.13);
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
          }

          .stock-hero::after {
            content: "";
            position: absolute;
            width: 220px;
            height: 220px;
            right: -90px;
            top: -90px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.26), transparent 70%);
          }

          .stock-hero h1 {
            color: #001f4d;
            font-size: clamp(30px, 5vw, 48px);
            font-weight: 950;
            margin-bottom: 8px;
          }

          .stock-hero h1 span {
            color: #d4af37;
          }

          .stock-hero p {
            color: #667085;
            max-width: 720px;
            line-height: 1.7;
            font-weight: 600;
          }

          .stock-badge {
            padding: 12px 18px;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            font-weight: 950;
            white-space: nowrap;
            box-shadow: 0 14px 30px rgba(212,175,55,0.22);
            position: relative;
            z-index: 2;
          }

          .stock-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 210px));
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .stock-stat-card {
            background: rgba(255,255,255,0.97);
            border: 1px solid rgba(212,175,55,0.18);
            border-radius: 22px;
            padding: 17px;
            box-shadow: 0 14px 35px rgba(0,31,77,0.09);
            transition: 0.3s ease;
          }

          .stock-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 45px rgba(0,31,77,0.14);
          }

          .stock-stat-card h3 {
            color: #667085;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .stock-stat-card h2 {
            color: #d4af37;
            font-size: 25px;
            font-weight: 950;
          }

          .stock-tools {
            display: grid;
            grid-template-columns: 1.5fr 0.7fr;
            gap: 14px;
            margin-bottom: 22px;
          }

          .stock-tools input,
          .stock-tools select {
            width: 100%;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            font-weight: 750;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
          }

          .stock-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 260px));
            justify-content: center;
            gap: 18px;
          }

          .stock-card {
            background: rgba(255,255,255,0.98);
            border-radius: 24px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            overflow: hidden;
            transition: 0.3s ease;
          }

          .stock-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 24px 55px rgba(0,31,77,0.16);
          }

          .stock-image {
            height: 130px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.85), rgba(0,31,77,0.9)),
              radial-gradient(circle at top right, rgba(212,175,55,0.55), transparent 35%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff3c4;
            font-size: 42px;
            font-weight: 950;
          }

          .stock-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .stock-body {
            padding: 18px;
          }

          .stock-body h3 {
            color: #001f4d;
            font-size: 18px;
            margin-bottom: 6px;
          }

          .stock-category {
            color: #667085;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .stock-status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
            margin-bottom: 14px;
          }

          .stock-success {
            background: #dcfce7;
            color: #166534;
          }

          .stock-warning {
            background: #fff7d6;
            color: #92400e;
          }

          .stock-danger {
            background: #fee2e2;
            color: #991b1b;
          }

          .stock-info {
            display: grid;
            gap: 9px;
            margin-bottom: 14px;
          }

          .stock-info-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding: 9px 0;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
            color: #001f4d;
            font-weight: 800;
          }

          .stock-info-row span {
            color: #667085;
            font-weight: 700;
          }

          .stock-adjust {
            display: grid;
            grid-template-columns: 42px 1fr 42px;
            gap: 8px;
            margin-bottom: 10px;
          }

          .stock-adjust button {
            border-radius: 14px;
            border: none;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            font-weight: 950;
            font-size: 18px;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .stock-adjust button:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .stock-adjust input {
            width: 100%;
            padding: 11px;
            border-radius: 14px;
            border: 1px solid rgba(0,74,173,0.14);
            text-align: center;
            font-weight: 900;
            color: #001f4d;
          }

          .restock-btn {
            width: 100%;
            padding: 12px;
            border-radius: 14px;
            border: none;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            font-weight: 950;
            cursor: pointer;
            box-shadow: 0 12px 25px rgba(212,175,55,0.22);
            transition: 0.3s ease;
          }

          .restock-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
          }

          .empty-stock {
            grid-column: 1 / -1;
            padding: 35px;
            text-align: center;
            border-radius: 24px;
            background: #fff;
            color: #667085;
            font-weight: 700;
            box-shadow: 0 16px 40px rgba(0,31,77,0.09);
          }

          @media (max-width: 800px) {
            .stock-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .stock-tools {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .stock-page {
              padding: 14px;
            }

            .stock-hero {
              padding: 22px 16px;
              border-radius: 22px;
            }

            .stock-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .stock-stat-card {
              padding: 14px;
              border-radius: 18px;
            }

            .stock-stat-card h2 {
              font-size: 21px;
            }

            .stock-grid {
              grid-template-columns: 1fr;
            }

            .stock-image {
              height: 115px;
            }
          }
        `}</style>

        <div className="stock-container">
          <div className="stock-hero">
            <div>
              <h1>
                Stock <span>Control</span>
              </h1>
              <p>
                Monitor product quantities, detect low stock, restock items,
                prevent unavailable products from being sold and keep Chafadia
                Enterprise inventory organized.
              </p>
            </div>

            <div className="stock-badge">
              {totalStock} Items in Stock
            </div>
          </div>

          <div className="stock-stats">
            <div className="stock-stat-card">
              <h3>Total Products</h3>
              <h2>{totalProducts}</h2>
            </div>

            <div className="stock-stat-card">
              <h3>Total Stock</h3>
              <h2>{totalStock}</h2>
            </div>

            <div className="stock-stat-card">
              <h3>Low Stock</h3>
              <h2>{lowStock}</h2>
            </div>

            <div className="stock-stat-card">
              <h3>Out of Stock</h3>
              <h2>{outOfStock}</h2>
            </div>

            <div className="stock-stat-card">
              <h3>Stock Value</h3>
              <h2>{stockValue.toLocaleString()} FCFA</h2>
            </div>
          </div>

          <div className="stock-tools">
            <input
              type="search"
              placeholder="Search by product name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Products</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="stock-grid">
            {filteredProducts.length === 0 ? (
              <div className="empty-stock">
                No products found.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div className="stock-card" key={product.id}>
                  <div className="stock-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      product.name.charAt(0)
                    )}
                  </div>

                  <div className="stock-body">
                    <h3>{product.name}</h3>

                    <p className="stock-category">
                      {product.category || "General Product"}
                    </p>

                    <span
                      className={`stock-status ${getStatusClass(
                        product.stock
                      )}`}
                    >
                      {getStockStatus(product.stock)}
                    </span>

                    <div className="stock-info">
                      <div className="stock-info-row">
                        <span>Quantity</span>
                        <strong>{product.stock || 0}</strong>
                      </div>

                      <div className="stock-info-row">
                        <span>Unit Price</span>
                        <strong>
                          {Number(product.price || 0).toLocaleString()} FCFA
                        </strong>
                      </div>

                      <div className="stock-info-row">
                        <span>Total Value</span>
                        <strong>
                          {(
                            Number(product.price || 0) *
                            Number(product.stock || 0)
                          ).toLocaleString()}{" "}
                          FCFA
                        </strong>
                      </div>
                    </div>

                    <div className="stock-adjust">
                      <button
                        type="button"
                        onClick={() => updateStock(product.id, -1)}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={product.stock || 0}
                        onChange={(e) =>
                          setExactStock(product.id, e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() => updateStock(product.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="restock-btn"
                      onClick={() => updateStock(product.id, 10)}
                    >
                      Restock +10
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StockControl;