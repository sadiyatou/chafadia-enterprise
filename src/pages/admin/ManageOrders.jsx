import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";

function ManageOrders() {
  const { orders } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [localOrders, setLocalOrders] = useState(
    orders.length
      ? orders
      : [
          {
            id: 1001,
            customerName: "Aisha Bello",
            customerEmail: "aisha@gmail.com",
            phone: "+237 650 000 000",
            items: [
              { name: "Orange Juice", qty: 2, price: 1500 },
              { name: "Banana Chips", qty: 1, price: 1000 },
            ],
            total: 4000,
            paymentMethod: "MTN Mobile Money",
            paymentStatus: "Paid",
            status: "Pending",
            date: "2026-06-16",
            address: "Nkolmesseng, Yaoundé",
          },
          {
            id: 1002,
            customerName: "Fatima Sadiq",
            customerEmail: "fatima@gmail.com",
            phone: "+237 690 000 000",
            items: [
              { name: "Pineapple Juice", qty: 3, price: 1500 },
              { name: "Body Lotion", qty: 1, price: 3500 },
            ],
            total: 8000,
            paymentMethod: "Orange Money",
            paymentStatus: "Pending",
            status: "Processing",
            date: "2026-06-16",
            address: "Bastos, Yaoundé",
          },
        ]
  );

  const statuses = [
    "Pending",
    "Processing",
    "Ready",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    return localOrders.filter((order) => {
      const searchText = `${order.id} ${order.customerName} ${order.customerEmail} ${order.phone}`
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localOrders, search, statusFilter]);

  const totalRevenue = localOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pendingOrders = localOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = localOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const updateStatus = (id, status) => {
    setLocalOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const updatePaymentStatus = (id, paymentStatus) => {
    setLocalOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, paymentStatus } : order
      )
    );
  };

  const deleteOrder = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    setLocalOrders((prev) =>
      prev.filter((order) => order.id !== id)
    );
  };

  return (
    <>
      <Navbar />

      <div className="manage-orders-page">
        <style>{`
          .manage-orders-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 28%),
              radial-gradient(circle at bottom right, rgba(0, 74, 173, 0.13), transparent 30%),
              #f6f8ff;
          }

          .orders-container {
            max-width: 1250px;
            margin: 0 auto;
          }

          .orders-hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 30px;
            border-radius: 30px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,248,255,0.92));
            border: 1px solid rgba(212, 175, 55, 0.28);
            box-shadow: 0 24px 55px rgba(0, 31, 77, 0.13);
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
          }

          .orders-hero::after {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            right: -70px;
            top: -80px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.25), transparent 70%);
          }

          .orders-hero h1 {
            color: #001f4d;
            font-size: clamp(30px, 5vw, 48px);
            font-weight: 950;
            margin-bottom: 8px;
          }

          .orders-hero h1 span {
            color: #d4af37;
          }

          .orders-hero p {
            color: #667085;
            max-width: 720px;
            line-height: 1.7;
            font-weight: 600;
          }

          .orders-badge {
            padding: 12px 18px;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            font-weight: 900;
            white-space: nowrap;
            box-shadow: 0 14px 30px rgba(212,175,55,0.22);
            position: relative;
            z-index: 2;
          }

          .orders-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 220px));
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .order-stat-card {
            background: rgba(255,255,255,0.96);
            border: 1px solid rgba(212,175,55,0.18);
            border-radius: 22px;
            padding: 18px;
            box-shadow: 0 14px 35px rgba(0,31,77,0.09);
            transition: 0.3s ease;
          }

          .order-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 45px rgba(0,31,77,0.14);
          }

          .order-stat-card h3 {
            color: #667085;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .order-stat-card h2 {
            color: #d4af37;
            font-size: 28px;
            font-weight: 950;
          }

          .orders-tools {
            display: grid;
            grid-template-columns: 1.5fr 0.7fr;
            gap: 14px;
            margin-bottom: 22px;
          }

          .orders-tools input,
          .orders-tools select {
            width: 100%;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            font-weight: 700;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
          }

          .orders-list {
            display: grid;
            gap: 18px;
          }

          .order-card {
            background: rgba(255,255,255,0.97);
            border-radius: 26px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            overflow: hidden;
          }

          .order-card-top {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 20px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.07), rgba(212,175,55,0.08));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .order-card-top h3 {
            color: #001f4d;
            font-size: 20px;
            margin-bottom: 6px;
          }

          .order-card-top p {
            color: #667085;
            font-size: 14px;
            line-height: 1.6;
          }

          .status-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 13px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
            white-space: nowrap;
          }

          .status-pending {
            background: #fff7d6;
            color: #92400e;
          }

          .status-processing {
            background: #dbeafe;
            color: #1e3a8a;
          }

          .status-ready {
            background: #dcfce7;
            color: #166534;
          }

          .status-delivered {
            background: #d1fae5;
            color: #065f46;
          }

          .status-cancelled {
            background: #fee2e2;
            color: #991b1b;
          }

          .order-card-body {
            padding: 20px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 18px;
          }

          .order-items {
            display: grid;
            gap: 10px;
          }

          .order-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 16px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.07);
          }

          .order-item strong {
            color: #001f4d;
          }

          .order-item span {
            color: #667085;
            font-weight: 700;
          }

          .order-summary {
            background:
              linear-gradient(135deg, rgba(255,247,214,0.8), rgba(255,255,255,0.9));
            border: 1px solid rgba(212,175,55,0.22);
            border-radius: 20px;
            padding: 16px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 0;
            color: #001f4d;
            font-weight: 800;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
          }

          .summary-row:last-child {
            border-bottom: none;
          }

          .summary-row.total {
            color: #b8860b;
            font-size: 18px;
            font-weight: 950;
          }

          .order-actions {
            padding: 18px 20px 20px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            border-top: 1px solid rgba(0,74,173,0.08);
          }

          .order-actions select,
          .order-actions button {
            padding: 12px;
            border-radius: 14px;
            border: 1px solid rgba(0,74,173,0.12);
            font-weight: 850;
            background: #fff;
            color: #001f4d;
          }

          .order-actions button {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            transition: 0.3s ease;
          }

          .order-actions button:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .delete-order-btn {
            background: #dc2626 !important;
            color: #fff !important;
          }

          .empty-orders {
            padding: 35px;
            text-align: center;
            border-radius: 24px;
            background: #fff;
            color: #667085;
            font-weight: 700;
            box-shadow: 0 16px 40px rgba(0,31,77,0.09);
          }

          @media (max-width: 900px) {
            .orders-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .orders-tools {
              grid-template-columns: 1fr;
            }

            .order-card-body {
              grid-template-columns: 1fr;
            }

            .order-actions {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 600px) {
            .manage-orders-page {
              padding: 14px;
            }

            .orders-hero {
              padding: 22px 16px;
              border-radius: 22px;
            }

            .orders-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .order-stat-card {
              padding: 14px;
              border-radius: 18px;
            }

            .order-stat-card h2 {
              font-size: 22px;
            }

            .order-card-top {
              flex-direction: column;
              padding: 16px;
            }

            .order-card-body {
              padding: 16px;
            }

            .order-actions {
              grid-template-columns: 1fr;
              padding: 16px;
            }
          }
        `}</style>

        <div className="orders-container">
          <div className="orders-hero">
            <div>
              <h1>
                Manage <span>Orders</span>
              </h1>
              <p>
                View customer orders, confirm payments, update delivery stages,
                prepare products, track revenue and keep Chafadia Enterprise
                operations organized.
              </p>
            </div>

            <div className="orders-badge">
              {localOrders.length} Orders
            </div>
          </div>

          <div className="orders-stats">
            <div className="order-stat-card">
              <h3>Total Orders</h3>
              <h2>{localOrders.length}</h2>
            </div>

            <div className="order-stat-card">
              <h3>Pending</h3>
              <h2>{pendingOrders}</h2>
            </div>

            <div className="order-stat-card">
              <h3>Delivered</h3>
              <h2>{deliveredOrders}</h2>
            </div>

            <div className="order-stat-card">
              <h3>Revenue</h3>
              <h2>{totalRevenue.toLocaleString()} FCFA</h2>
            </div>
          </div>

          <div className="orders-tools">
            <input
              type="search"
              placeholder="Search by order ID, customer name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-orders">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-card-top">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p>
                        <strong>{order.customerName}</strong> •{" "}
                        {order.customerEmail}
                      </p>
                      <p>
                        {order.phone} • {order.address}
                      </p>
                      <p>Date: {order.date}</p>
                    </div>

                    <span
                      className={`status-pill status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div className="order-item" key={index}>
                          <strong>{item.name}</strong>
                          <span>
                            Qty: {item.qty} •{" "}
                            {(item.qty * item.price).toLocaleString()} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Payment</span>
                        <strong>{order.paymentMethod}</strong>
                      </div>

                      <div className="summary-row">
                        <span>Payment Status</span>
                        <strong>{order.paymentStatus}</strong>
                      </div>

                      <div className="summary-row">
                        <span>Items</span>
                        <strong>{order.items.length}</strong>
                      </div>

                      <div className="summary-row total">
                        <span>Total</span>
                        <strong>
                          {Number(order.total).toLocaleString()} FCFA
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          Mark as {status}
                        </option>
                      ))}
                    </select>

                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updatePaymentStatus(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Payment Pending</option>
                      <option value="Paid">Payment Paid</option>
                      <option value="Failed">Payment Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        window.print()
                      }
                    >
                      Print Order
                    </button>

                    <button
                      type="button"
                      className="delete-order-btn"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
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

export default ManageOrders;