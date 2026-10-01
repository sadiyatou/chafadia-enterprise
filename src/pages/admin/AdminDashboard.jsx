import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";

function AdminDashboard() {
  const { users } = useAuth();
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5
  );

  return (
    <>
      <Navbar />

      <div className="page admin-page">
        <div className="container">
          <div className="admin-hero card">
            <div>
              <h1 className="logo-text">
                Admin <span className="gold">Dashboard</span>
              </h1>
              <p>
                CHAFADIA ENTERPRISE control center for products, users,
                orders, promotions, announcements and business management.
              </p>
            </div>

            <Link to="/admin/products" className="btn btn-gold">
              Add New Product
            </Link>
          </div>

          <div className="grid admin-stats">
            <div className="card stat-card">
              <h3>Total Users</h3>
              <h1>{users.length}</h1>
              <p>Registered accounts</p>
            </div>

            <div className="card stat-card">
              <h3>Total Products</h3>
              <h1>{products.length}</h1>
              <p>Available items</p>
            </div>

            <div className="card stat-card">
              <h3>Total Orders</h3>
              <h1>{orders.length}</h1>
              <p>Customer purchases</p>
            </div>

            <div className="card stat-card">
              <h3>Total Revenue</h3>
              <h1>{totalRevenue.toLocaleString()} FCFA</h1>
              <p>Business income</p>
            </div>
          </div>

          <h2 className="section-title">Business Management</h2>

          <div className="grid">
            <Link className="action-card" to="/admin/users">
              👥 Manage Users
            </Link>

            <Link className="action-card" to="/admin/products">
              🛍️ Manage Products
            </Link>

            <Link className="action-card" to="/admin/orders">
              📦 Manage Orders
            </Link>

            <Link className="action-card" to="/admin/stock">
              📊 Stock Control
            </Link>

            <Link className="action-card" to="/admin/promotions">
              🏷️ Promotions & Discounts
            </Link>

            <Link className="action-card" to="/admin/announcements">
              📢 Announcements
            </Link>

            <Link className="action-card" to="/admin/transactions">
              💳 Transactions
            </Link>

            <Link className="action-card" to="/admin/receipts">
              🧾 Receipts
            </Link>

            <Link className="action-card" to="/admin/customers">
              ⭐ Customer Reviews
            </Link>

            <Link className="action-card" to="/admin/messages">
              💬 Customer Messages
            </Link>

            <Link className="action-card" to="/admin/reports">
              📈 Sales Reports
            </Link>

            <Link className="action-card" to="/admin/settings">
              ⚙️ Website Settings
            </Link>
          </div>

          <h2 className="section-title">Quick Alerts</h2>

          <div className="grid">
            <div className="card">
              <h3>Low Stock Products</h3>
              <h1>{lowStockProducts.length}</h1>
              <p>Products that need restocking soon.</p>
            </div>

            <div className="card">
              <h3>Pending Orders</h3>
              <h1>
                {
                  orders.filter(
                    (order) => order.status === "Pending"
                  ).length
                }
              </h1>
              <p>Orders waiting for confirmation.</p>
            </div>

            <div className="card">
              <h3>Active Promotions</h3>
              <h1>0</h1>
              <p>Discounts and special offers currently running.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;