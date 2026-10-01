import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";

import heroImage from "../../assets/images/home-page4.png";
import feminineImage from "../../assets/images/chafadia-5.png";
import drinksImage from "../../assets/images/chafadia-3.png";
import botanicalsImage from "../../assets/images/chafadia-2.png";
import cripsImage from "../../assets/images/crips-co2.png";
import logo from "../../assets/images/chafadia-logo.png";

function CustomerDashboard() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { orders, markAsPaid } = useStore();

  const paymentAccounts = {
    mtn: { number: "652433338", name: "CHAFIOU HAMIDOU" },
    orange: { number: "688332699", name: "SADIYATOU SEMIRNYUY KIKA" },
    bank: {
      bankName: "FIRST BANK",
      branch: "BIYEM-ASSI CARREFOUR BRANCH",
      accountName: "SADIYATOU SEMIRNYUY KIKA",
      accountNumber: "00075-00000101158-93",
    },
  };

  const getStartPage = () => {
    const requested = location.state?.openPage || location.state?.openTab;
    const saved = localStorage.getItem("chafadiaCustomerPage");
    const cartRequest = localStorage.getItem("chafadiaCustomerDashboardTab");
    if (requested === "orders" || cartRequest === "orders") return "orders";
    if (["home", "orders", "receipts", "transactions", "support"].includes(requested)) return requested;
    if (["home", "orders", "receipts", "transactions", "support"].includes(saved)) return saved;
    return "home";
  };

  const [activePage, setActivePage] = useState(getStartPage);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [receiptView, setReceiptView] = useState("Premium");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    method: "MTN Mobile Money",
    amount: "",
    reference: "",
    senderName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    cardName: currentUser?.name || "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardType: "Visa",
    billingAddress: "",
    billingCity: "",
    billingCountry: "Cameroon",
    zipCode: "",
    deliveryType: "Pickup",
    deliveryAddress: "",
    note: "",
    proof: "",
    idCard: "",
  });

  useEffect(() => {
    localStorage.setItem("chafadiaCustomerPage", activePage);
    if (activePage !== "orders") localStorage.removeItem("chafadiaCustomerDashboardTab");
  }, [activePage]);

  const openPage = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => openPage("home");

  const myOrders = (orders || []).filter((order) => {
    const orderEmail = order.customer?.email || order.customerEmail;
    const orderPhone = order.customer?.phone || order.customerPhone;

    return (
      orderEmail === currentUser?.email ||
      orderPhone === currentUser?.phone ||
      order.customerName === currentUser?.name
    );
  });

  const categories = [
    { title: "Chafadia Enterprise Feminine Secrets", text: "Perfumes, body serums, lotions, gowns, hijabs, modest clothing, footwear and women essential care.", image: feminineImage, badge: "Beauty & Modesty" },
    { title: "Chafadia Enterprise Halal Drinks", text: "Natural juices, zobo, cocktails, yogurt drinks and healthy halal refreshments for families.", image: drinksImage, badge: "Fresh Halal Drinks" },
    { title: "Chafadia Enterprise Botanicals", text: "Herbal wellness, natural care and botanical solutions for daily wellbeing.", image: botanicalsImage, badge: "Natural Wellness" },
    { title: "Chafadia Enterprise Crips Co.", text: "Crispy banana, potato, beef and chicken chips for premium crunchy snacks.", image: cripsImage, badge: "Crunchy Snacks" },
  ];

  const paymentMethods = [
    { title: "MTN Mobile Money", value: "MTN Mobile Money", icon: "📱" },
    { title: "Orange Money", value: "Orange Money", icon: "🟧" },
    { title: "Bank Transfer", value: "Bank Transfer", icon: "🏦" },
    { title: "Bank Card", value: "Bank Card", icon: "💳" },
    { title: "Cash", value: "Cash", icon: "💵" },
  ];

  const formatMoney = (amount) => `${Number(amount || 0).toLocaleString()} FCFA`;
  const getItems = (order) => order.items || [];
  const getAmountPaid = (order) => order.paymentStatus === "Paid" ? Number(order.amountPaid || order.paidAmount || order.total || 0) : Number(order.amountPaid || order.paidAmount || 0);
  const getBalance = (order) => Math.max(0, Number(order.total || 0) - getAmountPaid(order));
  const getReceiptNo = (order) => order.receiptNo || `CHF-${order.id}`;
  const maskAccountNumber = (n) => n ? `${n.slice(0, 5)}-****-****-${n.slice(-3)}` : "";
  const getDeliveryFee = (type) => type === "Home Delivery" ? 1000 : type === "Express Delivery" ? 2000 : type === "Worldwide Delivery" ? 10000 : 0;

  const paidReceipts = myOrders.filter((order) => order.paymentStatus === "Paid");
  const pendingOrders = myOrders.filter((order) => order.paymentStatus !== "Paid");
  const totalPaid = paidReceipts.reduce((sum, order) => sum + getAmountPaid(order), 0);
  const totalBalance = myOrders.reduce((sum, order) => sum + getBalance(order), 0);
  const itemsBought = paidReceipts.reduce((sum, order) => sum + getItems(order).reduce((s, item) => s + Number(item.qty || 0), 0), 0);
  const transactions = myOrders.flatMap((order) => (order.paymentHistory || []).map((p) => ({ ...p, orderId: order.id, receiptNo: order.receiptNo })));

  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      const itemText = getItems(order).map((i) => `${i.name} ${i.qty} ${i.price}`).join(" ");
      const text = `${order.id} ${order.receiptNo || ""} ${order.status || ""} ${order.paymentStatus || ""} ${order.paymentMethod || ""} ${itemText}`.toLowerCase();
      const matchesSearch = text.includes(orderSearch.toLowerCase());
      const matchesFilter = orderFilter === "All" || order.paymentStatus === orderFilter || order.status === orderFilter || order.orderStatus === orderFilter;
      return matchesSearch && matchesFilter;
    });
  }, [myOrders, orderSearch, orderFilter]);

  const timelineSteps = ["Pending", "Processing", "Preparing", "On Delivery", "Delivered"];
  const getCurrentStepIndex = (order) => Math.max(0, timelineSteps.indexOf(order.status || order.orderStatus || "Pending"));
  const getStatusClass = (status) => {
    if (status === "Paid" || status === "Delivered") return "status-pill green";
    if (status === "Processing" || status === "Preparing") return "status-pill blue";
    if (status === "Cancelled" || status === "Failed") return "status-pill red";
    return "status-pill gold";
  };

  const openPaymentModal = (order, method = "MTN Mobile Money") => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setPaymentForm({
      method,
      amount: getBalance(order) || order.total || "",
      reference: "",
      senderName: currentUser?.name || "",
      phone: currentUser?.phone || "",
      cardName: currentUser?.name || "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardType: "Visa",
      billingAddress: "",
      billingCity: "",
      billingCountry: "Cameroon",
      zipCode: "",
      deliveryType: order.deliveryType || "Pickup",
      deliveryAddress: order.deliveryAddress || "",
      note: "",
      proof: "",
      idCard: "",
    });
  };

  const fileToBase64 = (file, fieldName) => {
    const reader = new FileReader();
    reader.onloadend = () => setPaymentForm((prev) => ({ ...prev, [fieldName]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Please upload an image or PDF file.");
      return;
    }
    fileToBase64(file, fieldName);
  };

  const submitPayment = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const amount = Number(paymentForm.amount || 0);
    const deliveryFee = getDeliveryFee(paymentForm.deliveryType);
    const payableAmount = getBalance(selectedOrder) + deliveryFee;

    if (amount <= 0) return alert("Please enter a valid payment amount.");
    if (amount > payableAmount) return alert("Payment amount cannot be more than the order balance plus delivery fee.");

    if (["MTN Mobile Money", "Orange Money", "Bank Transfer"].includes(paymentForm.method)) {
      if (!paymentForm.reference.trim()) return alert("Please enter your transaction reference.");
      if (!paymentForm.proof) return alert("Please upload payment proof or screenshot.");
    }

    if (paymentForm.method === "Bank Card") {
      if (!paymentForm.cardName || !paymentForm.cardNumber || !paymentForm.cardExpiry || !paymentForm.cardCvv || !paymentForm.billingAddress || !paymentForm.billingCity) {
        return alert("Please complete all card and billing details.");
      }
    }

    const previousPaid = getAmountPaid(selectedOrder);
    const newPaidAmount = previousPaid + amount;
    const newTotal = Number(selectedOrder.total || 0) + deliveryFee;
    const newBalance = Math.max(0, newTotal - newPaidAmount);
    const newPaymentStatus = newBalance <= 0 ? "Paid" : "Pending";

    const paymentRecord = {
      id: Date.now(),
      method: paymentForm.method,
      amount,
      reference: paymentForm.method === "Bank Card" ? `CARD-${Date.now().toString().slice(-6)}` : paymentForm.reference,
      senderName: paymentForm.senderName,
      phone: paymentForm.phone,
      note: paymentForm.note,
      proof: paymentForm.proof,
      idCard: paymentForm.idCard,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString(),
      status: newPaymentStatus === "Paid" ? "Completed" : "Part Payment",
    };

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = savedOrders.map((order) => order.id === selectedOrder.id ? {
      ...order,
      amountPaid: newPaidAmount,
      paidAmount: newPaidAmount,
      total: newTotal,
      deliveryFee,
      deliveryType: paymentForm.deliveryType,
      deliveryAddress: paymentForm.deliveryAddress,
      paymentMethod: paymentForm.method,
      paymentStatus: newPaymentStatus,
      status: newPaymentStatus === "Paid" ? "Processing" : "Pending",
      orderStatus: newPaymentStatus === "Paid" ? "Processing" : "Pending",
      paymentHistory: [paymentRecord, ...(order.paymentHistory || [])],
      lastPaymentReference: paymentRecord.reference,
      lastPaymentNote: paymentForm.note,
    } : order);

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    if (newPaymentStatus === "Paid" && markAsPaid) markAsPaid(selectedOrder.id);
    alert(newPaymentStatus === "Paid" ? "Payment completed. Your receipt has been issued." : `Payment saved. Remaining balance is ${formatMoney(newBalance)}.`);
    setShowPaymentModal(false);
    setSelectedOrder(null);
    window.location.reload();
  };

  const cancelPendingOrder = (id) => {
    if (!window.confirm("Cancel this pending order?")) return;
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = savedOrders.map((order) => order.id === id ? { ...order, status: "Cancelled", orderStatus: "Cancelled" } : order);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.location.reload();
  };

  const downloadInvoice = (order) => {
    const items = getItems(order).map((item) => `${item.name} | Qty: ${item.qty} | Unit: ${formatMoney(item.price)} | Total: ${formatMoney(Number(item.qty || 0) * Number(item.price || 0))}`).join("\n");
    const invoice = `CHAFADIA ENTERPRISE\nCUSTOMER ORDER INVOICE\n\nOrder ID: ${order.id}\nReceipt No: ${order.receiptNo || "Not issued yet"}\nCustomer: ${currentUser?.name || "Customer"}\nEmail: ${currentUser?.email || "N/A"}\nPhone: ${currentUser?.phone || "N/A"}\n\nITEMS\n${items || "No items available"}\n\nTotal: ${formatMoney(order.total)}\nAmount Paid: ${formatMoney(getAmountPaid(order))}\nBalance: ${formatMoney(getBalance(order))}\nPayment Status: ${order.paymentStatus || "Pending"}\nOrder Status: ${order.status || order.orderStatus || "Pending"}\n\nThank you for choosing Chafadia Enterprise.`;
    const blob = new Blob([invoice], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chafadia-order-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadReceiptAsImage = (order) => {
    const canvas = document.createElement("canvas");
    const width = 760;
    const height = 1080;
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    const items = getItems(order).slice(0, 5);
    const receiptNo = getReceiptNo(order);

    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const drawText = (text, x, y, size = 24, color = "#001f4d", weight = "700", align = "left") => {
      ctx.font = `${weight} ${size}px Segoe UI, Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(String(text || ""), x, y);
    };

    ctx.fillStyle = "#f6f8ff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    roundRect(35, 35, width - 70, height - 70, 34);
    ctx.fill();
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.stroke();

    const headerGradient = ctx.createLinearGradient(35, 35, width - 35, 245);
    headerGradient.addColorStop(0, "#004aad");
    headerGradient.addColorStop(1, "#001f4d");
    ctx.fillStyle = headerGradient;
    roundRect(35, 35, width - 70, 225, 34);
    ctx.fill();

    const logoImage = new Image();
    logoImage.crossOrigin = "anonymous";
    const finishDraw = () => {
      try {
        ctx.fillStyle = "#ffffff";
        roundRect(70, 68, 95, 95, 22);
        ctx.fill();
        ctx.drawImage(logoImage, 82, 80, 70, 70);
      } catch {
        ctx.fillStyle = "#ffffff";
        roundRect(70, 68, 95, 95, 22);
        ctx.fill();
        drawText("CE", 117, 128, 30, "#004aad", "950", "center");
      }

      drawText("CHAFADIA ENTERPRISE", 185, 105, 30, "#ffffff", "950");
      drawText("Beauty • Wellness • Fashion • Halal Drinks", 185, 138, 17, "#fff3c4", "800");
      drawText("OFFICIAL RECEIPT", 70, 220, 30, "#d4af37", "950");
      drawText(receiptNo, width - 70, 220, 18, "#ffffff", "850", "right");

      let y = 300;
      [["Customer", currentUser?.name || order.customerName || "Customer"], ["Order No.", `#${order.id}`], ["Date", order.date || new Date().toISOString().slice(0, 10)], ["Payment", order.paymentMethod || "Paid"]].forEach(([label, value]) => {
        drawText(label, 70, y, 18, "#667085", "800");
        drawText(value, width - 70, y, 18, "#001f4d", "900", "right");
        y += 40;
      });

      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(0,31,77,0.18)";
      ctx.beginPath();
      ctx.moveTo(70, y);
      ctx.lineTo(width - 70, y);
      ctx.stroke();
      ctx.setLineDash([]);
      y += 40;

      ctx.fillStyle = "#fff7d6";
      roundRect(70, y - 26, width - 140, 45, 14);
      ctx.fill();
      drawText("PURCHASE SUMMARY", width / 2, y + 4, 18, "#001f4d", "950", "center");
      y += 55;

      items.forEach((item) => {
        const total = Number(item.qty || 0) * Number(item.price || 0);
        drawText(item.name, 70, y, 20, "#001f4d", "900");
        drawText(formatMoney(total), width - 70, y, 20, "#001f4d", "950", "right");
        y += 26;
        drawText(`Qty ${item.qty} × ${formatMoney(item.price)}`, 70, y, 16, "#667085", "800");
        y += 30;
      });

      y += 35;
      ctx.fillStyle = "#fff9e6";
      roundRect(70, y - 25, width - 140, 145, 20);
      ctx.fill();
      [["Total", order.total], ["Paid", getAmountPaid(order)], ["Balance", getBalance(order)]].forEach(([label, value]) => {
        drawText(label, 95, y + 10, label === "Balance" ? 22 : 20, label === "Balance" ? "#001f4d" : "#667085", "950");
        drawText(formatMoney(value), width - 95, y + 10, label === "Balance" ? 22 : 20, label === "Balance" ? "#b8860b" : "#001f4d", "950", "right");
        y += 42;
      });

      y += 30;
      ctx.fillStyle = "#dcfce7";
      roundRect(width / 2 - 130, y - 28, 260, 50, 25);
      ctx.fill();
      drawText("✓ PAID & VERIFIED", width / 2, y + 4, 18, "#166534", "950", "center");
      y += 80;
      drawText("Thank you for shopping with Chafadia Enterprise.", width / 2, y, 18, "#667085", "750", "center");

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${receiptNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    logoImage.onload = finishDraw;
    logoImage.onerror = finishDraw;
    logoImage.src = logo;
  };

  const estimateDeliveryMessage = (order) => {
    const type = order.deliveryType || "Pickup";

    if (type === "Worldwide Delivery") {
      return "Worldwide delivery: 7 - 21 business days after payment confirmation.";
    }

    if (type === "Express Delivery") {
      return "Express delivery: usually within 24 - 48 hours after confirmation.";
    }

    if (type === "Home Delivery") {
      return "Home delivery: usually within 1 - 3 business days.";
    }

    return "Pickup order: collect after confirmation from Chafadia Enterprise.";
  };

  return (
    <>
      <Navbar />
      <div className="ce-customer-page">
        <style>{`
          .ce-customer-page{min-height:100vh;padding:28px;background:radial-gradient(circle at 8% 8%,rgba(212,175,55,.24),transparent 26%),radial-gradient(circle at 88% 14%,rgba(0,74,173,.16),transparent 28%),linear-gradient(135deg,#f6f8ff 0%,#fff 48%,#f6f8ff 100%)}
          .ce-container{max-width:1340px;margin:0 auto}.ce-hero{position:relative;overflow:hidden;min-height:460px;border-radius:46px;margin-bottom:24px;display:flex;align-items:center;padding:46px;background-image:linear-gradient(135deg,rgba(0,31,77,.88),rgba(0,74,173,.58),rgba(0,31,77,.78)),url(${heroImage});background-size:cover;background-position:center;box-shadow:0 36px 100px rgba(0,31,77,.28);border:1px solid rgba(212,175,55,.5)}
          .ce-hero:after{content:"";position:absolute;inset:18px;border-radius:36px;border:1px solid rgba(255,255,255,.18);pointer-events:none}.ce-hero-content{position:relative;z-index:2;max-width:860px}.ce-label{display:inline-flex;padding:9px 16px;border-radius:999px;margin-bottom:17px;background:rgba(212,175,55,.18);color:#fff7d6;border:1px solid rgba(212,175,55,.45);font-size:12px;font-weight:950;letter-spacing:.9px;text-transform:uppercase;backdrop-filter:blur(8px)}
          .ce-hero h1{color:#fff;font-size:clamp(38px,6vw,72px);line-height:1.02;font-weight:950;letter-spacing:-1.8px;margin-bottom:16px}.ce-hero h1 span{background:linear-gradient(135deg,#fff7d6,#d4af37,#b8860b);-webkit-background-clip:text;background-clip:text;color:transparent}.ce-hero p{color:rgba(255,255,255,.91);max-width:780px;line-height:1.82;font-weight:650;font-size:16px}
          .ce-buttons{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}.ce-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border-radius:999px;text-decoration:none;font-weight:950;transition:.3s ease;border:1px solid transparent;cursor:pointer}.ce-btn.blue{background:linear-gradient(135deg,#fff,#f8fbff);color:#001f4d;box-shadow:0 18px 40px rgba(0,0,0,.16)}.ce-btn.gold{background:linear-gradient(135deg,#fff7d6,#d4af37,#b8860b);color:#001f4d;box-shadow:0 18px 40px rgba(212,175,55,.24)}.ce-btn.outline{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.28);backdrop-filter:blur(8px)}.ce-btn:hover,.ce-action-btn:hover,.ce-download:hover,.ce-back:hover{transform:translateY(-3px);filter:brightness(1.04)}
          .ce-page-head{position:relative;overflow:hidden;margin-bottom:24px;border-radius:34px;padding:28px;background-image:linear-gradient(135deg,rgba(0,31,77,.92),rgba(0,74,173,.7),rgba(0,31,77,.84)),url(${heroImage});background-size:cover;background-position:center;border:1px solid rgba(212,175,55,.45);box-shadow:0 24px 70px rgba(0,31,77,.18)}.ce-page-head h1{color:#fff;font-size:clamp(30px,5vw,52px);font-weight:950;line-height:1.05;margin:12px 0 8px}.ce-page-head p{color:rgba(255,255,255,.9);max-width:720px;line-height:1.7;font-weight:700}.ce-back{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.25);border-radius:999px;background:rgba(255,255,255,.1);color:#fff;padding:11px 16px;font-weight:950;cursor:pointer;backdrop-filter:blur(8px);transition:.3s ease}.ce-back:hover{background:linear-gradient(135deg,#fff7d6,#d4af37);color:#001f4d}
          .ce-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,205px));justify-content:center;gap:14px;margin-bottom:28px}.ce-stat,.ce-nav,.ce-card,.ce-panel,.ce-transaction{background:rgba(255,255,255,.98);border:1px solid rgba(212,175,55,.2);box-shadow:0 16px 40px rgba(0,31,77,.09);transition:.3s ease}.ce-stat{position:relative;overflow:hidden;border-radius:25px;padding:17px}.ce-stat h3{color:#667085;font-size:11.5px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.ce-stat h2{color:#d4af37;font-size:25px;font-weight:950}.ce-stat:hover,.ce-nav:hover,.ce-card:hover,.ce-transaction:hover{transform:translateY(-5px);box-shadow:0 24px 55px rgba(0,31,77,.14)}
          .ce-nav-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:14px;margin-bottom:28px}.ce-nav{border-radius:24px;padding:18px;text-align:left;cursor:pointer;text-decoration:none;color:inherit}.ce-nav-icon{width:46px;height:46px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#004aad,#001f4d);color:#d4af37;font-size:23px;margin-bottom:12px}.ce-nav h3{color:#001f4d;font-size:16px;margin-bottom:6px;font-weight:950}.ce-nav p{color:#667085;line-height:1.5;font-size:12.5px;font-weight:700}
          .ce-heading{position:relative;isolation:isolate;overflow:hidden;width:min(760px,100%);margin:40px auto 24px;padding:4px;text-align:center;border-radius:32px;background:linear-gradient(135deg,rgba(212,175,55,.95),rgba(255,255,255,.78),rgba(0,74,173,.78));box-shadow:0 22px 62px rgba(0,31,77,.16)}
          .ce-heading-inner{position:relative;overflow:hidden;border-radius:28px;padding:24px 22px 23px;background:radial-gradient(circle at 15% 20%,rgba(212,175,55,.22),transparent 30%),radial-gradient(circle at 86% 18%,rgba(0,74,173,.16),transparent 32%),linear-gradient(135deg,#fff 0%,#f8fbff 48%,#fff 100%);border:1px solid rgba(255,255,255,.86)}
          .ce-heading-inner:before{content:"";position:absolute;left:-60px;top:-70px;width:150px;height:150px;border-radius:50%;background:rgba(212,175,55,.11);border:1px solid rgba(212,175,55,.22)}.ce-heading-inner:after{content:"";position:absolute;right:-70px;bottom:-75px;width:165px;height:165px;border-radius:50%;background:rgba(0,74,173,.06);border:1px solid rgba(0,74,173,.12)}.ce-heading-badge{position:relative;z-index:2;display:inline-flex;align-items:center;gap:8px;margin:0 auto 12px;padding:8px 15px;border-radius:999px;background:linear-gradient(135deg,#001f4d,#004aad);color:#fff7d6;border:1px solid rgba(212,175,55,.42);box-shadow:0 12px 27px rgba(0,31,77,.16);font-size:10.5px;font-weight:950;letter-spacing:1.2px;text-transform:uppercase}.ce-heading h2{position:relative;z-index:2;color:#001f4d;font-size:clamp(28px,4.2vw,44px);font-weight:1000;letter-spacing:-1px;line-height:1;margin:0;text-transform:uppercase}.ce-heading h2 span{display:inline-block;background:linear-gradient(135deg,#001f4d,#004aad,#001f4d);-webkit-background-clip:text;background-clip:text;color:transparent;border-bottom:4px solid #d4af37;border-radius:0 0 16px 16px;padding:0 8px 7px}.ce-heading p{position:relative;z-index:2;color:#4b5563;max-width:590px;margin:14px auto 0;line-height:1.65;font-weight:800;font-size:14px}.ce-heading p strong{color:#001f4d}.ce-heading-decor{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:11px;margin-top:15px}.ce-heading-decor span{width:8px;height:8px;border-radius:50%;background:#d4af37;box-shadow:0 0 0 6px rgba(212,175,55,.13)}.ce-heading-decor:before,.ce-heading-decor:after{content:"";width:min(130px,26vw);height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent)}.ce-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:16px}.ce-cat{position:relative;overflow:hidden;min-height:295px;border-radius:26px;background:#001f4d;box-shadow:0 18px 46px rgba(0,31,77,.13);border:1px solid rgba(212,175,55,.22);transition:.35s ease}.ce-cat img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:.45s ease}.ce-cat:hover img{transform:scale(1.06)}.ce-cat:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,31,77,.08),rgba(0,31,77,.72) 55%,rgba(0,31,77,.94))}.ce-cat-content{position:absolute;z-index:2;left:20px;right:20px;bottom:20px}.ce-cat-badge{display:inline-flex;padding:7px 12px;border-radius:999px;margin-bottom:11px;background:rgba(212,175,55,.18);color:#fff7d6;border:1px solid rgba(212,175,55,.42);font-size:11px;font-weight:950}.ce-cat h3{color:#fff;font-size:22px;line-height:1.2;margin-bottom:9px;font-weight:950}.ce-cat p{color:rgba(255,255,255,.83);font-size:13.5px;line-height:1.6;font-weight:650;margin-bottom:14px}.ce-cat a{display:inline-flex;text-decoration:none;color:#001f4d;background:linear-gradient(135deg,#fff7d6,#d4af37,#b8860b);padding:10px 15px;border-radius:999px;font-size:12px;font-weight:950}
          .ce-panel{border-radius:30px;overflow:hidden}.ce-panel-head{padding:22px;background:linear-gradient(135deg,rgba(0,74,173,.08),rgba(212,175,55,.13));border-bottom:1px solid rgba(0,74,173,.08)}.ce-panel-head h2{color:#001f4d;font-size:24px;margin-bottom:7px;font-weight:950}.ce-panel-head p{color:#667085;font-size:13.5px;line-height:1.6;font-weight:650}.ce-tools{display:grid;grid-template-columns:minmax(0,1.4fr) 220px;gap:14px;padding:20px}.ce-tools input,.ce-tools select,.ce-modal input,.ce-modal select,.ce-modal textarea{width:100%;padding:14px 16px;border-radius:18px;border:1px solid rgba(0,74,173,.14);background:#fff;color:#001f4d;font-weight:760;box-shadow:0 10px 25px rgba(0,31,77,.06);outline:none;transition:.28s ease}.ce-tools input:focus,.ce-tools select:focus,.ce-modal input:focus,.ce-modal select:focus,.ce-modal textarea:focus{border-color:#d4af37;box-shadow:0 0 0 4px rgba(212,175,55,.14)}
          .ce-orders{padding:0 20px 20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px}.ce-card{border-radius:24px;overflow:hidden}.ce-order-head{padding:18px;background:linear-gradient(135deg,rgba(0,74,173,.08),rgba(212,175,55,.13));display:flex;justify-content:space-between;gap:12px}.ce-order-head h3{color:#001f4d;font-size:18px;margin-bottom:4px}.ce-order-head p,.ce-order-body p{color:#667085;font-weight:700;font-size:12.5px;line-height:1.55}.ce-order-body{padding:18px}.ce-items,.ce-history{padding:12px;border-radius:18px;background:#f8fbff;border:1px solid rgba(0,74,173,.08);display:grid;gap:8px;margin-bottom:14px}.ce-line{display:flex;justify-content:space-between;gap:12px;padding-bottom:8px;border-bottom:1px dashed rgba(0,31,77,.12);color:#001f4d;font-size:13px;font-weight:850}.ce-line:last-child{border-bottom:none;padding-bottom:0}.ce-line span{color:#667085;font-weight:750}.ce-total strong{color:#b8860b;font-size:17px}.balance-due{color:#dc2626!important}.balance-clear{color:#16a34a!important}.status-pill{display:inline-flex;padding:7px 12px;border-radius:999px;font-size:11px;font-weight:950;height:fit-content;white-space:nowrap}.green{background:#dcfce7;color:#166534}.gold{background:#fff7d6;color:#92400e}.blue{background:#dbeafe;color:#1e3a8a}.red{background:#fee2e2;color:#991b1b}.ce-timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:15px 0}.ce-step{height:8px;border-radius:999px;background:#e5e7eb}.ce-step.active{background:linear-gradient(135deg,#004aad,#d4af37)}.ce-history h4{color:#001f4d;font-size:14px;margin-bottom:8px}.ce-history-item{color:#667085;font-size:12px;line-height:1.55;font-weight:700;padding:7px 0;border-bottom:1px dashed rgba(0,31,77,.12)}.ce-history-item:last-child{border-bottom:none}
          .ce-actions{display:grid;gap:11px;margin-top:14px}.ce-action-btn{width:100%;border:none;padding:14px 16px;border-radius:18px;cursor:pointer;font-weight:950;transition:.3s ease;text-align:left;display:flex;flex-direction:column;gap:4px;line-height:1.25;box-shadow:0 12px 28px rgba(0,31,77,.08)}.ce-action-btn span{font-size:11px;font-weight:750;opacity:.82}.primary{background:linear-gradient(135deg,#004aad,#001f4d);color:#fff}.success{background:linear-gradient(135deg,#ecfdf3,#dcfce7);color:#166534;border:1px solid rgba(22,101,52,.12)}.light{background:linear-gradient(135deg,#fff,#f8fbff);color:#001f4d;border:1px solid rgba(0,74,173,.1)}.danger{background:linear-gradient(135deg,#fff1f2,#fee2e2);color:#991b1b;border:1px solid rgba(153,27,27,.1)}
          .ce-receipts,.ce-transactions{padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,330px));justify-content:center;gap:18px}.ce-receipt-shell{display:grid;gap:12px}.ce-receipt{position:relative;overflow:hidden;width:310px;max-width:100%;margin:0 auto;border-radius:22px;background:#fff;border:1px solid rgba(212,175,55,.35);box-shadow:0 16px 38px rgba(0,31,77,.12)}.ce-receipt-head{padding:15px;background:radial-gradient(circle at top right,rgba(212,175,55,.32),transparent 38%),linear-gradient(135deg,#004aad,#001f4d);color:#fff}.ce-brand{display:flex;align-items:center;gap:10px}.ce-brand img{width:49px;height:49px;border-radius:16px;object-fit:contain;background:#fff;padding:4px;border:1px solid #d4af37;box-shadow:0 10px 20px rgba(0,0,0,.16)}.ce-brand h3{margin:0 0 3px;font-size:14px;color:#fff;line-height:1.2;font-weight:950}.ce-brand p{margin:0;font-size:8.8px;color:#fff3c4;line-height:1.35;font-weight:750}.ce-receipt-no{margin-top:13px;padding-top:10px;border-top:1px solid rgba(255,255,255,.18);display:flex;justify-content:space-between;gap:12px}.ce-receipt-no h2{color:#d4af37;font-size:18px;margin:0;letter-spacing:1px}.ce-receipt-body{padding:14px}.ce-receipt-line{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px dashed rgba(0,31,77,.14);font-size:10.5px}.ce-receipt-line span:first-child{color:#667085;font-weight:800}.ce-receipt-line span:last-child{color:#001f4d;font-weight:900;text-align:right}.ce-receipt-title{margin:10px 0 6px;padding:6px 9px;text-align:center;border-radius:10px;background:#fff7d6;color:#001f4d;border:1px solid rgba(212,175,55,.35);font-size:9.5px;font-weight:950;letter-spacing:.5px}.ce-receipt-item{display:grid;grid-template-columns:1fr auto;gap:10px;padding:6px 0;border-bottom:1px dashed rgba(0,31,77,.12)}.ce-receipt-item strong{color:#001f4d;font-size:10.5px}.ce-receipt-item small{color:#667085;font-weight:700;font-size:9px}.ce-receipt-summary{margin-top:10px;padding:10px;border-radius:14px;background:linear-gradient(135deg,#fff,#fff9e6);border:1px solid rgba(212,175,55,.35)}.ce-paid-stamp{width:fit-content;margin:10px auto 0;padding:7px 11px;border-radius:999px;background:#dcfce7;color:#166534;border:1px solid rgba(22,101,52,.18);font-size:9.5px;font-weight:950;letter-spacing:.8px}.ce-qr{width:55px;height:55px;margin:10px auto 7px;border:2px solid #d4af37;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#001f4d;font-size:7px;line-height:1.2;text-align:center;font-weight:950;background:#fff}.ce-receipt-footer{text-align:center;padding-top:7px;border-top:1px dashed rgba(0,31,77,.14);color:#667085;font-size:8.5px;line-height:1.45;font-weight:750}.ce-download{width:100%;border:none;padding:13px;border-radius:16px;cursor:pointer;font-weight:950;color:#001f4d;background:linear-gradient(135deg,#fff7d6,#d4af37,#b8860b);transition:.3s ease}.ce-transaction{padding:18px;border-radius:24px}.ce-transaction h3{color:#001f4d;font-size:16px;margin-bottom:8px;font-weight:950}.ce-transaction p{color:#667085;font-size:12.5px;line-height:1.65;font-weight:700}.ce-empty{padding:28px;text-align:center;color:#667085;font-weight:750}
          .ce-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,31,77,.66);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}.ce-modal{width:min(900px,100%);max-height:92vh;overflow-y:auto;background:#fff;border-radius:32px;border:1px solid rgba(212,175,55,.35);box-shadow:0 30px 90px rgba(0,31,77,.35)}.ce-modal-head{padding:24px;background:radial-gradient(circle at top right,rgba(212,175,55,.35),transparent 38%),linear-gradient(135deg,#004aad,#001f4d);color:#fff}.ce-modal-head h2{font-size:26px;margin-bottom:7px}.ce-modal-head p{color:#fff3c4;line-height:1.6;font-weight:700}.ce-modal-body{padding:22px}.ce-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}.ce-summary-card{padding:14px;border-radius:18px;background:#f8fbff;border:1px solid rgba(0,74,173,.08);text-align:center}.ce-summary-card span{display:block;color:#667085;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px}.ce-summary-card strong{color:#d4af37;font-size:18px}.ce-form{display:grid;gap:13px}.two-cols{display:grid;grid-template-columns:1fr 1fr;gap:13px}.three-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px}.ce-safe,.ce-card-safe{padding:15px;border-radius:18px;background:linear-gradient(135deg,#fff7d6,#fde68a);color:#001f4d;border:1px solid rgba(212,175,55,.32);line-height:1.65;font-weight:800}.ce-card-safe{background:linear-gradient(135deg,#ecfeff,#cffafe);color:#155e75;border:1px solid rgba(8,145,178,.18);font-size:12.5px}.ce-upload{padding:15px;border-radius:18px;background:#f8fbff;border:1.5px dashed rgba(0,74,173,.25);color:#001f4d;font-weight:900;cursor:pointer;text-align:center}.ce-upload input{display:none}.ce-upload-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.ce-upload-success{color:#166534;font-size:12px;font-weight:850;text-align:center}.ce-methods{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px}.ce-method{border:1px solid rgba(0,74,173,.12);background:#f8fbff;border-radius:18px;padding:13px 10px;cursor:pointer;color:#001f4d;display:grid;place-items:center;gap:6px;transition:.3s ease;font-weight:900;text-align:center}.ce-method.active{background:linear-gradient(135deg,#004aad,#001f4d);color:#fff;border-color:rgba(212,175,55,.45);box-shadow:0 16px 34px rgba(0,31,77,.18)}.ce-modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ce-submit,.ce-close{border:none;padding:14px;border-radius:17px;font-weight:950;cursor:pointer}.ce-submit{background:linear-gradient(135deg,#004aad,#001f4d);color:#fff}.ce-close{background:#fee2e2;color:#991b1b}
          @media(max-width:980px){.ce-hero{min-height:390px;padding:28px}.two-cols,.three-cols,.ce-summary,.ce-upload-grid{grid-template-columns:1fr}.ce-heading{padding:28px 18px;border-radius:30px}}@media(max-width:600px){.ce-customer-page{padding:14px}.ce-hero{border-radius:28px;padding:22px 16px;min-height:430px}.ce-buttons,.ce-actions,.ce-modal-actions{grid-template-columns:1fr;flex-direction:column}.ce-btn{width:100%}.ce-stats{grid-template-columns:repeat(2,1fr)}.ce-cats,.ce-orders,.ce-receipts,.ce-transactions,.ce-tools{grid-template-columns:1fr}}
        `}</style>

        <div className="ce-container">
          {activePage === "home" && (
            <>
              <section className="ce-hero">
                <div className="ce-hero-content">
                  <span className="ce-label">Chafadia Customer Happiness Center</span>
                  <h1>Welcome, <span>{currentUser?.name || "Customer"}</span></h1>
                  <p>A premium customer care center where shopping, orders, payments, receipts, transactions and delivery tracking are organized in a clean enterprise experience.</p>
                  <div className="ce-buttons">
                    <Link to="/products" className="ce-btn blue">Shop Products</Link>
                    <button type="button" className="ce-btn gold" onClick={() => openPage("orders")}>Make Payments & View Orders</button>
                    <button type="button" className="ce-btn outline" onClick={() => openPage("receipts")}>Download Receipts</button>
                  </div>
                </div>
              </section>

              <div className="ce-stats">
                <div className="ce-stat"><h3>Total Orders</h3><h2>{myOrders.length}</h2></div>
                <div className="ce-stat"><h3>Paid Receipts</h3><h2>{paidReceipts.length}</h2></div>
                <div className="ce-stat"><h3>Pending Payments</h3><h2>{pendingOrders.length}</h2></div>
                <div className="ce-stat"><h3>Total Paid</h3><h2>{formatMoney(totalPaid)}</h2></div>
                <div className="ce-stat"><h3>Balance</h3><h2>{formatMoney(totalBalance)}</h2></div>
                <div className="ce-stat"><h3>Items Bought</h3><h2>{itemsBought}</h2></div>
              </div>

              <div className="ce-nav-grid">
                <button className="ce-nav" onClick={() => openPage("orders")}><div className="ce-nav-icon">📦</div><h3>Orders & Payments</h3><p>View orders, pay balances, upload proof and track delivery.</p></button>
                <button className="ce-nav" onClick={() => openPage("receipts")}><div className="ce-nav-icon">🧾</div><h3>Receipts</h3><p>See only paid official receipts and download as image.</p></button>
                <button className="ce-nav" onClick={() => openPage("transactions")}><div className="ce-nav-icon">💳</div><h3>Transactions</h3><p>Review payment history, references and transaction status.</p></button>
                <Link to="/cart" className="ce-nav"><div className="ce-nav-icon">🛒</div><h3>My Cart</h3><p>Review selected products before moving to payment.</p></Link>
                <Link to="/products" className="ce-nav"><div className="ce-nav-icon">🛍️</div><h3>Shop Products</h3><p>Explore all Chafadia Enterprise product categories.</p></Link>
                <button className="ce-nav" onClick={() => openPage("support")}><div className="ce-nav-icon">💬</div><h3>Customer Support</h3><p>Get help with orders, payments, delivery and inquiries.</p></button>
              </div>

              <div className="ce-heading">
                <div className="ce-heading-inner">
                  <span className="ce-heading-badge">✦ Premium Collection ✦</span>
                  <h2>Our <span>Products</span></h2>
                  <p>
                    Explore premium <strong>CHAFADIA ENTERPRISE</strong> products for
                    beauty, modest fashion, wellness, hygiene, halal drinks,
                    crispy chips, botanicals and family essentials.
                  </p>
                  <div className="ce-heading-decor"><span></span></div>
                </div>
              </div>
              <div className="ce-cats">
                {categories.map((category, index) => (
                  <div className="ce-cat" key={index}>
                    <img src={category.image} alt={category.title} />
                    <div className="ce-cat-content">
                      <span className="ce-cat-badge">{category.badge}</span>
                      <h3>{category.title}</h3>
                      <p>{category.text}</p>
                      <Link to="/products">Explore Products</Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activePage === "orders" && (
            <>
              <section className="ce-page-head"><button className="ce-back" onClick={goHome}>← Back to Customer Home</button><h1>Orders & Payments</h1><p>This page is dedicated only to your orders, balances, payment submission, proof upload, delivery status and invoices.</p></section>
              <div className="ce-panel">
                <div className="ce-panel-head"><h2>Make Payments & View Orders</h2><p>View orders, check balance, pay fully or partially, upload proof, upload ID card, download invoice and follow order progress.</p></div>
                <div className="ce-tools"><input type="search" placeholder="Search by order, receipt, item, payment or status..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} /><select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}><option value="All">All Orders</option><option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Preparing">Preparing</option><option value="On Delivery">On Delivery</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option></select></div>
                {filteredOrders.length === 0 ? <div className="ce-empty">You do not have any order yet.</div> : <div className="ce-orders">
                  {filteredOrders.map((order) => {
                    const items = getItems(order); const balance = getBalance(order); const currentStep = getCurrentStepIndex(order);
                    return <div className="ce-card" key={order.id}>
                      <div className="ce-order-head"><div><h3>Order #{order.id}</h3><p>Receipt: {order.receiptNo || "Not issued yet"}</p><p>Date: {order.date || "N/A"}</p></div><span className={getStatusClass(order.paymentStatus)}>{order.paymentStatus || "Pending"}</span></div>
                      <div className="ce-order-body">
                        <div className="ce-items">{items.length === 0 ? <p>No items available.</p> : items.map((item, i) => <div className="ce-line" key={i}><b>{item.name} × {item.qty}</b><strong>{formatMoney(Number(item.qty || 0) * Number(item.price || 0))}</strong></div>)}</div>
                        <div className="ce-items">
                          <div className="ce-line ce-total"><span>Total</span><strong>{formatMoney(order.total)}</strong></div>
                          <div className="ce-line"><span>Amount Paid</span><strong>{formatMoney(getAmountPaid(order))}</strong></div>
                          <div className="ce-line"><span>Balance</span><strong className={balance > 0 ? "balance-due" : "balance-clear"}>{formatMoney(balance)}</strong></div>
                          <div className="ce-line"><span>Payment Method</span><strong>{order.paymentMethod || "N/A"}</strong></div>
                          <div className="ce-line"><span>Order Status</span><strong>{order.status || order.orderStatus || "Pending"}</strong></div>
                        </div>
                        <div className="ce-timeline">{timelineSteps.map((step, i) => <div key={step} title={step} className={i <= currentStep ? "ce-step active" : "ce-step"} />)}</div>
                        {order.paymentHistory?.length > 0 && <div className="ce-history"><h4>Payment History</h4>{order.paymentHistory.map((payment) => <div className="ce-history-item" key={payment.id}><strong>{payment.method}</strong> — {formatMoney(payment.amount)}<br />Ref: {payment.reference || payment.transactionReference || "N/A"}<br />{payment.date} • {payment.time} • {payment.status}</div>)}</div>}
                        <div className="ce-actions">
                          {balance > 0 ? <button className="ce-action-btn primary" onClick={() => openPaymentModal(order)}>Continue Payment<span>Complete or part-pay this order securely</span></button> : <button className="ce-action-btn success" onClick={() => openPage("receipts")}>View Official Receipt<span>Receipt is ready for download</span></button>}
                          <button className="ce-action-btn light" onClick={() => downloadInvoice(order)}>Download Invoice<span>Save order details before payment</span></button>
                          {(order.status || order.orderStatus) !== "Cancelled" && order.paymentStatus !== "Paid" && <button className="ce-action-btn danger" onClick={() => cancelPendingOrder(order.id)}>Cancel Order<span>Only available before full payment</span></button>}
                        </div>
                      </div>
                    </div>;
                  })}
                </div>}
              </div>
            </>
          )}

          {activePage === "receipts" && (
            <>
              <section className="ce-page-head"><button className="ce-back" onClick={goHome}>← Back to Customer Home</button><h1>Paid Receipts</h1><p>This page contains only official receipts issued for fully paid orders. You can download every receipt as a PNG image.</p></section>
              <div className="ce-panel"><div className="ce-panel-head"><h2>My Paid Receipts</h2><p>Only receipts issued for already-paid orders appear here.</p></div>{paidReceipts.length === 0 ? <div className="ce-empty">No paid receipt available yet.</div> : <div className="ce-receipts">{paidReceipts.map((order) => {
                const items = getItems(order);
                return <div className="ce-receipt-shell" key={order.id}><div className="ce-receipt"><div className="ce-receipt-head"><div className="ce-brand"><img src={logo} alt="Chafadia Enterprise" /><div><h3>CHAFADIA ENTERPRISE</h3><p>Beauty • Wellness • Fashion • Halal Drinks</p><p>Nkolmesseng, Yaoundé - Cameroon</p></div></div><div className="ce-receipt-no"><div><h2>RECEIPT</h2><span>{getReceiptNo(order)}</span></div><span>Order #{order.id}<br />{order.date || new Date().toISOString().slice(0, 10)}</span></div></div><div className="ce-receipt-body"><div className="ce-receipt-line"><span>Customer</span><span>{currentUser?.name || order.customerName || "Customer"}</span></div><div className="ce-receipt-line"><span>Payment</span><span>{order.paymentMethod || "N/A"}</span></div><div className="ce-receipt-line"><span>Status</span><span>Paid & Verified</span></div><div className="ce-receipt-title">PURCHASE SUMMARY</div>{items.slice(0, 3).map((item, i) => <div className="ce-receipt-item" key={i}><div><strong>{item.name}</strong><br /><small>Qty {item.qty} × {formatMoney(item.price)}</small></div><strong>{formatMoney(Number(item.qty || 0) * Number(item.price || 0))}</strong></div>)}{items.length > 3 && <div className="ce-receipt-item"><div><strong>Other items</strong><br /><small>{items.length - 3} more product(s)</small></div><strong>Included</strong></div>}<div className="ce-receipt-summary"><div className="ce-receipt-line"><span>Total</span><strong>{formatMoney(order.total)}</strong></div><div className="ce-receipt-line"><span>Paid</span><strong>{formatMoney(getAmountPaid(order))}</strong></div><div className="ce-receipt-line"><span>Balance</span><strong>{formatMoney(getBalance(order))}</strong></div></div><div className="ce-paid-stamp">✓ PAID & VERIFIED</div><div className="ce-qr">QR<br />VERIFY<br />{getReceiptNo(order)}</div><div className="ce-receipt-footer">Thank you for shopping with Chafadia Enterprise.<br />This receipt was issued from your paid order.</div></div></div><button className="ce-download" onClick={() => downloadReceiptAsImage(order)}>Download Receipt Image</button></div>;
              })}</div>}</div>
            </>
          )}

          {activePage === "transactions" && (
            <>
              <section className="ce-page-head"><button className="ce-back" onClick={goHome}>← Back to Customer Home</button><h1>Transactions</h1><p>This page shows your payment records only: amount paid, method, reference, order number and payment status.</p></section>
              <div className="ce-panel"><div className="ce-panel-head"><h2>Payment History</h2><p>All recorded customer payment attempts and confirmations.</p></div>{transactions.length === 0 ? <div className="ce-empty">No transaction available yet.</div> : <div className="ce-transactions">{transactions.map((t) => <div className="ce-transaction" key={t.id}><h3>{t.method}</h3><p><strong>Order:</strong> #{t.orderId}</p><p><strong>Receipt:</strong> {t.receiptNo || "N/A"}</p><p><strong>Amount:</strong> {formatMoney(t.amount)}</p><p><strong>Reference:</strong> {t.reference || "N/A"}</p><p><strong>Status:</strong> {t.status}</p><p><strong>Date:</strong> {t.date} • {t.time}</p></div>)}</div>}</div>
            </>
          )}

          {activePage === "support" && (
            <>
              <section className="ce-page-head"><button className="ce-back" onClick={goHome}>← Back to Customer Home</button><h1>Customer Support</h1><p>This page is dedicated to customer care, order help, payment confirmation, delivery support and business inquiries.</p></section>
              <div className="ce-nav-grid"><a href="tel:+237652433338" className="ce-nav"><div className="ce-nav-icon">📱</div><h3>MTN Support</h3><p>Call Chafadia customer support for order assistance.</p></a><a href="tel:+237688332699" className="ce-nav"><div className="ce-nav-icon">🟧</div><h3>Orange Support</h3><p>Use this line for payment and delivery support.</p></a><a href="mailto:chafadiaenterprise@gmail.com" className="ce-nav"><div className="ce-nav-icon">✉️</div><h3>Email Support</h3><p>Send a professional support or business inquiry.</p></a><Link to="/contact" className="ce-nav"><div className="ce-nav-icon">💬</div><h3>Contact Page</h3><p>Open the full Chafadia Enterprise contact page.</p></Link></div>
            </>
          )}
        </div>

        {showPaymentModal && selectedOrder && (
          <div className="ce-modal-overlay"><div className="ce-modal"><div className="ce-modal-head"><h2>Secure Enterprise Payment</h2><p>Select one payment method and follow the guided steps. Payment details appear only inside this secure checkout window.</p></div><div className="ce-modal-body"><div className="ce-summary"><div className="ce-summary-card"><span>Total</span><strong>{formatMoney(selectedOrder.total)}</strong></div><div className="ce-summary-card"><span>Paid</span><strong>{formatMoney(getAmountPaid(selectedOrder))}</strong></div><div className="ce-summary-card"><span>Balance</span><strong>{formatMoney(getBalance(selectedOrder))}</strong></div></div><form className="ce-form" onSubmit={submitPayment}>
            <div className="ce-methods">{paymentMethods.map((m) => <button type="button" key={m.value} className={paymentForm.method === m.value ? "ce-method active" : "ce-method"} onClick={() => setPaymentForm({ ...paymentForm, method: m.value })}><span>{m.icon}</span><strong>{m.title}</strong></button>)}</div>
            <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>{paymentMethods.map((m) => <option key={m.value} value={m.value}>{m.title}</option>)}</select>
            <div className="two-cols"><input type="number" placeholder="Amount to pay" required value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} /><select value={paymentForm.deliveryType} onChange={(e) => setPaymentForm({ ...paymentForm, deliveryType: e.target.value })}><option value="Pickup">Pickup - 0 FCFA</option><option value="Home Delivery">Home Delivery - 1,000 FCFA</option><option value="Express Delivery">Express Delivery - 2,000 FCFA</option><option value="Worldwide Delivery">Worldwide Delivery - 10,000 FCFA</option></select></div>
            {paymentForm.deliveryType !== "Pickup" && <input placeholder="Delivery address" value={paymentForm.deliveryAddress} onChange={(e) => setPaymentForm({ ...paymentForm, deliveryAddress: e.target.value })} />}
            {paymentForm.method === "MTN Mobile Money" && <><div className="ce-safe"><strong>MTN Mobile Money Payment</strong><br />Send to: {paymentAccounts.mtn.name}<br />Number: {paymentAccounts.mtn.number}</div><div className="two-cols"><input placeholder="Sender MTN number" value={paymentForm.phone} onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })} /><input placeholder="MTN transaction ID / Reference" value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} /></div></>}
            {paymentForm.method === "Orange Money" && <><div className="ce-safe"><strong>Orange Money Payment</strong><br />Send to: {paymentAccounts.orange.name}<br />Number: {paymentAccounts.orange.number}</div><div className="two-cols"><input placeholder="Sender Orange number" value={paymentForm.phone} onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })} /><input placeholder="Orange transaction ID / Reference" value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} /></div></>}
            {paymentForm.method === "Bank Transfer" && <><div className="ce-safe"><strong>Secure Bank Transfer</strong><br />Beneficiary: {paymentAccounts.bank.accountName}<br />Bank: {paymentAccounts.bank.bankName}<br />Branch: {paymentAccounts.bank.branch}<br />Account: {maskAccountNumber(paymentAccounts.bank.accountNumber)}<br />The full account number is protected.</div><div className="two-cols"><input placeholder="Bank transfer reference" value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} /><input placeholder="Sender name" value={paymentForm.senderName} onChange={(e) => setPaymentForm({ ...paymentForm, senderName: e.target.value })} /></div></>}
            {paymentForm.method === "Bank Card" && <><div className="ce-card-safe">Card payment form includes holder name, card number, expiry date, CVV, card type and billing address details. In production, connect this form to a real payment gateway.</div><div className="two-cols"><input placeholder="Cardholder full name" value={paymentForm.cardName} onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })} /><select value={paymentForm.cardType} onChange={(e) => setPaymentForm({ ...paymentForm, cardType: e.target.value })}><option value="Visa">Visa</option><option value="Mastercard">Mastercard</option><option value="Verve">Verve</option><option value="UnionPay">UnionPay</option></select></div><input placeholder="Card number" inputMode="numeric" value={paymentForm.cardNumber} onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} /><div className="three-cols"><input placeholder="Expiry MM/YY" value={paymentForm.cardExpiry} onChange={(e) => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })} /><input placeholder="CVV" type="password" value={paymentForm.cardCvv} onChange={(e) => setPaymentForm({ ...paymentForm, cardCvv: e.target.value })} /><input placeholder="ZIP / Postal Code" value={paymentForm.zipCode} onChange={(e) => setPaymentForm({ ...paymentForm, zipCode: e.target.value })} /></div><input placeholder="Billing address" value={paymentForm.billingAddress} onChange={(e) => setPaymentForm({ ...paymentForm, billingAddress: e.target.value })} /><div className="two-cols"><input placeholder="Billing city" value={paymentForm.billingCity} onChange={(e) => setPaymentForm({ ...paymentForm, billingCity: e.target.value })} /><input placeholder="Billing country" value={paymentForm.billingCountry} onChange={(e) => setPaymentForm({ ...paymentForm, billingCountry: e.target.value })} /></div></>}
            {paymentForm.method === "Cash" && <div className="ce-safe">Cash payment selected. Your order remains pending until Chafadia Enterprise confirms the cash payment.</div>}
            <div className="ce-upload-grid"><label className="ce-upload">Upload Payment Proof / Screenshot<input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, "proof")} /></label><label className="ce-upload">Upload ID Card<input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, "idCard")} /></label></div>
            {paymentForm.proof && <div className="ce-upload-success">Payment proof uploaded successfully.</div>}{paymentForm.idCard && <div className="ce-upload-success">ID card uploaded successfully.</div>}
            <textarea placeholder="Payment note or clarification" value={paymentForm.note} onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })} />
            <div className="ce-modal-actions"><button type="submit" className="ce-submit">Submit Payment</button><button type="button" className="ce-close" onClick={() => setShowPaymentModal(false)}>Cancel</button></div>
          </form></div></div></div>
        )}
      </div>
    </>
  );
}

export default CustomerDashboard;
