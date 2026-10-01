import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";

function SalesReports() {
  const { orders, products, addRecordedSale } = useStore();

  const today = new Date().toISOString().slice(0, 10);

  const [period, setPeriod] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [saleForm, setSaleForm] = useState({
    customerName: "",
    customerPhone: "",
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    amountPaid: "",
    date: today,
    note: "",
    items: [
      {
        id: Date.now(),
        name: "",
        qty: "",
        price: "",
      },
    ],
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Stock Purchase",
    amount: "",
    date: today,
    note: "",
  });

  const [incomeForm, setIncomeForm] = useState({
    title: "",
    source: "Other Income",
    amount: "",
    date: today,
    note: "",
  });

  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("salesExpenses")) || []
  );

  const [extraIncomes, setExtraIncomes] = useState(
    JSON.parse(localStorage.getItem("salesExtraIncomes")) || []
  );

  const saleTotal = saleForm.items.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
    0
  );

  const totalSaleItems = saleForm.items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );


  const amountPaidPreview =
    saleForm.paymentStatus === "Paid"
      ? saleTotal
      : Number(saleForm.amountPaid || 0);

  const balancePreview = Math.max(0, saleTotal - amountPaidPreview);

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem("salesExpenses", JSON.stringify(newExpenses));
  };

  const saveExtraIncomes = (newIncomes) => {
    setExtraIncomes(newIncomes);
    localStorage.setItem("salesExtraIncomes", JSON.stringify(newIncomes));
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.date);

      const matchesPayment =
        paymentFilter === "All" || order.paymentStatus === paymentFilter;

      const itemsText = order.items
        ?.map((item) => `${item.name} ${item.qty} ${item.price}`)
        .join(" ");

      const searchText = `${order.id} ${order.receiptNo || ""} ${
        order.customerName || order.customer?.name || ""
      } ${order.customerPhone || order.customer?.phone || ""} ${
        order.paymentMethod || ""
      } ${order.paymentStatus || ""} ${itemsText || ""}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      let matchesPeriod = true;

      if (period === "Today") {
        matchesPeriod = orderDate.toDateString() === now.toDateString();
      }

      if (period === "This Week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesPeriod = orderDate >= sevenDaysAgo;
      }

      if (period === "This Month") {
        matchesPeriod =
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear();
      }

      return matchesPayment && matchesPeriod && matchesSearch;
    });
  }, [orders, period, paymentFilter, search]);

  const allSalesRecords = filteredOrders.map((order) => ({
    id: order.id,
    receiptNo: order.receiptNo,
    customerName: order.customerName || order.customer?.name || "Customer",
    customerPhone: order.customerPhone || order.customer?.phone || "",
    total: Number(order.total || 0),
    amountPaid:
      order.paymentStatus === "Paid"
        ? Number(order.amountPaid || order.paidAmount || order.total || 0)
        : Number(order.amountPaid || order.paidAmount || 0),
    balance: Math.max(
      0,
      Number(order.total || 0) -
        (order.paymentStatus === "Paid"
          ? Number(order.amountPaid || order.paidAmount || order.total || 0)
          : Number(order.amountPaid || order.paidAmount || 0))
    ),
    paymentStatus: order.paymentStatus || "Pending",
    paymentMethod: order.paymentMethod || "N/A",
    date: order.date || "N/A",
    type: order.source === "SalesReports" ? "Recorded Sale" : "Order",
    items: order.items || [],
    note: order.note || "",
  }));

  const paidSales = allSalesRecords.filter(
    (sale) => sale.paymentStatus === "Paid"
  );

  const pendingSales = allSalesRecords.filter(
    (sale) => sale.paymentStatus === "Pending"
  );

  const totalSales = paidSales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  const pendingAmount = pendingSales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  const totalBalance = allSalesRecords.reduce(
    (sum, sale) => sum + Number(sale.balance || 0),
    0
  );

  const totalAmountPaid = allSalesRecords.reduce(
    (sum, sale) => sum + Number(sale.amountPaid || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const totalExtraIncome = extraIncomes.reduce(
    (sum, income) => sum + Number(income.amount || 0),
    0
  );

  const grossIncome = totalSales + totalExtraIncome;
  const netProfit = grossIncome - totalExpenses;

  const totalItemsSold = paidSales.reduce((sum, sale) => {
    const itemCount = sale.items?.reduce(
      (itemSum, item) => itemSum + Number(item.qty || 0),
      0
    );

    return sum + Number(itemCount || 0);
  }, 0);

  const dailySalesAmount = allSalesRecords
    .filter((sale) => sale.date === today && sale.paymentStatus === "Paid")
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const dailyExpenses = expenses
    .filter((expense) => expense.date === today)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const dailyProfit = dailySalesAmount - dailyExpenses;

  const productSales = {};

  paidSales.forEach((sale) => {
    sale.items?.forEach((item) => {
      if (!productSales[item.name]) {
        productSales[item.name] = {
          name: item.name,
          qty: 0,
          revenue: 0,
        };
      }

      productSales[item.name].qty += Number(item.qty || 0);
      productSales[item.name].revenue +=
        Number(item.qty || 0) * Number(item.price || 0);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const paymentMethods = {};

  paidSales.forEach((sale) => {
    const method = sale.paymentMethod || "Unknown";

    if (!paymentMethods[method]) {
      paymentMethods[method] = {
        method,
        count: 0,
        amount: 0,
      };
    }

    paymentMethods[method].count += 1;
    paymentMethods[method].amount += Number(sale.total || 0);
  });

  const paymentSummary = Object.values(paymentMethods).sort(
    (a, b) => b.amount - a.amount
  );

  const stockValue =
    products?.reduce(
      (sum, product) =>
        sum + Number(product.price || 0) * Number(product.stock || 0),
      0
    ) || 0;

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} FCFA`;
  };

  const updateSaleItem = (id, field, value) => {
    setSaleForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const addSaleItemRow = () => {
    setSaleForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          name: "",
          qty: "",
          price: "",
        },
      ],
    }));
  };

  const removeSaleItemRow = (id) => {
    if (saleForm.items.length === 1) {
      alert("At least one product is required.");
      return;
    }

    setSaleForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const addSaleToOrdersTransactionsAndReceipts = (e) => {
    e.preventDefault();

    const validItems = saleForm.items.filter(
      (item) => item.name.trim() && Number(item.qty) > 0 && Number(item.price) > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one valid product with quantity and price.");
      return;
    }

    const total = validItems.reduce(
      (sum, item) => sum + Number(item.qty) * Number(item.price),
      0
    );

    const amountPaid =
      saleForm.paymentStatus === "Paid"
        ? total
        : Number(saleForm.amountPaid || 0);

    const balance = Math.max(0, total - amountPaid);

    const finalPaymentStatus = balance <= 0 ? "Paid" : "Pending";

    addRecordedSale({
      customerName: saleForm.customerName || "Walk-in Customer",
      customerPhone: saleForm.customerPhone,
      items: validItems,
      total,
      amountPaid,
      paidAmount: amountPaid,
      balance,
      paymentStatus: finalPaymentStatus,
      paymentMethod: saleForm.paymentMethod,
      date: saleForm.date,
      note: saleForm.note,
    });

    setSaleForm({
      customerName: "",
      customerPhone: "",
      paymentStatus: "Paid",
      paymentMethod: "Cash",
      amountPaid: "",
      date: today,
      note: "",
      items: [
        {
          id: Date.now(),
          name: "",
          qty: "",
          price: "",
        },
      ],
    });

    alert(
      "Sale saved successfully. It now appears automatically in Transactions and Receipts."
    );
  };

  const addExpense = (e) => {
    e.preventDefault();

    if (!expenseForm.title || !expenseForm.amount) {
      alert("Please fill expense title and amount.");
      return;
    }

    const newExpenses = [
      {
        id: Date.now(),
        ...expenseForm,
        amount: Number(expenseForm.amount),
      },
      ...expenses,
    ];

    saveExpenses(newExpenses);

    setExpenseForm({
      title: "",
      category: "Stock Purchase",
      amount: "",
      date: today,
      note: "",
    });
  };

  const addExtraIncome = (e) => {
    e.preventDefault();

    if (!incomeForm.title || !incomeForm.amount) {
      alert("Please fill income title and amount.");
      return;
    }

    const newIncomes = [
      {
        id: Date.now(),
        ...incomeForm,
        amount: Number(incomeForm.amount),
      },
      ...extraIncomes,
    ];

    saveExtraIncomes(newIncomes);

    setIncomeForm({
      title: "",
      source: "Other Income",
      amount: "",
      date: today,
      note: "",
    });
  };

  const deleteExpense = (id) => {
    saveExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const deleteIncome = (id) => {
    saveExtraIncomes(extraIncomes.filter((income) => income.id !== id));
  };

  const printReport = () => {
    window.print();
  };

  return (
    <>
      <Navbar />

      <div className="sales-page">
        <style>{`
          .sales-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.24), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .sales-container {
            max-width: 1340px;
            margin: 0 auto;
          }

          .sales-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 28px;
            padding: 36px;
            border-radius: 38px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.9));
            border: 1px solid rgba(212, 175, 55, 0.38);
            box-shadow:
              0 30px 80px rgba(0, 31, 77, 0.15),
              inset 0 1px 0 rgba(255,255,255,0.96);
            margin-bottom: 24px;
          }

          .sales-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .sales-hero::after {
            content: "";
            position: absolute;
            width: 165px;
            height: 165px;
            left: -72px;
            bottom: -78px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,74,173,0.2), transparent 70%);
          }

          .sales-hero-content {
            position: relative;
            z-index: 2;
          }

          .sales-label {
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

          .sales-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .sales-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .sales-hero p {
            color: #667085;
            max-width: 790px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .sales-print-btn {
            position: relative;
            z-index: 2;
            padding: 13px 20px;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            font-weight: 950;
            cursor: pointer;
            box-shadow: 0 14px 30px rgba(212,175,55,0.22);
            transition: 0.3s ease;
            white-space: nowrap;
          }

          .sales-print-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
          }

          .sales-filters {
            display: grid;
            grid-template-columns: minmax(0, 1.3fr) 190px 190px;
            gap: 14px;
            margin-bottom: 22px;
          }

          .sales-filters input,
          .sales-filters select,
          .sales-form input,
          .sales-form select,
          .sales-form textarea,
          .sale-item-row input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            font-weight: 760;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
            outline: none;
            transition: 0.28s ease;
          }

          .sales-form textarea {
            min-height: 90px;
            resize: vertical;
            font-family: inherit;
          }

          .sales-filters input:focus,
          .sales-filters select:focus,
          .sales-form input:focus,
          .sales-form select:focus,
          .sales-form textarea:focus,
          .sale-item-row input:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .sales-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(165px, 205px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .sales-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .sales-stat-card::after {
            content: "";
            position: absolute;
            width: 85px;
            height: 85px;
            right: -38px;
            top: -38px;
            border-radius: 50%;
            background: rgba(212,175,55,0.18);
          }

          .sales-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .sales-stat-card h3 {
            color: #667085;
            font-size: 11.2px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .sales-stat-card h2 {
            color: #d4af37;
            font-size: 23px;
            font-weight: 950;
          }

          .positive {
            color: #16a34a !important;
          }

          .negative {
            color: #dc2626 !important;
          }

          .balance-warning {
            color: #dc2626 !important;
            font-weight: 950 !important;
          }

          .balance-clear {
            color: #16a34a !important;
            font-weight: 950 !important;
          }

          .forms-grid {
            display: grid;
            grid-template-columns: 1.35fr 0.85fr 0.85fr;
            gap: 18px;
            margin-bottom: 24px;
            align-items: start;
          }

          .sales-panel,
          .sales-form-card {
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            overflow: hidden;
          }

          .sales-form-head,
          .sales-panel-head {
            padding: 20px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.07), rgba(212,175,55,0.12));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .sales-form-head h2,
          .sales-panel-head h2 {
            color: #001f4d;
            font-size: 21px;
            margin-bottom: 6px;
          }

          .sales-form-head p,
          .sales-panel-head p {
            color: #667085;
            font-size: 13px;
            line-height: 1.55;
            font-weight: 650;
          }

          .sales-form {
            padding: 20px;
            display: grid;
            gap: 12px;
          }

          .sale-section-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 13px 14px;
            border-radius: 18px;
            background: linear-gradient(135deg, #f8fbff, #ffffff);
            border: 1px solid rgba(0,74,173,0.08);
          }

          .sale-section-title strong {
            color: #001f4d;
            font-size: 14px;
          }

          .sale-section-title span {
            color: #667085;
            font-size: 12px;
            font-weight: 750;
          }

          .sale-item-row {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) 90px 120px 120px 44px;
            gap: 10px;
            align-items: center;
            padding: 13px;
            border-radius: 20px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .item-total-box {
            padding: 13px 10px;
            border-radius: 16px;
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #001f4d;
            font-size: 12px;
            font-weight: 950;
            text-align: center;
            white-space: nowrap;
          }

          .remove-item-btn,
          .add-item-btn {
            border: none;
            cursor: pointer;
            font-weight: 950;
            transition: 0.3s ease;
          }

          .remove-item-btn {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: #fee2e2;
            color: #991b1b;
          }

          .remove-item-btn:hover {
            background: #dc2626;
            color: #fff;
          }

          .add-item-btn {
            padding: 12px 14px;
            border-radius: 16px;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .add-item-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
          }

          .sale-summary-box {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .sale-summary-mini {
            padding: 14px;
            border-radius: 18px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
            text-align: center;
          }

          .sale-summary-mini span {
            color: #667085;
            font-size: 11px;
            font-weight: 850;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }

          .sale-summary-mini strong {
            display: block;
            color: #d4af37;
            font-size: 17px;
            margin-top: 6px;
          }

          .save-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 18px;
            cursor: pointer;
            font-weight: 950;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
            box-shadow: 0 16px 34px rgba(0,31,77,0.2);
            transition: 0.3s ease;
          }

          .save-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .sales-section-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 22px;
          }

          .sales-panel-content {
            padding: 20px;
          }

          .report-list {
            display: grid;
            gap: 12px;
          }

          .report-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            padding: 14px;
            border-radius: 18px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .report-row strong {
            color: #001f4d;
          }

          .report-row span {
            color: #667085;
            font-size: 13px;
            font-weight: 750;
          }

          .report-money {
            color: #b8860b !important;
            font-weight: 950 !important;
          }

          .record-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 20px;
            margin-bottom: 22px;
          }

          .records-list {
            display: grid;
            gap: 12px;
          }

          .record-card {
            padding: 15px;
            border-radius: 20px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
            display: grid;
            gap: 8px;
          }

          .record-card h3 {
            color: #001f4d;
            font-size: 16px;
          }

          .record-card p {
            color: #667085;
            font-size: 13px;
            line-height: 1.55;
            font-weight: 650;
          }

          .record-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
          }

          .items-list {
            display: grid;
            gap: 5px;
            padding: 10px;
            border-radius: 15px;
            background: #fff;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .items-list span {
            color: #667085;
            font-size: 12px;
            font-weight: 750;
          }

          .delete-mini {
            border: none;
            padding: 8px 11px;
            border-radius: 12px;
            background: #dc2626;
            color: #fff;
            font-weight: 900;
            cursor: pointer;
          }

          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 950;
            border: 1px solid transparent;
          }

          .status-pill::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }

          .paid-pill {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
          }

          .paid-pill::before {
            background: #16a34a;
          }

          .pending-pill {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
          }

          .pending-pill::before {
            background: #d97706;
          }

          .table-wrap {
            width: 100%;
            overflow-x: auto;
            background: #fff;
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
          }

          .sales-table {
            width: 100%;
            min-width: 900px;
            border-collapse: collapse;
          }

          .sales-table th,
          .sales-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .sales-table th {
            color: #001f4d;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            background: rgba(0,74,173,0.05);
          }

          .sales-table td {
            color: #667085;
            font-weight: 700;
          }

          .empty-report {
            padding: 25px;
            border-radius: 20px;
            background: #f8fbff;
            color: #667085;
            text-align: center;
            font-weight: 750;
          }

          @media (max-width: 1150px) {
            .forms-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 1050px) {
            .sales-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .sales-section-grid,
            .record-grid {
              grid-template-columns: 1fr;
            }

            .sales-filters {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 760px) {
            .sale-item-row {
              grid-template-columns: 1fr;
            }

            .remove-item-btn {
              width: 100%;
            }

            .sale-summary-box {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 650px) {
            .sales-page {
              padding: 14px;
            }

            .sales-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .sales-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .sales-stat-card {
              padding: 14px;
              border-radius: 19px;
            }

            .sales-stat-card h2 {
              font-size: 19px;
            }

            .report-row,
            .record-row {
              flex-direction: column;
              align-items: flex-start;
            }
          }

          @media print {
            .navbar,
            .sales-filters,
            .sales-print-btn,
            .forms-grid,
            .delete-mini,
            .save-btn,
            .add-item-btn,
            .remove-item-btn {
              display: none !important;
            }

            .sales-page {
              background: #fff;
              padding: 0;
            }

            .sales-hero,
            .sales-stat-card,
            .sales-panel,
            .table-wrap {
              box-shadow: none;
            }
          }
        `}</style>

        <div className="sales-container">
          <div className="sales-hero">
            <div className="sales-hero-content">
              <span className="sales-label">
                Connected Finance Center
              </span>

              <h1>
                Sales <span>& Financial Reports</span>
              </h1>

              <p>
                Record a customer sale once and it will automatically appear in
                Transactions and Receipts because the sale is saved directly into
                your store orders.
              </p>
            </div>

            <button
              type="button"
              className="sales-print-btn"
              onClick={printReport}
            >
              Print Report
            </button>
          </div>

          <div className="sales-filters">
            <input
              type="search"
              placeholder="Search customer, product, receipt, payment method or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="sales-stats">
            <div className="sales-stat-card">
              <h3>Today Sales</h3>
              <h2>{formatMoney(dailySalesAmount)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Total Sales</h3>
              <h2>{formatMoney(totalSales)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Extra Income</h3>
              <h2>{formatMoney(totalExtraIncome)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Expenses</h3>
              <h2 className="negative">{formatMoney(totalExpenses)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Net Profit</h3>
              <h2 className={netProfit >= 0 ? "positive" : "negative"}>
                {formatMoney(netProfit)}
              </h2>
            </div>

            <div className="sales-stat-card">
              <h3>Pending Amount</h3>
              <h2>{formatMoney(pendingAmount)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Amount Paid</h3>
              <h2 className="positive">{formatMoney(totalAmountPaid)}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Balance</h3>
              <h2 className={totalBalance > 0 ? "negative" : "positive"}>
                {formatMoney(totalBalance)}
              </h2>
            </div>

            <div className="sales-stat-card">
              <h3>Items Sold</h3>
              <h2>{totalItemsSold}</h2>
            </div>

            <div className="sales-stat-card">
              <h3>Today Profit</h3>
              <h2 className={dailyProfit >= 0 ? "positive" : "negative"}>
                {formatMoney(dailyProfit)}
              </h2>
            </div>

            <div className="sales-stat-card">
              <h3>Stock Value</h3>
              <h2>{formatMoney(stockValue)}</h2>
            </div>
          </div>

          <div className="forms-grid">
            <div className="sales-form-card">
              <div className="sales-form-head">
                <h2>Record Customer Sale</h2>
                <p>
                  Add one customer, then add all products bought. Saving this
                  creates an order, transaction and receipt automatically.
                </p>
              </div>

              <form
                className="sales-form"
                onSubmit={addSaleToOrdersTransactionsAndReceipts}
              >
                <input
                  placeholder="Customer Name"
                  value={saleForm.customerName}
                  onChange={(e) =>
                    setSaleForm({ ...saleForm, customerName: e.target.value })
                  }
                />

                <input
                  placeholder="Customer Phone / WhatsApp"
                  value={saleForm.customerPhone}
                  onChange={(e) =>
                    setSaleForm({ ...saleForm, customerPhone: e.target.value })
                  }
                />

                <div className="sale-section-title">
                  <strong>Products Bought</strong>
                  <span>Add all items for this customer</span>
                </div>

                {saleForm.items.map((item, index) => (
                  <div className="sale-item-row" key={item.id}>
                    <input
                      placeholder={`Product ${index + 1} name`}
                      value={item.name}
                      onChange={(e) =>
                        updateSaleItem(item.id, "name", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) =>
                        updateSaleItem(item.id, "qty", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.price}
                      onChange={(e) =>
                        updateSaleItem(item.id, "price", e.target.value)
                      }
                    />

                    <div className="item-total-box">
                      {formatMoney(Number(item.qty || 0) * Number(item.price || 0))}
                    </div>

                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeSaleItemRow(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addSaleItemRow}
                >
                  + Add Another Product
                </button>

                <div className="sale-summary-box">
                  <div className="sale-summary-mini">
                    <span>Total Items</span>
                    <strong>{totalSaleItems}</strong>
                  </div>

                  <div className="sale-summary-mini">
                    <span>Products</span>
                    <strong>{saleForm.items.length}</strong>
                  </div>

                  <div className="sale-summary-mini">
                    <span>Total Bill</span>
                    <strong>{formatMoney(saleTotal)}</strong>
                  </div>

                  <div className="sale-summary-mini">
                    <span>Amount Paid</span>
                    <strong>{formatMoney(amountPaidPreview)}</strong>
                  </div>

                  <div className="sale-summary-mini">
                    <span>Balance</span>
                    <strong
                      className={balancePreview > 0 ? "balance-warning" : "balance-clear"}
                    >
                      {formatMoney(balancePreview)}
                    </strong>
                  </div>
                </div>

                <select
                  value={saleForm.paymentStatus}
                  onChange={(e) =>
                    setSaleForm({
                      ...saleForm,
                      paymentStatus: e.target.value,
                      amountPaid: e.target.value === "Paid" ? "" : saleForm.amountPaid,
                    })
                  }
                >
                  <option value="Paid">Paid in Full</option>
                  <option value="Pending">Part Payment / Balance</option>
                </select>

                {saleForm.paymentStatus === "Pending" && (
                  <input
                    type="number"
                    placeholder="Amount Paid Now"
                    value={saleForm.amountPaid}
                    onChange={(e) =>
                      setSaleForm({ ...saleForm, amountPaid: e.target.value })
                    }
                  />
                )}

                <select
                  value={saleForm.paymentMethod}
                  onChange={(e) =>
                    setSaleForm({ ...saleForm, paymentMethod: e.target.value })
                  }
                >
                  <option value="Cash">Cash</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <input
                  type="date"
                  value={saleForm.date}
                  onChange={(e) =>
                    setSaleForm({ ...saleForm, date: e.target.value })
                  }
                />

                <textarea
                  placeholder="Sale note, delivery note or balance information"
                  value={saleForm.note}
                  onChange={(e) =>
                    setSaleForm({ ...saleForm, note: e.target.value })
                  }
                />

                <button className="save-btn" type="submit">
                  Save Sale to Transactions & Receipts
                </button>
              </form>
            </div>

            <div className="sales-form-card">
              <div className="sales-form-head">
                <h2>Record Expense</h2>
                <p>Track outgoings like stock, transport, rent, salaries and packaging.</p>
              </div>

              <form className="sales-form" onSubmit={addExpense}>
                <input
                  placeholder="Expense Title"
                  required
                  value={expenseForm.title}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, title: e.target.value })
                  }
                />

                <select
                  value={expenseForm.category}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, category: e.target.value })
                  }
                >
                  <option>Stock Purchase</option>
                  <option>Packaging</option>
                  <option>Transport</option>
                  <option>Rent</option>
                  <option>Salary</option>
                  <option>Marketing</option>
                  <option>Other Expense</option>
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  required
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, date: e.target.value })
                  }
                />

                <textarea
                  placeholder="Note"
                  value={expenseForm.note}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, note: e.target.value })
                  }
                />

                <button className="save-btn" type="submit">
                  Save Expense
                </button>
              </form>
            </div>

            <div className="sales-form-card">
              <div className="sales-form-head">
                <h2>Record Incoming</h2>
                <p>Add extra incoming money apart from product sales.</p>
              </div>

              <form className="sales-form" onSubmit={addExtraIncome}>
                <input
                  placeholder="Income Title"
                  required
                  value={incomeForm.title}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, title: e.target.value })
                  }
                />

                <select
                  value={incomeForm.source}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, source: e.target.value })
                  }
                >
                  <option>Other Income</option>
                  <option>Delivery Income</option>
                  <option>Service Fee</option>
                  <option>Wholesale Payment</option>
                  <option>Investment</option>
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  required
                  value={incomeForm.amount}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, amount: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={incomeForm.date}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, date: e.target.value })
                  }
                />

                <textarea
                  placeholder="Note"
                  value={incomeForm.note}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, note: e.target.value })
                  }
                />

                <button className="save-btn" type="submit">
                  Save Incoming
                </button>
              </form>
            </div>
          </div>

          <div className="sales-section-grid">
            <div className="sales-panel">
              <div className="sales-panel-head">
                <h2>Top Selling Products</h2>
                <p>Products ranked by revenue from paid sales.</p>
              </div>

              <div className="sales-panel-content">
                <div className="report-list">
                  {topProducts.length === 0 ? (
                    <div className="empty-report">
                      No paid product sales yet.
                    </div>
                  ) : (
                    topProducts.map((product) => (
                      <div className="report-row" key={product.name}>
                        <div>
                          <strong>{product.name}</strong>
                          <span>Qty Sold: {product.qty}</span>
                        </div>

                        <span className="report-money">
                          {formatMoney(product.revenue)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="sales-panel">
              <div className="sales-panel-head">
                <h2>Payment Summary</h2>
                <p>Revenue grouped by payment method.</p>
              </div>

              <div className="sales-panel-content">
                <div className="report-list">
                  {paymentSummary.length === 0 ? (
                    <div className="empty-report">
                      No paid payments found.
                    </div>
                  ) : (
                    paymentSummary.map((payment) => (
                      <div className="report-row" key={payment.method}>
                        <div>
                          <strong>{payment.method}</strong>
                          <span>{payment.count} Paid Records</span>
                        </div>

                        <span className="report-money">
                          {formatMoney(payment.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="record-grid">
            <div className="sales-panel">
              <div className="sales-panel-head">
                <h2>Sales Records</h2>
                <p>All sales that feed Transactions and Receipts.</p>
              </div>

              <div className="sales-panel-content records-list">
                {allSalesRecords.length === 0 ? (
                  <div className="empty-report">No sales inserted yet.</div>
                ) : (
                  allSalesRecords.map((sale) => (
                    <div className="record-card" key={sale.id}>
                      <div className="record-row">
                        <h3>{sale.customerName}</h3>
                        <strong>{sale.receiptNo}</strong>
                      </div>

                      <div className="items-list">
                        {sale.items.map((item, index) => (
                          <span key={index}>
                            {item.name} — Qty {item.qty} × {formatMoney(item.price)} ={" "}
                            {formatMoney(Number(item.qty) * Number(item.price))}
                          </span>
                        ))}
                      </div>

                      <div className="record-row">
                        <strong>Total: {formatMoney(sale.total)}</strong>
                        <span
                          className={
                            sale.paymentStatus === "Paid"
                              ? "status-pill paid-pill"
                              : "status-pill pending-pill"
                          }
                        >
                          {sale.paymentStatus}
                        </span>
                      </div>

                      <div className="record-row">
                        <span>Paid: {formatMoney(sale.amountPaid)}</span>
                        <strong
                          className={
                            sale.balance > 0 ? "balance-warning" : "balance-clear"
                          }
                        >
                          Balance: {formatMoney(sale.balance)}
                        </strong>
                      </div>

                      <p>
                        {sale.paymentMethod} • {sale.date} • {sale.type}
                      </p>

                      {sale.note && <p>{sale.note}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="sales-panel">
              <div className="sales-panel-head">
                <h2>Expenses & Incomings</h2>
                <p>Outgoing money and additional incoming money.</p>
              </div>

              <div className="sales-panel-content records-list">
                {expenses.map((expense) => (
                  <div className="record-card" key={expense.id}>
                    <div className="record-row">
                      <h3>{expense.title}</h3>
                      <button
                        className="delete-mini"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </div>

                    <p>{expense.category} • {expense.date}</p>
                    <strong className="negative">
                      - {formatMoney(expense.amount)}
                    </strong>
                    <p>{expense.note}</p>
                  </div>
                ))}

                {extraIncomes.map((income) => (
                  <div className="record-card" key={income.id}>
                    <div className="record-row">
                      <h3>{income.title}</h3>
                      <button
                        className="delete-mini"
                        onClick={() => deleteIncome(income.id)}
                      >
                        Delete
                      </button>
                    </div>

                    <p>{income.source} • {income.date}</p>
                    <strong className="positive">
                      + {formatMoney(income.amount)}
                    </strong>
                    <p>{income.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Receipt</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {allSalesRecords.map((sale) => (
                  <tr key={sale.id}>
                    <td>#{sale.id}</td>
                    <td>{sale.receiptNo}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.type}</td>
                    <td>{sale.date}</td>
                    <td>{sale.paymentMethod}</td>
                    <td>
                      <span
                        className={
                          sale.paymentStatus === "Paid"
                            ? "status-pill paid-pill"
                            : "status-pill pending-pill"
                        }
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td>{formatMoney(sale.total)}</td>
                    <td>{formatMoney(sale.amountPaid)}</td>
                    <td
                      className={
                        sale.balance > 0 ? "balance-warning" : "balance-clear"
                      }
                    >
                      {formatMoney(sale.balance)}
                    </td>
                  </tr>
                ))}

                {allSalesRecords.length === 0 && (
                  <tr>
                    <td colSpan="10">No sales report data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesReports;
