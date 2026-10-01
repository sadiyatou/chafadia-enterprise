import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";
import ManageProducts from "../admin/ManageProducts";
import ManageOrders from "../admin/ManageOrders";
import Transactions from "../admin/Transactions";
import Receipts from "../admin/Receipts";
import SalesReports from "../admin/SalesReports";
import StockControl from "../admin/StockControl";
import CustomerMessages from "../admin/CustomerMessages";
import CustomerReviews from "../admin/CustomerReviews";
import Announcements from "../admin/Announcements";

function CashierDashboard() {
  const { orders = [], products = [], transactions = [] } = useStore();

  const [activePage, setActivePage] = useState("dashboard");

  const today = new Date().toISOString().slice(0, 10);

  const formatMoney = (amount) =>
    `${Number(amount || 0).toLocaleString()} FCFA`;

  const getAmountPaid = (order) => {
    if (order.paymentStatus === "Paid") {
      return Number(order.amountPaid || order.paidAmount || order.total || 0);
    }

    return Number(order.amountPaid || order.paidAmount || 0);
  };

  const getBalance = (order) =>
    Math.max(0, Number(order.total || 0) - getAmountPaid(order));

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const pendingOrders = orders.filter((order) => order.paymentStatus !== "Paid");
  const todayOrders = orders.filter((order) => order.date === today);

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + getAmountPaid(order),
    0
  );

  const todayRevenue = todayOrders.reduce(
    (sum, order) =>
      order.paymentStatus === "Paid" ? sum + getAmountPaid(order) : sum,
    0
  );

  const totalBalance = orders.reduce((sum, order) => sum + getBalance(order), 0);

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const lowStock = products.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
  );

  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) <= 0
  );

  const paymentProgress =
    orders.length === 0 ? 0 : Math.round((paidOrders.length / orders.length) * 100);

  const recentOrders = [...orders].slice(0, 5);

  const recentTransactions = transactions?.length
    ? transactions.slice(0, 5)
    : orders
        .flatMap((order) =>
          (order.paymentHistory || []).map((payment) => ({
            ...payment,
            orderId: order.id,
            receiptNo: order.receiptNo,
            customerName: order.customerName || order.customer?.name || "Customer",
          }))
        )
        .slice(0, 5);

  const activeComponents = {
    products: ManageProducts,
    orders: ManageOrders,
    transactions: Transactions,
    receipts: Receipts,
    sales: SalesReports,
    stock: StockControl,
    messages: CustomerMessages,
    reviews: CustomerReviews,
    announcements: Announcements,
  };

  const ActiveComponent = activeComponents[activePage];

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      detail: "All customer orders",
      icon: "📦",
    },
    {
      title: "Paid Orders",
      value: paidOrders.length,
      detail: formatMoney(totalRevenue),
      icon: "✅",
    },
    {
      title: "Pending Payments",
      value: pendingOrders.length,
      detail: formatMoney(totalBalance),
      icon: "⏳",
    },
    {
      title: "Today Revenue",
      value: formatMoney(todayRevenue),
      detail: `${todayOrders.length} order(s) today`,
      icon: "💰",
    },
    {
      title: "Total Stock",
      value: totalStock,
      detail: `${products.length} product(s)`,
      icon: "🏬",
    },
    {
      title: "Low / Out Stock",
      value: `${lowStock.length}/${outOfStock.length}`,
      detail: "Low stock / Out of stock",
      icon: "⚠️",
    },
  ];

  const operationGroups = [
    {
      title: "Sales & Payments",
      subtitle: "Collect payments and issue receipts professionally.",
      actions: [
        {
          id: "transactions",
          title: "Confirm Payments",
          text: "Verify payments fast.",
          icon: "💳",
          tag: "Payments",
          highlight: true,
        },
        {
          id: "receipts",
          title: "Receipts",
          text: "Print receipts and balances.",
          icon: "🧾",
          tag: "Receipts",
        },
        {
          id: "sales",
          title: "Sales Reports",
          text: "Record sales and profit.",
          icon: "📊",
          tag: "Reports",
        },
      ],
    },
    {
      title: "Products & Stock",
      subtitle: "Control prices, goods and stock.",
      actions: [
        {
          id: "products",
          title: "Manage Products",
          text: "Edit prices and stock.",
          icon: "🛍️",
          tag: "Products",
          highlight: true,
        },
        {
          id: "stock",
          title: "Stock Control",
          text: "Monitor stock levels.",
          icon: "🏬",
          tag: "Stock",
        },
        {
          id: "orders",
          title: "Manage Orders",
          text: "Track customer orders.",
          icon: "📦",
          tag: "Orders",
        },
      ],
    },
    {
      title: "Customers & Communication",
      subtitle: "Manage customer communication.",
      actions: [
        {
          id: "messages",
          title: "Customer Messages",
          text: "Read and reply messages.",
          icon: "💬",
          tag: "Support",
        },
        {
          id: "reviews",
          title: "Customer Reviews",
          text: "Approve customer reviews.",
          icon: "⭐",
          tag: "Reviews",
        },
        {
          id: "announcements",
          title: "Announcements",
          text: "Publish business updates.",
          icon: "📢",
          tag: "Updates",
        },
      ],
    },
  ];

  const quickTabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Payments" },
    { id: "receipts", label: "Receipts" },
    { id: "sales", label: "Sales" },
    { id: "products", label: "Products" },
    { id: "stock", label: "Stock" },
    { id: "orders", label: "Orders" },
    { id: "messages", label: "Messages" },
    { id: "reviews", label: "Reviews" },
    { id: "announcements", label: "Announcements" },
  ];

  const pageLabels = {
    products: "Manage Products",
    orders: "Manage Orders",
    transactions: "Confirm Payments / Transactions",
    receipts: "Receipts",
    sales: "Sales Reports",
    stock: "Stock Control",
    messages: "Customer Messages",
    reviews: "Customer Reviews",
    announcements: "Announcements",
  };

  if (activePage !== "dashboard" && ActiveComponent) {
    return (
      <div className="cashier-embedded-shell">
        <style>{`
          .cashier-embedded-shell {
            min-height: 100vh;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.22), transparent 27%),
              radial-gradient(circle at 90% 12%, rgba(0, 74, 173, 0.14), transparent 29%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 50%, #f6f8ff 100%);
          }

          .cashier-return-bar {
            position: sticky;
            top: 0;
            z-index: 9999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            padding: 14px 22px;
            background: rgba(255,255,255,.94);
            backdrop-filter: blur(14px);
            border-bottom: 1px solid rgba(212,175,55,.28);
            box-shadow: 0 12px 32px rgba(0,31,77,.08);
          }

          .cashier-return-bar h2 {
            color: #001f4d;
            font-size: 18px;
            font-weight: 950;
            margin: 0;
          }

          .cashier-back-btn {
            border: none;
            border-radius: 999px;
            padding: 12px 18px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            font-weight: 950;
            cursor: pointer;
            box-shadow: 0 12px 25px rgba(0,31,77,.16);
          }

          .cashier-back-btn:hover {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          @media (max-width: 650px) {
            .cashier-return-bar {
              align-items: flex-start;
              flex-direction: column;
            }

            .cashier-back-btn {
              width: 100%;
            }
          }
        `}</style>

        <div className="cashier-return-bar">
          <h2>{pageLabels[activePage]}</h2>
          <button
            type="button"
            className="cashier-back-btn"
            onClick={() => setActivePage("dashboard")}
          >
            ← Back to Cashier Dashboard
          </button>
        </div>

        <ActiveComponent />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="cashier-page">
        <style>{`
          .cashier-page {
            min-height: 100vh;
            padding: 26px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.22), transparent 27%),
              radial-gradient(circle at 90% 12%, rgba(0, 74, 173, 0.14), transparent 29%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .cashier-container {
            max-width: 1360px;
            margin: 0 auto;
          }

          .cashier-hero {
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 250px;
            gap: 26px;
            align-items: center;
            padding: 34px;
            border-radius: 36px;
            margin-bottom: 18px;
            background:
              radial-gradient(circle at 14% 18%, rgba(212,175,55,.18), transparent 28%),
              radial-gradient(circle at 88% 12%, rgba(255,255,255,.16), transparent 25%),
              linear-gradient(135deg, #001f4d 0%, #004aad 50%, #001f4d 100%);
            border: 1px solid rgba(212, 175, 55, 0.55);
            box-shadow: 0 30px 80px rgba(0, 31, 77, 0.23), inset 0 1px 0 rgba(255,255,255,.18);
          }

          .cashier-hero::before {
            content: "";
            position: absolute;
            inset: 16px;
            border-radius: 28px;
            border: 1px solid rgba(255,255,255,.16);
            pointer-events: none;
          }

          .cashier-hero-content,
          .cashier-summary-card {
            position: relative;
            z-index: 2;
          }

          .cashier-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 16px;
            border-radius: 999px;
            margin-bottom: 14px;
            background: rgba(212, 175, 55, 0.16);
            color: #fff7d6;
            border: 1px solid rgba(212, 175, 55, 0.45);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .cashier-hero h1 {
            margin: 0 0 12px;
            color: #ffffff;
            font-size: clamp(34px, 5.6vw, 62px);
            line-height: 1.03;
            font-weight: 1000;
            letter-spacing: -1.6px;
          }

          .cashier-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #fff7d6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .cashier-hero p {
            max-width: 790px;
            color: rgba(255,255,255,.9);
            line-height: 1.75;
            font-size: 15px;
            font-weight: 680;
            margin: 0;
          }

          .hero-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 11px;
            margin-top: 22px;
          }

          .hero-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 46px;
            padding: 0 20px;
            border-radius: 999px;
            border: none;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .hero-btn.gold {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            box-shadow: 0 14px 32px rgba(212,175,55,.22);
          }

          .hero-btn.white {
            background: rgba(255,255,255,.95);
            color: #001f4d;
            box-shadow: 0 14px 32px rgba(0,0,0,.14);
          }

          .hero-btn.outline {
            background: rgba(255,255,255,.08);
            color: #ffffff;
            border: 1px solid rgba(255,255,255,.24);
          }

          .hero-btn:hover,
          .action-card:hover,
          .cashier-stat:hover,
          .mini-panel:hover,
          .quick-tab:hover {
            transform: translateY(-4px);
          }

          .cashier-summary-card {
            border-radius: 30px;
            padding: 20px;
            background: rgba(255,255,255,.12);
            border: 1px solid rgba(255,255,255,.22);
            backdrop-filter: blur(14px);
            color: white;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
          }

          .summary-circle {
            width: 138px;
            height: 138px;
            margin: 0 auto 14px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background:
              conic-gradient(#d4af37 ${paymentProgress}%, rgba(255,255,255,.16) 0);
            position: relative;
          }

          .summary-circle::before {
            content: "";
            position: absolute;
            inset: 12px;
            border-radius: 50%;
            background: linear-gradient(135deg, #004aad, #001f4d);
          }

          .summary-circle strong {
            position: relative;
            z-index: 2;
            color: #fff7d6;
            font-size: 32px;
            font-weight: 1000;
          }

          .cashier-summary-card h3 {
            text-align: center;
            color: #fff;
            font-size: 16px;
            margin-bottom: 6px;
          }

          .cashier-summary-card p {
            text-align: center;
            font-size: 12.3px;
            line-height: 1.55;
            color: rgba(255,255,255,.8);
            margin: 0;
          }

          .quick-tabs {
            display: flex;
            gap: 9px;
            flex-wrap: wrap;
            padding: 13px;
            margin-bottom: 22px;
            border-radius: 25px;
            background: rgba(255,255,255,.92);
            border: 1px solid rgba(212,175,55,.22);
            box-shadow: 0 14px 38px rgba(0,31,77,.08);
          }

          .quick-tab {
            border-radius: 999px;
            padding: 10px 14px;
            background: #f8fbff;
            color: #001f4d;
            font-weight: 950;
            cursor: pointer;
            transition: .3s ease;
            border: 1px solid rgba(0,74,173,.08);
          }

          .quick-tab.active {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            box-shadow: 0 12px 28px rgba(0,31,77,.18);
          }

          .cashier-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
            gap: 15px;
            margin-bottom: 26px;
          }

          .cashier-stat {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,.985);
            border-radius: 24px;
            padding: 17px;
            border: 1px solid rgba(212,175,55,.2);
            box-shadow: 0 14px 38px rgba(0,31,77,.085);
            transition: .3s ease;
          }

          .cashier-stat::after {
            content: "";
            position: absolute;
            right: -34px;
            top: -38px;
            width: 95px;
            height: 95px;
            border-radius: 50%;
            background: rgba(212,175,55,.16);
          }

          .stat-top {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            margin-bottom: 10px;
          }

          .stat-icon {
            width: 41px;
            height: 41px;
            border-radius: 15px;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #d4af37;
            font-size: 20px;
          }

          .cashier-stat h3 {
            position: relative;
            z-index: 2;
            color: #667085;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .9px;
            margin: 0;
            font-weight: 950;
          }

          .cashier-stat h2 {
            position: relative;
            z-index: 2;
            color: #001f4d;
            font-size: 24px;
            line-height: 1.1;
            font-weight: 1000;
            margin: 0 0 5px;
          }

          .cashier-stat p {
            position: relative;
            z-index: 2;
            color: #667085;
            font-size: 12px;
            line-height: 1.45;
            font-weight: 750;
            margin: 0;
          }


          .section-head {
            position: relative;
            overflow: hidden;
            width: min(820px, 100%);
            margin: 36px auto 26px;
            padding: 25px 24px;
            text-align: center;
            border-radius: 34px;
            background:
              radial-gradient(circle at 18% 20%, rgba(212,175,55,.24), transparent 30%),
              radial-gradient(circle at 84% 18%, rgba(0,74,173,.14), transparent 34%),
              linear-gradient(135deg, rgba(255,255,255,.99), rgba(248,251,255,.96));
            border: 1px solid rgba(212,175,55,.30);
            box-shadow: 0 22px 56px rgba(0,31,77,.10);
          }

          .section-head::before,
          .section-head::after {
            content: "";
            position: absolute;
            width: 140px;
            height: 140px;
            border-radius: 50%;
            border: 1px solid rgba(212,175,55,.18);
            pointer-events: none;
          }

          .section-head::before {
            left: -72px;
            top: -72px;
            background: rgba(212,175,55,.08);
          }

          .section-head::after {
            right: -72px;
            bottom: -72px;
            background: rgba(0,74,173,.05);
          }

          .section-head h2 {
            position: relative;
            z-index: 2;
            color: #001f4d;
            font-size: clamp(26px, 3.7vw, 40px);
            font-weight: 1000;
            letter-spacing: -.8px;
            margin: 0;
          }

          .section-head p {
            position: relative;
            z-index: 2;
            color: #667085;
            max-width: 680px;
            line-height: 1.65;
            font-weight: 700;
            font-size: 13px;
            margin: 8px auto 0;
          }

          .operation-group {
            position: relative;
            margin-bottom: 30px;
            padding: 24px;
            border-radius: 36px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,.10), transparent 30%),
              linear-gradient(135deg, rgba(255,255,255,.96), rgba(248,251,255,.90));
            border: 1px solid rgba(212,175,55,.20);
            box-shadow: 0 20px 52px rgba(0,31,77,.07);
          }

          .operation-group::before {
            content: "";
            position: absolute;
            inset: 12px;
            border-radius: 28px;
            border: 1px solid rgba(255,255,255,.82);
            pointer-events: none;
          }

          .group-title {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 18px;
            margin-bottom: 20px;
          }

          .group-title h3 {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #001f4d;
            font-size: 21px;
            margin: 0;
            font-weight: 1000;
            letter-spacing: -.35px;
          }

          .group-title h3::before {
            content: "";
            width: 11px;
            height: 34px;
            flex: 0 0 auto;
            border-radius: 999px;
            background: linear-gradient(180deg, #d4af37, #004aad);
            box-shadow: 0 10px 22px rgba(212,175,55,.22);
          }

          .group-title p {
            color: #667085;
            font-size: 12px;
            font-weight: 760;
            max-width: 520px;
            line-height: 1.5;
            margin: 0;
            text-align: right;
          }

          .actions-grid {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .action-card {
            position: relative;
            overflow: hidden;
            display: grid;
            grid-template-columns: 54px minmax(0, 1fr) 30px;
            align-items: center;
            gap: 13px;
            min-height: 118px;
            padding: 16px;
            border-radius: 26px;
            text-align: left;
            cursor: pointer;
            border: 1px solid rgba(212,175,55,.26);
            background:
              radial-gradient(circle at 94% 0%, rgba(212,175,55,.16), transparent 34%),
              linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
            box-shadow: 0 17px 42px rgba(0,31,77,.09);
            transition: .32s ease;
          }

          .action-card::before {
            content: "";
            position: absolute;
            inset: 0;
            opacity: 0;
            background: linear-gradient(135deg, rgba(0,74,173,.08), transparent 58%);
            transition: .32s ease;
          }

          .action-card::after {
            content: "";
            position: absolute;
            width: 120px;
            height: 120px;
            right: -76px;
            bottom: -76px;
            border-radius: 50%;
            background: rgba(212,175,55,.11);
          }

          .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 28px 64px rgba(0,31,77,.15);
            border-color: rgba(212,175,55,.48);
          }

          .action-card:hover::before {
            opacity: 1;
          }

          .action-card.highlight {
            border-color: rgba(212,175,55,.55);
            background:
              radial-gradient(circle at 94% 0%, rgba(212,175,55,.22), transparent 36%),
              linear-gradient(135deg, #ffffff 0%, #fffdf7 100%);
          }

          .action-icon {
            position: relative;
            z-index: 2;
            width: 52px;
            height: 52px;
            display: grid;
            place-items: center;
            border-radius: 19px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #d4af37;
            font-size: 22px;
            box-shadow: 0 14px 30px rgba(0,31,77,.17);
          }

          .action-content {
            position: relative;
            z-index: 2;
            min-width: 0;
          }

          .action-tag {
            display: inline-flex;
            width: fit-content;
            padding: 5px 8px;
            border-radius: 999px;
            color: #92400e;
            background: #fff7d6;
            border: 1px solid rgba(212,175,55,.36);
            font-size: 8.5px;
            font-weight: 1000;
            text-transform: uppercase;
            letter-spacing: .5px;
            margin-bottom: 6px;
          }

          .action-card h3 {
            color: #001f4d;
            font-size: 15.5px;
            line-height: 1.15;
            font-weight: 1000;
            margin: 0 0 5px;
            letter-spacing: -.1px;
          }

          .action-card p {
            color: #667085;
            line-height: 1.38;
            font-size: 10.8px;
            font-weight: 760;
            margin: 0;
            max-width: 165px;
          }

          .action-footer {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            align-self: stretch;
            margin: 0;
          }

          .open-pill {
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            padding: 0;
            border-radius: 50%;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            font-size: 0;
            font-weight: 950;
            box-shadow: 0 10px 22px rgba(0,31,77,.16);
            flex: 0 0 auto;
          }

          .open-pill::before {
            content: "→";
            font-size: 13px;
            line-height: 1;
          }

          .dashboard-bottom {
            display: grid;
            grid-template-columns: 1.1fr .9fr;
            gap: 18px;
            align-items: start;
            margin-top: 28px;
          }

          .mini-panel {
            background: rgba(255,255,255,.99);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,.2);
            box-shadow: 0 18px 48px rgba(0,31,77,.095);
            overflow: hidden;
            transition: .3s ease;
          }

          .mini-panel-head {
            padding: 18px 20px;
            background: linear-gradient(135deg, rgba(0,74,173,.08), rgba(212,175,55,.12));
            border-bottom: 1px solid rgba(0,74,173,.08);
          }

          .mini-panel-head h3 {
            color: #001f4d;
            font-size: 19px;
            margin: 0 0 5px;
            font-weight: 950;
          }

          .mini-panel-head p {
            color: #667085;
            font-size: 12.5px;
            margin: 0;
            font-weight: 700;
            line-height: 1.5;
          }

          .records-list {
            display: grid;
            gap: 0;
          }

          .record-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 13px;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(0,31,77,.07);
          }

          .record-row:last-child {
            border-bottom: none;
          }

          .record-row h4 {
            color: #001f4d;
            font-size: 14px;
            line-height: 1.3;
            margin: 0 0 4px;
            font-weight: 950;
          }

          .record-row p {
            color: #667085;
            font-size: 12px;
            line-height: 1.45;
            margin: 0;
            font-weight: 700;
          }

          .record-amount {
            color: #b8860b;
            font-size: 13px;
            font-weight: 950;
            white-space: nowrap;
          }

          .status-pill {
            display: inline-flex;
            width: fit-content;
            margin-top: 7px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 10.5px;
            font-weight: 950;
          }

          .paid {
            background: #dcfce7;
            color: #166534;
          }

          .pending {
            background: #fff7d6;
            color: #92400e;
          }

          .empty-state {
            padding: 25px 20px;
            text-align: center;
            color: #667085;
            font-weight: 750;
          }

          @media (max-width: 1180px) {
            .actions-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 950px) {
            .cashier-hero,
            .dashboard-bottom {
              grid-template-columns: 1fr;
            }

            .cashier-summary-card {
              max-width: 320px;
            }

            .group-title {
              grid-template-columns: 1fr;
              align-items: flex-start;
            }

            .group-title p {
              text-align: left;
            }
          }

          @media (max-width: 720px) {
            .cashier-page {
              padding: 14px;
            }

            .cashier-hero {
              padding: 24px 18px;
              border-radius: 28px;
            }

            .hero-buttons {
              flex-direction: column;
            }

            .hero-btn {
              width: 100%;
            }

            .cashier-stats,
            .actions-grid {
              grid-template-columns: 1fr;
            }

            .operation-group {
              padding: 16px;
              border-radius: 24px;
            }

            .action-card {
              min-height: 104px;
              padding: 14px;
              border-radius: 24px;
            }

            .action-icon {
              width: 50px;
              height: 50px;
              border-radius: 18px;
              font-size: 21px;
            }

            .action-card h3 {
              font-size: 16px;
            }

            .action-card p {
              font-size: 11px;
            }

            .open-pill {
              width: 32px;
              height: 32px;
            }

            .record-row {
              grid-template-columns: 1fr;
            }

            .quick-tabs {
              display: grid;
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>

        <div className="cashier-container">
          <section className="cashier-hero">
            <div className="cashier-hero-content">
              <span className="cashier-label">✦ Chafadia Enterprise Cashier Portal ✦</span>

              <h1>
                Cashier <span>Control Center</span>
              </h1>

              <p>
                A clean, organized and powerful cashier dashboard. Open payments,
                receipts, sales reports, products, stock, orders, messages,
                reviews and announcements directly inside this portal.
              </p>

              <div className="hero-buttons">
                <button
                  type="button"
                  className="hero-btn gold"
                  onClick={() => setActivePage("transactions")}
                >
                  Confirm Payments
                </button>

                <button
                  type="button"
                  className="hero-btn white"
                  onClick={() => setActivePage("receipts")}
                >
                  Print Receipts
                </button>

                <button
                  type="button"
                  className="hero-btn outline"
                  onClick={() => setActivePage("sales")}
                >
                  Record Sales
                </button>
              </div>
            </div>

            <div className="cashier-summary-card">
              <div className="summary-circle">
                <strong>{paymentProgress}%</strong>
              </div>

              <h3>Payment Completion</h3>

              <p>
                {paidOrders.length} paid order(s) out of {orders.length} total
                order(s).
              </p>
            </div>
          </section>

          <div className="quick-tabs">
            {quickTabs.map((tab) => (
              <button
                type="button"
                className={tab.id === "dashboard" ? "quick-tab active" : "quick-tab"}
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="cashier-stats">
            {stats.map((stat) => (
              <div className="cashier-stat" key={stat.title}>
                <div className="stat-top">
                  <h3>{stat.title}</h3>
                  <div className="stat-icon">{stat.icon}</div>
                </div>

                <h2>{stat.value}</h2>
                <p>{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="section-head">
            <h2>Cashier Access Center</h2>
            <p>
              Beautifully arranged tools for payments, receipts, stock, products,
              orders and customer communication.
            </p>
          </div>

          {operationGroups.map((group) => (
            <section className="operation-group" key={group.title}>
              <div className="group-title">
                <h3>{group.title}</h3>
                <p>{group.subtitle}</p>
              </div>

              <div className="actions-grid">
                {group.actions.map((action) => (
                  <button
                    type="button"
                    className={action.highlight ? "action-card highlight" : "action-card"}
                    key={action.id}
                    onClick={() => setActivePage(action.id)}
                  >
                    <div className="action-icon">{action.icon}</div>

                    <div className="action-content">
                      <span className="action-tag">{action.tag}</span>
                      <h3>{action.title}</h3>
                      <p>{action.text}</p>
                    </div>

                    <div className="action-footer">
                      <span className="open-pill">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          <div className="dashboard-bottom">
            <div className="mini-panel">
              <div className="mini-panel-head">
                <h3>Recent Orders</h3>
                <p>Latest customer orders and payment status.</p>
              </div>

              <div className="records-list">
                {recentOrders.length === 0 ? (
                  <div className="empty-state">No orders available yet.</div>
                ) : (
                  recentOrders.map((order) => (
                    <div className="record-row" key={order.id}>
                      <div>
                        <h4>
                          Order #{order.id} •{" "}
                          {order.customerName || order.customer?.name || "Customer"}
                        </h4>

                        <p>
                          {order.receiptNo || "No receipt yet"} •{" "}
                          {order.paymentMethod || "No method"} •{" "}
                          {order.date || "No date"}
                        </p>

                        <span
                          className={
                            order.paymentStatus === "Paid"
                              ? "status-pill paid"
                              : "status-pill pending"
                          }
                        >
                          {order.paymentStatus || "Pending"}
                        </span>
                      </div>

                      <strong className="record-amount">
                        {formatMoney(order.total)}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mini-panel">
              <div className="mini-panel-head">
                <h3>Recent Transactions</h3>
                <p>Latest recorded payment activities.</p>
              </div>

              <div className="records-list">
                {recentTransactions.length === 0 ? (
                  <div className="empty-state">No transactions recorded yet.</div>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <div className="record-row" key={transaction.id || index}>
                      <div>
                        <h4>
                          {transaction.method || "Payment"} •{" "}
                          {transaction.customerName ||
                            `Order #${transaction.orderId || "N/A"}`}
                        </h4>

                        <p>
                          Ref: {transaction.reference || "N/A"} •{" "}
                          {transaction.date || "No date"}{" "}
                          {transaction.time ? `• ${transaction.time}` : ""}
                        </p>

                        <span
                          className={
                            transaction.status === "Completed" ||
                            transaction.paymentStatus === "Paid"
                              ? "status-pill paid"
                              : "status-pill pending"
                          }
                        >
                          {transaction.status ||
                            transaction.paymentStatus ||
                            "Pending"}
                        </span>
                      </div>

                      <strong className="record-amount">
                        {formatMoney(transaction.amount)}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CashierDashboard;
