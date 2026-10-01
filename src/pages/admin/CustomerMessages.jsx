import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

function CustomerMessages() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Aisha Bello",
      email: "aisha@gmail.com",
      phone: "+237 650 000 000",
      subject: "Order delivery question",
      message:
        "Hello Chafadia Enterprise, please I want to know when my juice and banana chips order will be delivered.",
      category: "Order",
      status: "Unread",
      priority: "High",
      date: "2026-06-16",
      reply: "",
    },
    {
      id: 2,
      name: "Fatima Sadiq",
      email: "fatima@gmail.com",
      phone: "+237 690 000 000",
      subject: "Product inquiry",
      message:
        "Please do you have skincare products for sensitive skin and body lotion for family use?",
      category: "Product",
      status: "Read",
      priority: "Normal",
      date: "2026-06-15",
      reply: "",
    },
    {
      id: 3,
      name: "Mariam N.",
      email: "mariam@gmail.com",
      phone: "+237 670 000 000",
      subject: "Payment confirmation",
      message:
        "I paid through MTN Mobile Money. Please confirm if my payment has been received.",
      category: "Payment",
      status: "Replied",
      priority: "High",
      date: "2026-06-14",
      reply:
        "Hello Mariam, thank you for contacting Chafadia Enterprise. Your payment has been received and your order is being processed.",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filteredMessages = useMemo(() => {
    return messages.filter((item) => {
      const text =
        `${item.name} ${item.email} ${item.phone} ${item.subject} ${item.message} ${item.category} ${item.status} ${item.priority}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        item.status === filter ||
        item.category === filter ||
        item.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((item) => item.status === "Unread").length;
  const readMessages = messages.filter((item) => item.status === "Read").length;
  const repliedMessages = messages.filter((item) => item.status === "Replied").length;
  const resolvedMessages = messages.filter((item) => item.status === "Resolved").length;
  const highPriority = messages.filter((item) => item.priority === "High").length;

  const openMessage = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || "");

    if (message.status === "Unread") {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id ? { ...item, status: "Read" } : item
        )
      );

      setSelectedMessage({
        ...message,
        status: "Read",
      });
    }
  };

  const sendReply = () => {
    if (!selectedMessage) return;

    if (!replyText.trim()) {
      alert("Please write a reply before saving.");
      return;
    }

    setMessages((prev) =>
      prev.map((item) =>
        item.id === selectedMessage.id
          ? { ...item, reply: replyText, status: "Replied" }
          : item
      )
    );

    setSelectedMessage((prev) => ({
      ...prev,
      reply: replyText,
      status: "Replied",
    }));

    alert("Reply saved successfully.");
  };

  const markAsUnread = (id) => {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Unread" } : item
      )
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => ({
        ...prev,
        status: "Unread",
      }));
    }
  };

  const markAsResolved = (id) => {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Resolved" } : item
      )
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => ({
        ...prev,
        status: "Resolved",
      }));
    }
  };

  const deleteMessage = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    setMessages((prev) => prev.filter((item) => item.id !== id));

    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
      setReplyText("");
    }
  };

  const statusClass = (status) => {
    if (status === "Unread") return "status-badge status-unread";
    if (status === "Read") return "status-badge status-read";
    if (status === "Replied") return "status-badge status-replied";
    if (status === "Resolved") return "status-badge status-resolved";
    return "status-badge status-read";
  };

  const priorityClass = (priority) => {
    if (priority === "High") return "priority-badge priority-high";
    if (priority === "Normal") return "priority-badge priority-normal";
    return "priority-badge priority-low";
  };

  const categoryClass = (category) => {
    if (category === "Order") return "category-badge category-order";
    if (category === "Product") return "category-badge category-product";
    if (category === "Payment") return "category-badge category-payment";
    return "category-badge category-general";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Navbar />

      <div className="messages-page">
        <style>{`
          .messages-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.26), transparent 25%),
              radial-gradient(circle at 86% 11%, rgba(0, 74, 173, 0.18), transparent 27%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.13), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 45%, #f6f8ff 100%);
          }

          .messages-container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .messages-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 28px;
            padding: 36px;
            border-radius: 38px;
            margin-bottom: 24px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.9));
            border: 1px solid rgba(212, 175, 55, 0.38);
            box-shadow:
              0 30px 80px rgba(0, 31, 77, 0.15),
              inset 0 1px 0 rgba(255,255,255,0.95);
          }

          .messages-hero::before {
            content: "";
            position: absolute;
            width: 310px;
            height: 310px;
            right: -130px;
            top: -140px;
            border-radius: 50%;
            background:
              radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .messages-hero::after {
            content: "";
            position: absolute;
            width: 160px;
            height: 160px;
            left: -70px;
            bottom: -75px;
            border-radius: 50%;
            background:
              radial-gradient(circle, rgba(0,74,173,0.22), transparent 70%);
          }

          .messages-hero-content {
            position: relative;
            z-index: 2;
          }

          .hero-label {
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
            box-shadow: 0 10px 25px rgba(212, 175, 55, 0.12);
          }

          .messages-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .messages-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .messages-hero p {
            color: #667085;
            max-width: 760px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .messages-badge {
            position: relative;
            z-index: 2;
            min-width: 152px;
            min-height: 152px;
            border-radius: 38px;
            background:
              linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 24px 55px rgba(0,31,77,0.24),
              inset 0 1px 0 rgba(255,255,255,0.22);
            border: 1px solid rgba(255,255,255,0.25);
          }

          .messages-badge strong {
            font-size: 44px;
            color: #d4af37;
            line-height: 1;
          }

          .messages-badge span {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .messages-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(148px, 185px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .message-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .message-stat-card::after {
            content: "";
            position: absolute;
            width: 85px;
            height: 85px;
            right: -38px;
            top: -38px;
            border-radius: 50%;
            background: rgba(212,175,55,0.18);
          }

          .message-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .message-stat-card h3 {
            color: #667085;
            font-size: 11.2px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .message-stat-card h2 {
            color: #d4af37;
            font-size: 26px;
            font-weight: 950;
          }

          .messages-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 230px;
            gap: 14px;
            margin-bottom: 22px;
          }

          .messages-tools input,
          .messages-tools select {
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

          .messages-tools input:focus,
          .messages-tools select:focus,
          .reply-box textarea:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .messages-layout {
            display: grid;
            grid-template-columns: minmax(0, 0.92fr) minmax(370px, 1.08fr);
            gap: 21px;
            align-items: start;
          }

          .messages-list {
            display: grid;
            gap: 14px;
          }

          .message-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.985);
            border-radius: 26px;
            border: 1px solid rgba(212,175,55,0.17);
            box-shadow: 0 15px 36px rgba(0,31,77,0.085);
            padding: 18px;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .message-card::before {
            content: "";
            position: absolute;
            left: 0;
            top: 18px;
            bottom: 18px;
            width: 5px;
            border-radius: 0 999px 999px 0;
            background: linear-gradient(180deg, #004aad, #d4af37);
            opacity: 0.7;
          }

          .message-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.14);
          }

          .message-card.active {
            border-color: rgba(212,175,55,0.6);
            box-shadow:
              0 24px 60px rgba(212,175,55,0.2),
              0 10px 25px rgba(0,31,77,0.06);
            transform: translateY(-2px);
          }

          .message-top {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 13px;
          }

          .customer-line {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .avatar {
            width: 46px;
            height: 46px;
            border-radius: 17px;
            flex-shrink: 0;
            background:
              linear-gradient(135deg, #004aad, #001f4d);
            color: #d4af37;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
            box-shadow: 0 12px 23px rgba(0,31,77,0.18);
            border: 1px solid rgba(212,175,55,0.22);
          }

          .message-top h3 {
            color: #001f4d;
            font-size: 17px;
            margin-bottom: 4px;
          }

          .message-top p,
          .message-meta {
            color: #667085;
            font-size: 12.8px;
            line-height: 1.45;
          }

          .message-subject {
            color: #001f4d;
            font-weight: 950;
            margin-bottom: 7px;
            font-size: 15px;
          }

          .message-preview {
            color: #667085;
            font-size: 13.5px;
            line-height: 1.65;
          }

          .message-tags {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
          }

          .status-badge,
          .priority-badge,
          .category-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 0.2px;
            border: 1px solid transparent;
            box-shadow: 0 8px 16px rgba(0,31,77,0.055);
          }

          .status-badge::before,
          .priority-badge::before,
          .category-badge::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .status-unread {
            background: linear-gradient(135deg, #fff1f2, #fee2e2);
            color: #991b1b;
            border-color: rgba(153,27,27,0.13);
          }

          .status-unread::before {
            background: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.12);
          }

          .status-read {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #1e3a8a;
            border-color: rgba(30,58,138,0.12);
          }

          .status-read::before {
            background: #2563eb;
            box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          }

          .status-replied {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            border-color: rgba(22,101,52,0.12);
          }

          .status-replied::before {
            background: #16a34a;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
          }

          .status-resolved {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            color: #065f46;
            border-color: rgba(6,95,70,0.12);
          }

          .status-resolved::before {
            background: #059669;
            box-shadow: 0 0 0 4px rgba(5,150,105,0.12);
          }

          .priority-high {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
            border-color: rgba(146,64,14,0.12);
          }

          .priority-high::before {
            background: #d97706;
          }

          .priority-normal {
            background: linear-gradient(135deg, #e0f2fe, #bae6fd);
            color: #075985;
            border-color: rgba(7,89,133,0.12);
          }

          .priority-normal::before {
            background: #0284c7;
          }

          .priority-low {
            background: linear-gradient(135deg, #f9fafb, #f3f4f6);
            color: #374151;
            border-color: rgba(55,65,81,0.12);
          }

          .priority-low::before {
            background: #6b7280;
          }

          .category-order {
            background: linear-gradient(135deg, #eef2ff, #e0e7ff);
            color: #3730a3;
          }

          .category-order::before {
            background: #4f46e5;
          }

          .category-product {
            background: linear-gradient(135deg, #fdf2f8, #fce7f3);
            color: #9d174d;
          }

          .category-product::before {
            background: #db2777;
          }

          .category-payment {
            background: linear-gradient(135deg, #ecfeff, #cffafe);
            color: #155e75;
          }

          .category-payment::before {
            background: #0891b2;
          }

          .category-general {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            color: #334155;
          }

          .category-general::before {
            background: #64748b;
          }

          .message-details {
            position: sticky;
            top: 95px;
            overflow: hidden;
            background: rgba(255,255,255,0.99);
            border-radius: 30px;
            border: 1px solid rgba(212,175,55,0.24);
            box-shadow: 0 22px 58px rgba(0,31,77,0.13);
          }

          .details-header {
            padding: 23px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .message-details h2 {
            color: #001f4d;
            margin-bottom: 9px;
            font-size: 25px;
            line-height: 1.25;
          }

          .details-status-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 13px;
          }

          .details-body {
            padding: 23px;
          }

          .details-info {
            display: grid;
            gap: 9px;
            margin-bottom: 18px;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            padding: 10px 0;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
            color: #001f4d;
            font-weight: 850;
          }

          .info-row span {
            color: #667085;
            font-weight: 700;
          }

          .full-message {
            margin: 18px 0;
            padding: 17px;
            border-radius: 22px;
            background:
              linear-gradient(135deg, #f8fbff, #ffffff);
            color: #001f4d;
            line-height: 1.75;
            border: 1px solid rgba(0,74,173,0.08);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
          }

          .reply-box textarea {
            width: 100%;
            min-height: 135px;
            padding: 15px;
            border-radius: 22px;
            border: 1px solid rgba(0,74,173,0.14);
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
            color: #001f4d;
            background: #fff;
            outline: none;
            transition: 0.28s ease;
          }

          .reply-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 12px;
          }

          .reply-actions button,
          .message-mini-actions button {
            padding: 12px;
            border-radius: 16px;
            border: none;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .primary-btn {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
          }

          .gold-btn {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .danger-btn {
            background: #dc2626;
            color: #fff;
          }

          .reply-actions button:hover,
          .message-mini-actions button:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .message-mini-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 14px;
          }

          .empty-messages,
          .empty-details {
            background: rgba(255,255,255,0.99);
            border-radius: 26px;
            padding: 35px;
            color: #667085;
            text-align: center;
            font-weight: 750;
            box-shadow: 0 16px 42px rgba(0,31,77,0.09);
            border: 1px solid rgba(212,175,55,0.18);
          }

          @media (max-width: 980px) {
            .messages-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .messages-badge {
              min-width: 120px;
              min-height: 95px;
              border-radius: 24px;
            }

            .messages-badge strong {
              font-size: 34px;
            }

            .messages-tools {
              grid-template-columns: 1fr;
            }

            .messages-layout {
              grid-template-columns: 1fr;
            }

            .message-details {
              position: static;
            }
          }

          @media (max-width: 600px) {
            .messages-page {
              padding: 14px;
            }

            .messages-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .messages-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .message-stat-card {
              padding: 14px;
              border-radius: 19px;
            }

            .message-stat-card h2 {
              font-size: 22px;
            }

            .message-top {
              flex-direction: column;
            }

            .reply-actions,
            .message-mini-actions {
              grid-template-columns: 1fr;
            }

            .details-header,
            .details-body {
              padding: 17px;
            }
          }
        `}</style>

        <div className="messages-container">
          <div className="messages-hero">
            <div className="messages-hero-content">
              <span className="hero-label">Admin Communication Center</span>

              <h1>
                Customer <span>Messages</span>
              </h1>

              <p>
                Read customer questions, payment confirmations, product inquiries
                and complaints. Reply, resolve, prioritize and manage customer
                communication professionally.
              </p>
            </div>

            <div className="messages-badge">
              <strong>{totalMessages}</strong>
              <span>Messages</span>
            </div>
          </div>

          <div className="messages-stats">
            <div className="message-stat-card">
              <h3>Total Messages</h3>
              <h2>{totalMessages}</h2>
            </div>

            <div className="message-stat-card">
              <h3>Unread</h3>
              <h2>{unreadMessages}</h2>
            </div>

            <div className="message-stat-card">
              <h3>Read</h3>
              <h2>{readMessages}</h2>
            </div>

            <div className="message-stat-card">
              <h3>Replied</h3>
              <h2>{repliedMessages}</h2>
            </div>

            <div className="message-stat-card">
              <h3>Resolved</h3>
              <h2>{resolvedMessages}</h2>
            </div>

            <div className="message-stat-card">
              <h3>High Priority</h3>
              <h2>{highPriority}</h2>
            </div>
          </div>

          <div className="messages-tools">
            <input
              type="search"
              placeholder="Search by name, email, phone, subject or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Messages</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Replied">Replied</option>
              <option value="Resolved">Resolved</option>
              <option value="High">High Priority</option>
              <option value="Order">Order</option>
              <option value="Product">Product</option>
              <option value="Payment">Payment</option>
            </select>
          </div>

          <div className="messages-layout">
            <div className="messages-list">
              {filteredMessages.length === 0 ? (
                <div className="empty-messages">No customer messages found.</div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      selectedMessage?.id === message.id
                        ? "message-card active"
                        : "message-card"
                    }
                    onClick={() => openMessage(message)}
                  >
                    <div className="message-top">
                      <div className="customer-line">
                        <div className="avatar">{getInitials(message.name)}</div>

                        <div>
                          <h3>{message.name}</h3>
                          <p>{message.email}</p>
                          <p>{message.phone}</p>
                        </div>
                      </div>

                      <span className={statusClass(message.status)}>
                        {message.status}
                      </span>
                    </div>

                    <div className="message-subject">{message.subject}</div>

                    <p className="message-preview">
                      {message.message.length > 115
                        ? `${message.message.slice(0, 115)}...`
                        : message.message}
                    </p>

                    <div className="message-tags">
                      <span className={categoryClass(message.category)}>
                        {message.category}
                      </span>

                      <span className={priorityClass(message.priority)}>
                        {message.priority}
                      </span>

                      <span className="message-meta">{message.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedMessage ? (
              <div className="message-details">
                <div className="details-header">
                  <h2>{selectedMessage.subject}</h2>

                  <p className="message-meta">
                    Message from {selectedMessage.name}
                  </p>

                  <div className="details-status-row">
                    <span className={statusClass(selectedMessage.status)}>
                      {selectedMessage.status}
                    </span>

                    <span className={categoryClass(selectedMessage.category)}>
                      {selectedMessage.category}
                    </span>

                    <span className={priorityClass(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                </div>

                <div className="details-body">
                  <div className="details-info">
                    <div className="info-row">
                      <span>Name</span>
                      <strong>{selectedMessage.name}</strong>
                    </div>

                    <div className="info-row">
                      <span>Email</span>
                      <strong>{selectedMessage.email}</strong>
                    </div>

                    <div className="info-row">
                      <span>Phone</span>
                      <strong>{selectedMessage.phone}</strong>
                    </div>

                    <div className="info-row">
                      <span>Category</span>
                      <strong>{selectedMessage.category}</strong>
                    </div>

                    <div className="info-row">
                      <span>Date</span>
                      <strong>{selectedMessage.date}</strong>
                    </div>
                  </div>

                  <div className="full-message">{selectedMessage.message}</div>

                  <div className="reply-box">
                    <textarea
                      placeholder="Write a professional reply to the customer..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <div className="reply-actions">
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={sendReply}
                      >
                        Save Reply
                      </button>

                      <button
                        type="button"
                        className="gold-btn"
                        onClick={() => markAsResolved(selectedMessage.id)}
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>

                  <div className="message-mini-actions">
                    <button
                      type="button"
                      className="gold-btn"
                      onClick={() => markAsUnread(selectedMessage.id)}
                    >
                      Mark Unread
                    </button>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-details">
                Select a message to view details and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerMessages;
