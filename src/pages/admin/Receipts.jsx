import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";
import logo from "../../assets/images/chafadia-logo.png";

function Receipts() {
  const { orders, deleteOrder } = useStore();

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Paid");

  const visibleOrders = orders.filter((order) =>
    paymentFilter === "All" ? true : order.paymentStatus === paymentFilter
  );

  const filteredReceipts = useMemo(() => {
    return visibleOrders.filter((order) => {
      const itemsText = order.items
        ?.map((item) => `${item.name} ${item.qty} ${item.price}`)
        .join(" ");

      const text = `${order.receiptNo || ""} ${order.id || ""} ${
        order.customerName || order.customer?.name || ""
      } ${order.customerPhone || order.customer?.phone || ""} ${
        order.paymentMethod || ""
      } ${order.paymentStatus || ""} ${itemsText || ""}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [visibleOrders, search]);

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} FCFA`;
  };

  const getAmountPaid = (order) => {
    if (order.paymentStatus === "Paid") {
      return Number(order.amountPaid || order.paidAmount || order.total || 0);
    }

    return Number(order.amountPaid || order.paidAmount || 0);
  };

  const getBalance = (order) => {
    return Math.max(0, Number(order.total || 0) - getAmountPaid(order));
  };

  const getReceiptNo = (order) => {
    return order.receiptNo || `CHF-${order.id}`;
  };

  const getCustomerName = (order) => {
    return order.customerName || order.customer?.name || "Customer";
  };

  const getCustomerPhone = (order) => {
    return order.customerPhone || order.customer?.phone || "N/A";
  };

  const printReceipt = (receiptId) => {
    const printableContent = document.getElementById(`receipt-${receiptId}`);

    if (!printableContent) return;

    const printWindow = window.open("", "_blank", "width=420,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Chafadia Enterprise Receipt</title>

          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              font-family: "Segoe UI", Arial, sans-serif;
              color: #001f4d;
            }

            .receipt-print-area {
              width: 80mm;
              margin: 0 auto;
              padding: 0;
              background: #ffffff;
            }

            .receipt-card {
              width: 80mm;
              max-width: 80mm;
              margin: 0 auto;
              border: none;
              border-radius: 0;
              box-shadow: none;
              overflow: hidden;
              page-break-inside: avoid;
            }

            .receipt-actions {
              display: none !important;
            }

            .receipt-header {
              background:
                radial-gradient(circle at top right, rgba(212, 175, 55, 0.35), transparent 38%),
                linear-gradient(135deg, #004aad, #001f4d) !important;
              color: #ffffff !important;
              padding: 12px;
            }

            .receipt-logo {
              width: 42px;
              height: 42px;
              object-fit: contain;
              background: #ffffff !important;
              border-radius: 12px;
              padding: 4px;
              border: 1px solid #d4af37;
            }

            .receipt-brand {
              display: flex;
              align-items: center;
              gap: 9px;
            }

            .receipt-brand h2 {
              margin: 0;
              color: #ffffff !important;
              font-size: 13px;
              line-height: 1.15;
              font-weight: 900;
            }

            .receipt-brand p {
              margin: 2px 0 0;
              color: #fff3c4 !important;
              font-size: 8.5px;
              line-height: 1.25;
              font-weight: 700;
            }

            .receipt-title {
              display: flex;
              justify-content: space-between;
              gap: 8px;
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px solid rgba(255, 255, 255, 0.25);
            }

            .receipt-title h3 {
              margin: 0;
              color: #d4af37 !important;
              font-size: 16px;
              letter-spacing: 1px;
              font-weight: 900;
            }

            .receipt-title p {
              margin: 1px 0;
              color: #ffffff !important;
              font-size: 8.5px;
              font-weight: 750;
              text-align: right;
            }

            .receipt-body {
              padding: 11px;
              background: #ffffff !important;
            }

            .receipt-line {
              display: flex;
              justify-content: space-between;
              gap: 8px;
              padding: 4px 0;
              border-bottom: 1px dashed rgba(0, 31, 77, 0.22);
              font-size: 10px;
              color: #001f4d !important;
            }

            .receipt-line span:first-child {
              font-weight: 800;
              color: #667085 !important;
            }

            .receipt-line span:last-child {
              text-align: right;
              font-weight: 850;
              color: #001f4d !important;
            }

            .items-title {
              margin: 10px 0 5px;
              padding: 5px 7px;
              border-radius: 9px;
              background: #fff7d6 !important;
              color: #001f4d !important;
              font-size: 10px;
              font-weight: 900;
              text-align: center;
              border: 1px solid rgba(212, 175, 55, 0.45);
            }

            .item-row {
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 6px;
              padding: 5px 0;
              border-bottom: 1px dashed rgba(0, 31, 77, 0.16);
              font-size: 9.5px;
            }

            .item-name {
              color: #001f4d !important;
              font-weight: 850;
            }

            .item-small {
              display: block;
              margin-top: 1px;
              color: #667085 !important;
              font-size: 8.5px;
              font-weight: 700;
            }

            .item-total {
              color: #001f4d !important;
              font-weight: 900;
              text-align: right;
              white-space: nowrap;
            }

            .summary-box {
              margin-top: 10px;
              padding: 9px;
              border-radius: 12px;
              background: linear-gradient(135deg, #ffffff, #fff9e6) !important;
              border: 1.5px solid rgba(212, 175, 55, 0.45);
            }

            .summary-line {
              display: flex;
              justify-content: space-between;
              gap: 8px;
              font-size: 10px;
              padding: 3px 0;
              font-weight: 850;
              color: #001f4d !important;
            }

            .summary-total {
              margin-top: 5px;
              padding-top: 6px;
              border-top: 1px dashed rgba(0, 31, 77, 0.25);
              font-size: 13px;
              font-weight: 950;
            }

            .summary-total strong,
            .gold-text {
              color: #b8860b !important;
            }

            .balance-box {
              margin-top: 8px;
              padding: 9px;
              border-radius: 11px;
              text-align: center;
              font-size: 12px;
              font-weight: 950;
            }

            .balance-due {
              background: #fff1f2 !important;
              color: #dc2626 !important;
              border: 1px solid rgba(220, 38, 38, 0.2);
            }

            .balance-clear {
              background: #ecfdf3 !important;
              color: #16a34a !important;
              border: 1px solid rgba(22, 163, 74, 0.2);
            }

            .stamp {
              margin: 9px auto 0;
              width: fit-content;
              padding: 7px 10px;
              border-radius: 999px;
              font-size: 10px;
              font-weight: 950;
              letter-spacing: 0.8px;
            }

            .paid-stamp {
              background: #dcfce7 !important;
              color: #166534 !important;
              border: 1px solid rgba(22, 101, 52, 0.22);
            }

            .pending-stamp {
              background: #fff7d6 !important;
              color: #92400e !important;
              border: 1px solid rgba(146, 64, 14, 0.22);
            }

            .qr-box {
              width: 58px;
              height: 58px;
              margin: 10px auto 6px;
              border: 2px solid #d4af37;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: #001f4d !important;
              font-size: 8px;
              font-weight: 900;
              line-height: 1.15;
              background: #ffffff !important;
            }

            .receipt-footer {
              text-align: center;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px dashed rgba(0, 31, 77, 0.22);
              color: #667085 !important;
              font-size: 8.5px;
              line-height: 1.35;
              font-weight: 700;
            }
          </style>
        </head>

        <body>
          <div class="receipt-print-area">
            ${printableContent.outerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  };

  const saveReceipt = (order) => {
    const items = order.items || [];

    const itemLines = items
      .map(
        (item) =>
          `${item.name} | Qty: ${item.qty} | Unit: ${formatMoney(
            item.price
          )} | Total: ${formatMoney(
            Number(item.qty || 0) * Number(item.price || 0)
          )}`
      )
      .join("\n");

    const amountPaid = getAmountPaid(order);
    const balance = getBalance(order);

    const receiptText = `
CHAFADIA ENTERPRISE
OFFICIAL RECEIPT

Receipt No: ${getReceiptNo(order)}
Order ID: ${order.id}
Date: ${order.date || "N/A"}

Customer: ${getCustomerName(order)}
Phone: ${getCustomerPhone(order)}
Payment: ${order.paymentMethod || "N/A"}
Cashier: ${order.cashier || "CHAFADIA ENTERPRISE"}

ITEMS
${itemLines || "No items available."}

TOTAL: ${formatMoney(order.total)}
PAID: ${formatMoney(amountPaid)}
BALANCE: ${formatMoney(balance)}
STATUS: ${order.paymentStatus || "N/A"}

Thank you for shopping with Chafadia Enterprise.
`.trim();

    const blob = new Blob([receiptText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${getReceiptNo(order)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const removeReceipt = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this receipt/order?"
    );

    if (!confirmDelete) return;

    if (deleteOrder) {
      deleteOrder(id);
    } else {
      alert(
        "deleteOrder is not available in StoreContext. Please add deleteOrder to your StoreContext."
      );
    }
  };

  const totalReceipts = filteredReceipts.length;

  const totalPaidAmount = filteredReceipts.reduce(
    (sum, order) =>
      sum + Number(order.amountPaid || order.paidAmount || order.total || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div className="receipts-page">
        <style>{`
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .receipts-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.22), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.15), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.1), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .receipts-container {
            max-width: 1180px;
            margin: 0 auto;
          }

          .receipts-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 30px;
            border-radius: 32px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.9));
            border: 1px solid rgba(212, 175, 55, 0.36);
            box-shadow:
              0 26px 65px rgba(0, 31, 77, 0.13),
              inset 0 1px 0 rgba(255,255,255,0.96);
            margin-bottom: 22px;
          }

          .receipts-hero::before {
            content: "";
            position: absolute;
            width: 300px;
            height: 300px;
            right: -130px;
            top: -140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.33), transparent 68%);
          }

          .receipts-hero-content {
            position: relative;
            z-index: 2;
          }

          .receipts-label {
            display: inline-flex;
            padding: 8px 15px;
            border-radius: 999px;
            margin-bottom: 12px;
            background: rgba(212, 175, 55, 0.15);
            color: #001f4d;
            border: 1px solid rgba(212, 175, 55, 0.35);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.9px;
            text-transform: uppercase;
          }

          .receipts-hero h1 {
            color: #001f4d;
            font-size: clamp(30px, 5vw, 50px);
            font-weight: 950;
            letter-spacing: -1.1px;
            margin-bottom: 9px;
          }

          .receipts-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .receipts-hero p {
            color: #667085;
            max-width: 720px;
            line-height: 1.7;
            font-weight: 650;
            font-size: 14.5px;
          }

          .receipts-hero-badge {
            position: relative;
            z-index: 2;
            min-width: 150px;
            min-height: 125px;
            border-radius: 28px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 20px 45px rgba(0,31,77,0.23),
              inset 0 1px 0 rgba(255,255,255,0.22);
            border: 1px solid rgba(255,255,255,0.25);
            text-align: center;
            padding: 15px;
          }

          .receipts-hero-badge strong {
            font-size: 21px;
            color: #d4af37;
            line-height: 1.15;
          }

          .receipts-hero-badge span {
            margin-top: 7px;
            font-size: 11px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .receipts-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 205px;
            gap: 14px;
            margin-bottom: 22px;
          }

          .receipts-tools input,
          .receipts-tools select {
            width: 100%;
            padding: 14px 16px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            background: rgba(255,255,255,0.98);
            font-weight: 760;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
            outline: none;
            transition: 0.28s ease;
          }

          .receipts-tools input:focus,
          .receipts-tools select:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .receipts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 330px));
            justify-content: center;
            gap: 20px;
          }

          .receipt-card {
            width: 100%;
            max-width: 320px;
            margin: auto;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(212, 175, 55, 0.35);
            box-shadow:
              0 18px 42px rgba(0,31,77,0.12),
              inset 0 1px 0 rgba(255,255,255,0.95);
          }

          .receipt-header {
            background:
              radial-gradient(circle at top right, rgba(212, 175, 55, 0.35), transparent 38%),
              linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            padding: 14px;
          }

          .receipt-brand {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .receipt-logo {
            width: 46px;
            height: 46px;
            object-fit: contain;
            background: #ffffff;
            border-radius: 13px;
            padding: 4px;
            border: 1px solid #d4af37;
            box-shadow: 0 8px 18px rgba(0,0,0,0.18);
            flex-shrink: 0;
          }

          .receipt-brand h2 {
            margin: 0;
            color: #ffffff;
            font-size: 13.5px;
            line-height: 1.15;
            font-weight: 950;
            letter-spacing: 0.4px;
          }

          .receipt-brand p {
            margin: 2px 0 0;
            color: #fff3c4;
            font-size: 9px;
            line-height: 1.25;
            font-weight: 700;
          }

          .receipt-title {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-top: 12px;
            padding-top: 9px;
            border-top: 1px solid rgba(255,255,255,0.25);
          }

          .receipt-title h3 {
            margin: 0;
            color: #d4af37;
            font-size: 18px;
            letter-spacing: 1px;
            font-weight: 950;
          }

          .receipt-title p {
            margin: 1px 0;
            color: #ffffff;
            font-size: 9px;
            font-weight: 750;
            text-align: right;
          }

          .receipt-body {
            padding: 12px;
            background: #ffffff;
          }

          .receipt-line {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 5px 0;
            border-bottom: 1px dashed rgba(0, 31, 77, 0.22);
            font-size: 10.5px;
            color: #001f4d;
          }

          .receipt-line span:first-child {
            font-weight: 850;
            color: #667085;
          }

          .receipt-line span:last-child {
            text-align: right;
            font-weight: 900;
            color: #001f4d;
          }

          .items-title {
            margin: 11px 0 6px;
            padding: 6px 8px;
            border-radius: 10px;
            background: #fff7d6;
            color: #001f4d;
            font-size: 10.5px;
            font-weight: 950;
            text-align: center;
            border: 1px solid rgba(212, 175, 55, 0.45);
          }

          .item-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 6px;
            padding: 6px 0;
            border-bottom: 1px dashed rgba(0, 31, 77, 0.16);
            font-size: 10px;
          }

          .item-name {
            color: #001f4d;
            font-weight: 900;
          }

          .item-small {
            display: block;
            margin-top: 2px;
            color: #667085;
            font-size: 8.8px;
            font-weight: 700;
          }

          .item-total {
            color: #001f4d;
            font-weight: 950;
            text-align: right;
            white-space: nowrap;
          }

          .summary-box {
            margin-top: 11px;
            padding: 10px;
            border-radius: 13px;
            background: linear-gradient(135deg, #ffffff, #fff9e6);
            border: 1.5px solid rgba(212, 175, 55, 0.45);
            box-shadow: 0 8px 22px rgba(212,175,55,0.1);
          }

          .summary-line {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            font-size: 10.5px;
            padding: 3px 0;
            font-weight: 850;
            color: #001f4d;
          }

          .summary-total {
            margin-top: 6px;
            padding-top: 7px;
            border-top: 1px dashed rgba(0, 31, 77, 0.25);
            font-size: 14px;
            font-weight: 950;
          }

          .summary-total strong,
          .gold-text {
            color: #b8860b;
          }

          .balance-box {
            margin-top: 8px;
            padding: 10px;
            border-radius: 12px;
            text-align: center;
            font-size: 12.5px;
            font-weight: 950;
          }

          .balance-due {
            background: #fff1f2;
            color: #dc2626;
            border: 1px solid rgba(220, 38, 38, 0.2);
          }

          .balance-clear {
            background: #ecfdf3;
            color: #16a34a;
            border: 1px solid rgba(22, 163, 74, 0.2);
          }

          .stamp {
            margin: 9px auto 0;
            width: fit-content;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 0.8px;
          }

          .paid-stamp {
            background: #dcfce7;
            color: #166534;
            border: 1px solid rgba(22, 101, 52, 0.22);
          }

          .pending-stamp {
            background: #fff7d6;
            color: #92400e;
            border: 1px solid rgba(146, 64, 14, 0.22);
          }

          .qr-box {
            width: 62px;
            height: 62px;
            margin: 10px auto 7px;
            border: 2px solid #d4af37;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #001f4d;
            font-size: 8px;
            font-weight: 900;
            line-height: 1.15;
            background: #ffffff;
          }

          .receipt-footer {
            text-align: center;
            margin-top: 9px;
            padding-top: 8px;
            border-top: 1px dashed rgba(0, 31, 77, 0.22);
            color: #667085;
            font-size: 9px;
            line-height: 1.35;
            font-weight: 700;
          }

          .receipt-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 11px;
            background: #f8fbff;
            border-top: 1px solid rgba(0,74,173,0.08);
          }

          .receipt-actions button {
            border: none;
            padding: 9px;
            border-radius: 12px;
            font-size: 11.5px;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .print-btn {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
          }

          .save-btn {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .delete-btn {
            background: #dc2626;
            color: white;
          }

          .receipt-actions button:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .empty-receipts {
            background: rgba(255,255,255,0.99);
            border-radius: 26px;
            padding: 35px;
            color: #667085;
            text-align: center;
            font-weight: 750;
            box-shadow: 0 16px 42px rgba(0,31,77,0.09);
            border: 1px solid rgba(212,175,55,0.18);
          }

          @media (max-width: 900px) {
            .receipts-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .receipts-tools {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .receipts-page {
              padding: 14px;
            }

            .receipts-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .receipts-grid {
              grid-template-columns: 1fr;
            }

            .receipt-actions {
              grid-template-columns: 1fr;
            }
          }

          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }

            body * {
              visibility: hidden !important;
            }

            .receipt-card,
            .receipt-card * {
              visibility: visible !important;
            }

            .receipt-actions,
            .receipt-actions * {
              display: none !important;
              visibility: hidden !important;
            }

            .navbar,
            .receipts-hero,
            .receipts-tools {
              display: none !important;
            }

            .receipts-page {
              background: #ffffff !important;
              padding: 0 !important;
            }

            .receipts-container,
            .receipts-grid {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              max-width: none !important;
            }

            .receipt-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm !important;
              max-width: 80mm !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        <div className="receipts-container">
          <div className="receipts-hero">
            <div className="receipts-hero-content">
              <span className="receipts-label">Professional Receipt Center</span>

              <h1>
                All <span>Receipts</span>
              </h1>

              <p>
                Compact premium receipts for printing. Only the receipt section
                prints, colors and logo stay visible, and the layout fits one
                clean POS-style page.
              </p>
            </div>

            <div className="receipts-hero-badge">
              <strong>{formatMoney(totalPaidAmount)}</strong>
              <span>{totalReceipts} Receipts</span>
            </div>
          </div>

          <div className="receipts-tools">
            <input
              type="search"
              placeholder="Search by receipt number, customer, phone, payment method or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="Paid">Paid Receipts</option>
              <option value="All">All Orders</option>
              <option value="Pending">Pending Orders</option>
            </select>
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="empty-receipts">
              No receipt available yet.
            </div>
          ) : (
            <div className="receipts-grid">
              {filteredReceipts.map((order) => {
                const items = order.items || [];
                const amountPaid = getAmountPaid(order);
                const balance = getBalance(order);

                return (
                  <div
                    className="receipt-card"
                    key={order.id}
                    id={`receipt-${order.id}`}
                  >
                    <div className="receipt-header">
                      <div className="receipt-brand">
                        <img
                          src={logo}
                          alt="Chafadia Enterprise"
                          className="receipt-logo"
                        />

                        <div>
                          <h2>CHAFADIA ENTERPRISE</h2>
                          <p>Beauty • Wellness • Fashion • Halal Drinks</p>
                          <p>Nkolmesseng, Yaoundé - Cameroon</p>
                        </div>
                      </div>

                      <div className="receipt-title">
                        <div>
                          <h3>RECEIPT</h3>
                          <p>{getReceiptNo(order)}</p>
                        </div>

                        <div>
                          <p>Order: #{order.id}</p>
                          <p>Date: {order.date || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="receipt-body">
                      <div className="receipt-line">
                        <span>Customer</span>
                        <span>{getCustomerName(order)}</span>
                      </div>

                      <div className="receipt-line">
                        <span>Phone</span>
                        <span>{getCustomerPhone(order)}</span>
                      </div>

                      <div className="receipt-line">
                        <span>Payment</span>
                        <span>{order.paymentMethod || "N/A"}</span>
                      </div>

                      <div className="receipt-line">
                        <span>Cashier</span>
                        <span>{order.cashier || "Chafadia Enterprise"}</span>
                      </div>

                      <div className="items-title">PURCHASE SUMMARY</div>

                      {items.length === 0 ? (
                        <div className="item-row">
                          <span className="item-name">No items available</span>
                          <span className="item-total">-</span>
                        </div>
                      ) : (
                        items.map((item, index) => (
                          <div className="item-row" key={index}>
                            <div>
                              <span className="item-name">{item.name}</span>
                              <span className="item-small">
                                Qty {item.qty} × {formatMoney(item.price)}
                              </span>
                            </div>

                            <span className="item-total">
                              {formatMoney(
                                Number(item.qty || 0) *
                                  Number(item.price || 0)
                              )}
                            </span>
                          </div>
                        ))
                      )}

                      <div className="summary-box">
                        <div className="summary-line">
                          <span>Total</span>
                          <strong>{formatMoney(order.total)}</strong>
                        </div>

                        <div className="summary-line">
                          <span>Paid</span>
                          <strong>{formatMoney(amountPaid)}</strong>
                        </div>

                        <div className="summary-line summary-total">
                          <span>Balance</span>
                          <strong className="gold-text">
                            {formatMoney(balance)}
                          </strong>
                        </div>
                      </div>

                      <div
                        className={
                          balance > 0
                            ? "balance-box balance-due"
                            : "balance-box balance-clear"
                        }
                      >
                        {balance > 0
                          ? `BALANCE: ${formatMoney(balance)}`
                          : "FULLY PAID"}
                      </div>

                      {order.paymentStatus === "Paid" ? (
                        <div className="stamp paid-stamp">
                          ✓ PAID & VERIFIED
                        </div>
                      ) : (
                        <div className="stamp pending-stamp">
                          BALANCE PENDING
                        </div>
                      )}

                      <div className="qr-box">
                        QR
                        <br />
                        VERIFY
                        <br />
                        {getReceiptNo(order)}
                      </div>

                      <div className="receipt-footer">
                        Thank you for shopping with us.
                        <br />
                        📍 Nkolmesseng, Yaoundé
                        <br />
                        Chafadia Enterprise
                      </div>
                    </div>

                    <div className="receipt-actions">
                      <button
                        type="button"
                        className="print-btn"
                        onClick={() => printReceipt(order.id)}
                      >
                        Print
                      </button>

                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => saveReceipt(order)}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeReceipt(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Receipts;
