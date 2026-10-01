import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";

function Transactions() {
  const { orders, markAsPaid } = useStore();

  const bankDetails = {
    bankName: "FIRST BANK",
    branch: "Biyem-Assi Carrefour Branch",
    accountName: "SADIYATOU SEMIRNYUY KIKA",
    accountNumber: "00075-00000101158-93",
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";

    const visibleStart = accountNumber.slice(0, 5);
    const visibleEnd = accountNumber.slice(-3);

    return `${visibleStart}-****-****-${visibleEnd}`;
  };

  const sampleOrders = [
    {
      id: 1001,
      customer: {
        name: "Aisha Bello",
        email: "aisha@gmail.com",
        phone: "+237 650 000 000",
      },
      total: 12500,
      amountPaid: 0,
      paymentStatus: "Pending",
      paymentMethod: "MTN Mobile Money",
      receiptNo: "CHF-2026-1001",
      date: "2026-06-16",
      orderStatus: "Processing",
      bankReference: "",
      paymentNote: "",
    },
    {
      id: 1002,
      customer: {
        name: "Fatima Sadiq",
        email: "fatima@gmail.com",
        phone: "+237 690 000 000",
      },
      total: 8500,
      amountPaid: 8500,
      paymentStatus: "Paid",
      paymentMethod: "Orange Money",
      receiptNo: "CHF-2026-1002",
      date: "2026-06-15",
      orderStatus: "Delivered",
      bankReference: "",
      paymentNote: "",
    },
    {
      id: 1003,
      customer: {
        name: "Mariam N.",
        email: "mariam@gmail.com",
        phone: "+237 670 000 000",
      },
      total: 5000,
      amountPaid: 0,
      paymentStatus: "Pending",
      paymentMethod: "Bank Transfer",
      receiptNo: "CHF-2026-1003",
      date: "2026-06-14",
      orderStatus: "Pending",
      bankReference: "",
      paymentNote: "",
    },
  ];

  const baseOrders = orders?.length ? orders : sampleOrders;

  const [localOrders, setLocalOrders] = useState(
    baseOrders.map((order) => ({
      ...order,
      amountPaid:
        order.amountPaid ||
        order.paidAmount ||
        (order.paymentStatus === "Paid" ? order.total : 0),
      bankReference: order.bankReference || "",
      paymentNote: order.paymentNote || "",
    }))
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [bankForm, setBankForm] = useState({
    customerName: "",
    amount: "",
    reference: "",
    senderName: "",
    note: "",
  });

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} FCFA`;
  };

  const getAmountPaid = (order) => {
    return Number(
      order.amountPaid ||
        order.paidAmount ||
        (order.paymentStatus === "Paid" ? order.total : 0)
    );
  };

  const getBalance = (order) => {
    return Math.max(0, Number(order.total || 0) - getAmountPaid(order));
  };

  const filteredTransactions = useMemo(() => {
    return localOrders.filter((order) => {
      const text = `${order.id} ${order.customer?.name || ""} ${
        order.customer?.email || ""
      } ${order.customer?.phone || ""} ${order.paymentStatus || ""} ${
        order.paymentMethod || ""
      } ${order.receiptNo || ""} ${order.bankReference || ""}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        order.paymentStatus === filter ||
        order.paymentMethod === filter ||
        order.orderStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [localOrders, search, filter]);

  const totalTransactions = localOrders.length;

  const paidTransactions = localOrders.filter(
    (order) => order.paymentStatus === "Paid"
  ).length;

  const pendingTransactions = localOrders.filter(
    (order) => order.paymentStatus !== "Paid"
  ).length;

  const bankTransfers = localOrders.filter(
    (order) => order.paymentMethod === "Bank Transfer"
  ).length;

  const totalRevenue = localOrders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + getAmountPaid(order), 0);

  const pendingAmount = localOrders.reduce(
    (sum, order) => sum + getBalance(order),
    0
  );

  const confirmPayment = (id) => {
    const targetOrder = localOrders.find((order) => order.id === id);

    if (markAsPaid) {
      markAsPaid(id);
    }

    setLocalOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              amountPaid: Number(order.total || 0),
              paymentStatus: "Paid",
            }
          : order
      )
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder({
        ...targetOrder,
        amountPaid: Number(targetOrder?.total || 0),
        paymentStatus: "Paid",
      });
    }
  };

  const setPaymentStatus = (id, status) => {
    setLocalOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              paymentStatus: status,
              amountPaid:
                status === "Paid" ? Number(order.total || 0) : getAmountPaid(order),
            }
          : order
      )
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => ({
        ...prev,
        paymentStatus: status,
        amountPaid:
          status === "Paid" ? Number(prev.total || 0) : getAmountPaid(prev),
      }));
    }
  };

  const openBankPayment = (order) => {
    setSelectedOrder(order);

    setBankForm({
      customerName: order.customer?.name || "",
      amount: getBalance(order) || order.total || "",
      reference: order.bankReference || "",
      senderName: "",
      note: order.paymentNote || "",
    });
  };

  const saveBankPayment = (e) => {
    e.preventDefault();

    if (!selectedOrder) return;

    const amount = Number(bankForm.amount || 0);

    if (amount <= 0) {
      alert("Please enter a valid amount paid.");
      return;
    }

    if (selectedOrder.paymentMethod === "Bank Transfer" && !bankForm.reference.trim()) {
      alert("Please enter the bank transfer reference.");
      return;
    }

    const previousPaid = getAmountPaid(selectedOrder);
    const newPaidAmount = previousPaid + amount;
    const balance = Math.max(0, Number(selectedOrder.total || 0) - newPaidAmount);
    const newStatus = balance <= 0 ? "Paid" : "Pending";

    setLocalOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              amountPaid: newPaidAmount,
              paymentStatus: newStatus,
              bankReference: bankForm.reference,
              paymentNote: bankForm.note,
              senderName: bankForm.senderName,
            }
          : order
      )
    );

    setSelectedOrder((prev) => ({
      ...prev,
      amountPaid: newPaidAmount,
      paymentStatus: newStatus,
      bankReference: bankForm.reference,
      paymentNote: bankForm.note,
      senderName: bankForm.senderName,
    }));

    if (newStatus === "Paid" && markAsPaid) {
      markAsPaid(selectedOrder.id);
    }

    alert(
      balance <= 0
        ? "Payment recorded successfully. Receipt can now be issued."
        : `Payment recorded. Remaining balance is ${formatMoney(balance)}.`
    );

    setBankForm({
      customerName: "",
      amount: "",
      reference: "",
      senderName: "",
      note: "",
    });
  };

  const generateCustomerBankInstruction = (order) => {
    const balance = getBalance(order);

    return `
CHAFADIA ENTERPRISE BANK TRANSFER INSTRUCTION

Customer: ${order.customer?.name || "Customer"}
Amount to Pay: ${formatMoney(balance || order.total)}
Beneficiary Name: ${bankDetails.accountName}
Bank: ${bankDetails.bankName}
Branch: ${bankDetails.branch}
Account: ${maskAccountNumber(bankDetails.accountNumber)}

For your safety, the full account number is not displayed here.
Please confirm the beneficiary name before sending money.
After payment, submit your transfer reference or proof of payment.
`.trim();
  };

  const copyBankInstruction = (order) => {
    navigator.clipboard.writeText(generateCustomerBankInstruction(order));
    alert("Customer bank instruction copied.");
  };

  const deleteTransaction = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this transaction from the list?"
    );

    if (!confirmDelete) return;

    setLocalOrders((prev) => prev.filter((order) => order.id !== id));

    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }
  };

  const paymentStatusClass = (status) => {
    if (status === "Paid") return "payment-badge payment-paid";
    if (status === "Failed") return "payment-badge payment-failed";
    if (status === "Refunded") return "payment-badge payment-refunded";
    return "payment-badge payment-pending";
  };

  const methodClass = (method) => {
    if (method === "MTN Mobile Money") return "method-badge method-mtn";
    if (method === "Orange Money") return "method-badge method-orange";
    if (method === "Cash") return "method-badge method-cash";
    if (method === "Bank Transfer") return "method-badge method-bank";
    return "method-badge method-default";
  };

  const balanceClass = (order) => {
    return getBalance(order) > 0
      ? "balance-value balance-due"
      : "balance-value balance-clear";
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "C";
  };

  return (
    <>
      <Navbar />

      <div className="transactions-page">
        <style>{`
          .transactions-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.25), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .transactions-container {
            max-width: 1320px;
            margin: 0 auto;
          }

          .transactions-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 28px;
            padding: 36px;
            border-radius: 38px;
            margin-bottom: 24px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.9));
            border: 1px solid rgba(212, 175, 55, 0.38);
            box-shadow:
              0 30px 80px rgba(0, 31, 77, 0.15),
              inset 0 1px 0 rgba(255,255,255,0.96);
          }

          .transactions-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .transactions-hero::after {
            content: "";
            position: absolute;
            width: 165px;
            height: 165px;
            left: -72px;
            bottom: -78px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,74,173,0.2), transparent 70%);
          }

          .transactions-hero-content {
            position: relative;
            z-index: 2;
          }

          .transactions-label {
            display: inline-flex;
            padding: 8px 15px;
            border-radius: 999px;
            margin-bottom: 14px;
            background: rgba(212, 175, 55, 0.15);
            color: #001f4d;
            border: 1px solid rgba(212, 175, 55, 0.35);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.9px;
            text-transform: uppercase;
          }

          .transactions-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .transactions-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .transactions-hero p {
            color: #667085;
            max-width: 760px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .transactions-hero-badge {
            position: relative;
            z-index: 2;
            min-width: 170px;
            min-height: 152px;
            border-radius: 38px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 24px 55px rgba(0,31,77,0.24),
              inset 0 1px 0 rgba(255,255,255,0.22);
            border: 1px solid rgba(255,255,255,0.25);
            text-align: center;
            padding: 15px;
          }

          .transactions-hero-badge strong {
            font-size: 24px;
            color: #d4af37;
            line-height: 1.15;
          }

          .transactions-hero-badge span {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .secure-bank-panel {
            margin-bottom: 24px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 330px;
            gap: 18px;
            align-items: stretch;
          }

          .bank-card,
          .bank-form-card {
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.22);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            overflow: hidden;
          }

          .bank-card-head {
            padding: 20px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .bank-card-head h2 {
            color: #001f4d;
            font-size: 22px;
            margin-bottom: 6px;
          }

          .bank-card-head p {
            color: #667085;
            font-size: 13.5px;
            line-height: 1.6;
            font-weight: 650;
          }

          .bank-card-body {
            padding: 20px;
            display: grid;
            gap: 13px;
          }

          .bank-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .bank-info-box {
            padding: 14px;
            border-radius: 18px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .bank-info-box span {
            display: block;
            color: #667085;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            font-weight: 900;
            margin-bottom: 6px;
          }

          .bank-info-box strong {
            color: #001f4d;
            font-size: 13.5px;
            line-height: 1.4;
          }

          .security-note {
            padding: 15px;
            border-radius: 18px;
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #001f4d;
            font-size: 13px;
            font-weight: 800;
            line-height: 1.65;
          }

          .transactions-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 190px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .transaction-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .transaction-stat-card::after {
            content: "";
            position: absolute;
            width: 85px;
            height: 85px;
            right: -38px;
            top: -38px;
            border-radius: 50%;
            background: rgba(212,175,55,0.18);
          }

          .transaction-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .transaction-stat-card h3 {
            color: #667085;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .transaction-stat-card h2 {
            color: #d4af37;
            font-size: 23px;
            font-weight: 950;
          }

          .transactions-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 230px;
            gap: 14px;
            margin-bottom: 22px;
          }

          .transactions-tools input,
          .transactions-tools select,
          .bank-payment-form input,
          .bank-payment-form textarea {
            width: 100%;
            padding: 14px 16px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            background: rgba(255,255,255,0.97);
            font-weight: 760;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
            outline: none;
            transition: 0.28s ease;
          }

          .bank-payment-form textarea {
            min-height: 85px;
            resize: vertical;
            font-family: inherit;
          }

          .transactions-tools input:focus,
          .transactions-tools select:focus,
          .transaction-actions select:focus,
          .bank-payment-form input:focus,
          .bank-payment-form textarea:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .bank-payment-form {
            padding: 20px;
            display: grid;
            gap: 12px;
          }

          .selected-order-box {
            padding: 14px;
            border-radius: 18px;
            background: linear-gradient(135deg, #f8fbff, #ffffff);
            border: 1px solid rgba(0,74,173,0.08);
          }

          .selected-order-box h3 {
            color: #001f4d;
            font-size: 15px;
            margin-bottom: 5px;
          }

          .selected-order-box p {
            color: #667085;
            font-size: 12.5px;
            font-weight: 750;
            line-height: 1.5;
          }

          .save-bank-btn {
            width: 100%;
            border: none;
            padding: 13px;
            border-radius: 16px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .save-bank-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .transactions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(295px, 1fr));
            gap: 17px;
          }

          .transaction-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            transition: 0.3s ease;
          }

          .transaction-card::before {
            content: "";
            position: absolute;
            left: 0;
            top: 22px;
            bottom: 22px;
            width: 5px;
            border-radius: 0 999px 999px 0;
            background: linear-gradient(180deg, #004aad, #d4af37);
            opacity: 0.75;
          }

          .transaction-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 24px 58px rgba(0,31,77,0.14);
          }

          .transaction-top {
            padding: 20px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.07), rgba(212,175,55,0.1));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .customer-line {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .customer-avatar {
            width: 50px;
            height: 50px;
            border-radius: 18px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #d4af37;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
            box-shadow: 0 12px 23px rgba(0,31,77,0.18);
            border: 1px solid rgba(212,175,55,0.22);
            flex-shrink: 0;
          }

          .transaction-top h3 {
            color: #001f4d;
            font-size: 18px;
            margin-bottom: 4px;
          }

          .transaction-top p {
            color: #667085;
            font-size: 13px;
            line-height: 1.45;
          }

          .transaction-body {
            padding: 20px;
          }

          .transaction-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
          }

          .payment-badge,
          .method-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 950;
            border: 1px solid transparent;
            box-shadow: 0 8px 16px rgba(0,31,77,0.055);
          }

          .payment-badge::before,
          .method-badge::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .payment-paid {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
          }

          .payment-paid::before {
            background: #16a34a;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
          }

          .payment-pending {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
          }

          .payment-pending::before {
            background: #d97706;
            box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
          }

          .payment-failed {
            background: linear-gradient(135deg, #fff1f2, #fee2e2);
            color: #991b1b;
          }

          .payment-failed::before {
            background: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.12);
          }

          .payment-refunded {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #1e3a8a;
          }

          .payment-refunded::before {
            background: #2563eb;
          }

          .method-mtn {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
          }

          .method-mtn::before {
            background: #facc15;
          }

          .method-orange {
            background: linear-gradient(135deg, #ffedd5, #fed7aa);
            color: #9a3412;
          }

          .method-orange::before {
            background: #f97316;
          }

          .method-cash {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
          }

          .method-cash::before {
            background: #16a34a;
          }

          .method-bank {
            background: linear-gradient(135deg, #ecfeff, #cffafe);
            color: #155e75;
          }

          .method-bank::before {
            background: #0891b2;
          }

          .method-default {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            color: #334155;
          }

          .method-default::before {
            background: #64748b;
          }

          .transaction-info {
            display: grid;
            gap: 9px;
            margin-bottom: 16px;
          }

          .transaction-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 9px 0;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
            color: #001f4d;
            font-weight: 850;
          }

          .transaction-row span {
            color: #667085;
            font-weight: 700;
          }

          .transaction-total {
            font-size: 17px;
            color: #b8860b !important;
            font-weight: 950 !important;
          }

          .balance-value {
            font-size: 16px;
            font-weight: 950 !important;
          }

          .balance-due {
            color: #dc2626 !important;
          }

          .balance-clear {
            color: #16a34a !important;
          }

          .bank-reference {
            padding: 10px 12px;
            border-radius: 15px;
            background: #f8fbff;
            color: #001f4d;
            font-size: 12px;
            font-weight: 850;
            border: 1px solid rgba(0,74,173,0.08);
            margin-bottom: 13px;
          }

          .transaction-actions {
            display: grid;
            gap: 10px;
          }

          .transaction-actions select {
            width: 100%;
            padding: 12px 14px;
            border-radius: 16px;
            border: 1px solid rgba(0,74,173,0.14);
            color: #001f4d;
            font-weight: 800;
            outline: none;
          }

          .confirm-btn,
          .paid-btn,
          .delete-btn,
          .bank-btn,
          .copy-btn {
            width: 100%;
            border: none;
            padding: 12px 14px;
            border-radius: 16px;
            cursor: pointer;
            font-weight: 950;
            transition: 0.3s ease;
          }

          .confirm-btn {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
          }

          .paid-btn {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            text-align: center;
          }

          .bank-btn {
            background: linear-gradient(135deg, #ecfeff, #cffafe);
            color: #155e75;
          }

          .copy-btn {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .delete-btn {
            background: #dc2626;
            color: white;
          }

          .confirm-btn:hover,
          .delete-btn:hover,
          .bank-btn:hover,
          .copy-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .empty-transactions {
            background: rgba(255,255,255,0.99);
            border-radius: 26px;
            padding: 35px;
            color: #667085;
            text-align: center;
            font-weight: 750;
            box-shadow: 0 16px 42px rgba(0,31,77,0.09);
            border: 1px solid rgba(212,175,55,0.18);
          }

          @media (max-width: 1050px) {
            .secure-bank-panel {
              grid-template-columns: 1fr;
            }

            .transactions-hero {
              flex-direction: column;
              align-items: flex-start;
            }
          }

          @media (max-width: 980px) {
            .transactions-hero-badge {
              min-width: 130px;
              min-height: 100px;
              border-radius: 24px;
            }

            .transactions-tools {
              grid-template-columns: 1fr;
            }

            .bank-info-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .transactions-page {
              padding: 14px;
            }

            .transactions-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .transactions-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .transaction-stat-card {
              padding: 14px;
              border-radius: 19px;
            }

            .transaction-stat-card h2 {
              font-size: 20px;
            }

            .transactions-grid {
              grid-template-columns: 1fr;
            }

            .transaction-row {
              flex-direction: column;
              gap: 4px;
            }
          }
        `}</style>

        <div className="transactions-container">
          <div className="transactions-hero">
            <div className="transactions-hero-content">
              <span className="transactions-label">
                Secure Admin Payment Control
              </span>

              <h1>
                Transactions <span>& Payments</span>
              </h1>

              <p>
                Confirm customer payments, manage bank transfers securely,
                protect the full bank account number, track balances, save
                references and issue receipts only after payment is confirmed.
              </p>
            </div>

            <div className="transactions-hero-badge">
              <strong>{formatMoney(totalRevenue)}</strong>
              <span>Paid Revenue</span>
            </div>
          </div>

          <div className="secure-bank-panel">
            <div className="bank-card">
              <div className="bank-card-head">
                <h2>Secure Bank Transfer Details</h2>
                <p>
                  Customers see only safe payment instructions, beneficiary name
                  and masked account number. The full account number remains
                  internal.
                </p>
              </div>

              <div className="bank-card-body">
                <div className="bank-info-grid">
                  <div className="bank-info-box">
                    <span>Bank</span>
                    <strong>{bankDetails.bankName}</strong>
                  </div>

                  <div className="bank-info-box">
                    <span>Branch</span>
                    <strong>{bankDetails.branch}</strong>
                  </div>

                  <div className="bank-info-box">
                    <span>Beneficiary Name</span>
                    <strong>{bankDetails.accountName}</strong>
                  </div>

                  <div className="bank-info-box">
                    <span>Safe Account Display</span>
                    <strong>{maskAccountNumber(bankDetails.accountNumber)}</strong>
                  </div>
                </div>

                <div className="security-note">
                  Customers should confirm the beneficiary name before sending
                  money. The full account number should not be displayed on
                  public customer pages. After payment, record the amount and
                  reference here.
                </div>
              </div>
            </div>

            <div className="bank-form-card">
              <div className="bank-card-head">
                <h2>Record Bank Payment</h2>
                <p>
                  Select a transaction, enter amount received and transfer
                  reference.
                </p>
              </div>

              <form className="bank-payment-form" onSubmit={saveBankPayment}>
                {selectedOrder ? (
                  <div className="selected-order-box">
                    <h3>{selectedOrder.customer?.name || "Customer"}</h3>
                    <p>Receipt: {selectedOrder.receiptNo || "Pending"}</p>
                    <p>Total: {formatMoney(selectedOrder.total)}</p>
                    <p>Balance: {formatMoney(getBalance(selectedOrder))}</p>
                  </div>
                ) : (
                  <div className="selected-order-box">
                    <h3>No transaction selected</h3>
                    <p>Click “Record Transfer” on a transaction below.</p>
                  </div>
                )}

                <input
                  placeholder="Customer Name"
                  value={bankForm.customerName}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      customerName: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Amount Received"
                  value={bankForm.amount}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      amount: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Bank Transfer Reference"
                  value={bankForm.reference}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      reference: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Sender Name on Transfer"
                  value={bankForm.senderName}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      senderName: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Payment note or clarification"
                  value={bankForm.note}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      note: e.target.value,
                    })
                  }
                />

                <button type="submit" className="save-bank-btn">
                  Save Bank Payment
                </button>
              </form>
            </div>
          </div>

          <div className="transactions-stats">
            <div className="transaction-stat-card">
              <h3>Total Transactions</h3>
              <h2>{totalTransactions}</h2>
            </div>

            <div className="transaction-stat-card">
              <h3>Paid</h3>
              <h2>{paidTransactions}</h2>
            </div>

            <div className="transaction-stat-card">
              <h3>Pending</h3>
              <h2>{pendingTransactions}</h2>
            </div>

            <div className="transaction-stat-card">
              <h3>Bank Transfers</h3>
              <h2>{bankTransfers}</h2>
            </div>

            <div className="transaction-stat-card">
              <h3>Revenue</h3>
              <h2>{formatMoney(totalRevenue)}</h2>
            </div>

            <div className="transaction-stat-card">
              <h3>Pending Balance</h3>
              <h2>{formatMoney(pendingAmount)}</h2>
            </div>
          </div>

          <div className="transactions-tools">
            <input
              type="search"
              placeholder="Search by customer, receipt, reference, payment method or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Transactions</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-transactions">
              No transaction available yet.
            </div>
          ) : (
            <div className="transactions-grid">
              {filteredTransactions.map((order) => (
                <div className="transaction-card" key={order.id}>
                  <div className="transaction-top">
                    <div className="customer-line">
                      <div className="customer-avatar">
                        {getInitials(order.customer?.name)}
                      </div>

                      <div>
                        <h3>{order.customer?.name || "Customer"}</h3>
                        <p>{order.customer?.email || "No email available"}</p>
                        <p>{order.customer?.phone || "No phone available"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="transaction-body">
                    <div className="transaction-badges">
                      <span className={paymentStatusClass(order.paymentStatus)}>
                        {order.paymentStatus || "Pending"}
                      </span>

                      <span className={methodClass(order.paymentMethod)}>
                        {order.paymentMethod || "Payment Method"}
                      </span>
                    </div>

                    <div className="transaction-info">
                      <div className="transaction-row">
                        <span>Order ID</span>
                        <strong>#{order.id}</strong>
                      </div>

                      <div className="transaction-row">
                        <span>Receipt</span>
                        <strong>{order.receiptNo || "Pending"}</strong>
                      </div>

                      <div className="transaction-row">
                        <span>Date</span>
                        <strong>{order.date || "N/A"}</strong>
                      </div>

                      <div className="transaction-row">
                        <span>Order Status</span>
                        <strong>{order.orderStatus || "Pending"}</strong>
                      </div>

                      <div className="transaction-row">
                        <span>Total</span>
                        <strong className="transaction-total">
                          {formatMoney(order.total)}
                        </strong>
                      </div>

                      <div className="transaction-row">
                        <span>Amount Paid</span>
                        <strong>{formatMoney(getAmountPaid(order))}</strong>
                      </div>

                      <div className="transaction-row">
                        <span>Balance</span>
                        <strong className={balanceClass(order)}>
                          {formatMoney(getBalance(order))}
                        </strong>
                      </div>
                    </div>

                    {(order.bankReference || order.paymentNote) && (
                      <div className="bank-reference">
                        {order.bankReference && (
                          <p>Reference: {order.bankReference}</p>
                        )}
                        {order.paymentNote && <p>Note: {order.paymentNote}</p>}
                      </div>
                    )}

                    <div className="transaction-actions">
                      <select
                        value={order.paymentStatus || "Pending"}
                        onChange={(e) =>
                          setPaymentStatus(order.id, e.target.value)
                        }
                      >
                        <option value="Pending">Payment Pending</option>
                        <option value="Paid">Payment Paid</option>
                        <option value="Failed">Payment Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>

                      {order.paymentStatus !== "Paid" ? (
                        <button
                          className="confirm-btn"
                          onClick={() => confirmPayment(order.id)}
                        >
                          Confirm Full Payment
                        </button>
                      ) : (
                        <div className="paid-btn">Payment Confirmed</div>
                      )}

                      <button
                        className="bank-btn"
                        onClick={() => openBankPayment(order)}
                      >
                        Record Transfer / Partial Payment
                      </button>

                      {order.paymentMethod === "Bank Transfer" && (
                        <button
                          className="copy-btn"
                          onClick={() => copyBankInstruction(order)}
                        >
                          Copy Customer Bank Instruction
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() => deleteTransaction(order.id)}
                      >
                        Remove Transaction
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Transactions;
