import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

function Announcements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [audience, setAudience] = useState("All Customers");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Welcome to Chafadia Enterprise",
      message:
        "Explore our premium products and enjoy our latest offers across drinks, skincare, fashion, snacks and wellness.",
      priority: "Important",
      audience: "All Customers",
      date: "2026-06-16",
      active: true,
    },
    {
      id: 2,
      title: "Fresh Juice Orders Available",
      message:
        "Customers can now place orders for pineapple, orange, mango, baobab, cocktail and other natural drinks.",
      priority: "Normal",
      audience: "Customers",
      date: "2026-06-15",
      active: true,
    },
    {
      id: 3,
      title: "Payment Confirmation Notice",
      message:
        "Please always confirm your Mobile Money payment after checkout so your order can be processed quickly.",
      priority: "Urgent",
      audience: "New Customers",
      date: "2026-06-14",
      active: false,
    },
  ]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const text = `${item.title} ${item.message} ${item.priority} ${item.audience}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        item.priority === filter ||
        item.audience === filter ||
        (filter === "Published" && item.active) ||
        (filter === "Unpublished" && !item.active);

      return matchesSearch && matchesFilter;
    });
  }, [announcements, search, filter]);

  const totalAnnouncements = announcements.length;
  const publishedAnnouncements = announcements.filter((item) => item.active).length;
  const unpublishedAnnouncements = announcements.filter((item) => !item.active).length;
  const urgentAnnouncements = announcements.filter((item) => item.priority === "Urgent").length;

  const addAnnouncement = () => {
    if (!title.trim() || !message.trim()) {
      alert("Please complete the title and message.");
      return;
    }

    const newAnnouncement = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      priority,
      audience,
      date: new Date().toLocaleDateString(),
      active: true,
    };

    setAnnouncements([newAnnouncement, ...announcements]);

    setTitle("");
    setMessage("");
    setPriority("Normal");
    setAudience("All Customers");
  };

  const deleteAnnouncement = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) return;

    setAnnouncements(announcements.filter((item) => item.id !== id));
  };

  const toggleStatus = (id) => {
    setAnnouncements(
      announcements.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const priorityClass = (itemPriority) => {
    if (itemPriority === "Normal") return "priority-badge priority-normal";
    if (itemPriority === "Important") return "priority-badge priority-important";
    if (itemPriority === "Urgent") return "priority-badge priority-urgent";
    return "priority-badge priority-normal";
  };

  const statusClass = (active) => {
    return active
      ? "announcement-status status-published"
      : "announcement-status status-unpublished";
  };

  return (
    <>
      <Navbar />

      <div className="announcements-page">
        <style>{`
          .announcements-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.24), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .ann-container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .ann-hero {
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

          .ann-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .ann-hero::after {
            content: "";
            position: absolute;
            width: 165px;
            height: 165px;
            left: -72px;
            bottom: -78px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,74,173,0.2), transparent 70%);
          }

          .ann-hero-content {
            position: relative;
            z-index: 2;
          }

          .ann-label {
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

          .ann-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .ann-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .ann-hero p {
            color: #667085;
            max-width: 760px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .ann-hero-badge {
            position: relative;
            z-index: 2;
            min-width: 152px;
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
          }

          .ann-hero-badge strong {
            font-size: 44px;
            color: #d4af37;
            line-height: 1;
          }

          .ann-hero-badge span {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .ann-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(155px, 190px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .ann-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .ann-stat-card::after {
            content: "";
            position: absolute;
            width: 85px;
            height: 85px;
            right: -38px;
            top: -38px;
            border-radius: 50%;
            background: rgba(212,175,55,0.18);
          }

          .ann-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .ann-stat-card h3 {
            color: #667085;
            font-size: 11.2px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .ann-stat-card h2 {
            color: #d4af37;
            font-size: 26px;
            font-weight: 950;
          }

          .ann-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 230px;
            gap: 14px;
            margin-bottom: 22px;
          }

          .ann-tools input,
          .ann-tools select {
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

          .ann-tools input:focus,
          .ann-tools select:focus,
          .ann-form input:focus,
          .ann-form textarea:focus,
          .ann-form select:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .ann-grid {
            display: grid;
            grid-template-columns: minmax(330px, 390px) minmax(0, 1fr);
            gap: 22px;
            align-items: start;
          }

          .ann-form-card,
          .announcement {
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
          }

          .ann-form-card {
            position: sticky;
            top: 95px;
            overflow: hidden;
          }

          .ann-form-head {
            padding: 22px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .ann-form-head h2 {
            color: #001f4d;
            font-size: 23px;
            margin-bottom: 7px;
          }

          .ann-form-head p {
            color: #667085;
            font-size: 13.5px;
            line-height: 1.6;
            font-weight: 650;
          }

          .ann-form {
            padding: 22px;
            display: grid;
            gap: 13px;
          }

          .ann-form input,
          .ann-form select,
          .ann-form textarea {
            width: 100%;
            padding: 14px 15px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            color: #001f4d;
            font-weight: 750;
            outline: none;
            transition: 0.28s ease;
          }

          .ann-form textarea {
            min-height: 135px;
            resize: vertical;
            line-height: 1.65;
            font-family: inherit;
          }

          .publish-btn {
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

          .publish-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .ann-list {
            display: grid;
            gap: 16px;
          }

          .announcement {
            position: relative;
            overflow: hidden;
            padding: 20px;
            transition: 0.3s ease;
          }

          .announcement::before {
            content: "";
            position: absolute;
            left: 0;
            top: 20px;
            bottom: 20px;
            width: 5px;
            border-radius: 0 999px 999px 0;
            background: linear-gradient(180deg, #004aad, #d4af37);
            opacity: 0.75;
          }

          .announcement:hover {
            transform: translateY(-5px);
            box-shadow: 0 24px 58px rgba(0,31,77,0.14);
          }

          .announcement-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 12px;
          }

          .announcement h3 {
            color: #001f4d;
            font-size: 20px;
            font-weight: 950;
            margin-bottom: 6px;
          }

          .announcement-message {
            color: #667085;
            line-height: 1.75;
            font-size: 14.5px;
            margin: 13px 0;
          }

          .ann-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 13px;
          }

          .priority-badge,
          .announcement-status,
          .audience-badge,
          .date-badge {
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

          .priority-badge::before,
          .announcement-status::before,
          .audience-badge::before,
          .date-badge::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .priority-normal {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #1e3a8a;
            border-color: rgba(30,58,138,0.12);
          }

          .priority-normal::before {
            background: #2563eb;
          }

          .priority-important {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
            border-color: rgba(146,64,14,0.12);
          }

          .priority-important::before {
            background: #d97706;
          }

          .priority-urgent {
            background: linear-gradient(135deg, #fff1f2, #fee2e2);
            color: #991b1b;
            border-color: rgba(153,27,27,0.13);
          }

          .priority-urgent::before {
            background: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.12);
          }

          .status-published {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            border-color: rgba(22,101,52,0.12);
          }

          .status-published::before {
            background: #16a34a;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
          }

          .status-unpublished {
            background: linear-gradient(135deg, #f9fafb, #e5e7eb);
            color: #374151;
            border-color: rgba(55,65,81,0.12);
          }

          .status-unpublished::before {
            background: #6b7280;
            box-shadow: 0 0 0 4px rgba(107,114,128,0.12);
          }

          .audience-badge {
            background: linear-gradient(135deg, #ecfeff, #cffafe);
            color: #155e75;
          }

          .audience-badge::before {
            background: #0891b2;
          }

          .date-badge {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            color: #334155;
          }

          .date-badge::before {
            background: #64748b;
          }

          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 17px;
          }

          .btn-small {
            border: none;
            padding: 11px 15px;
            border-radius: 15px;
            cursor: pointer;
            font-weight: 950;
            transition: 0.3s ease;
          }

          .toggle {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
          }

          .delete {
            background: #dc2626;
            color: white;
          }

          .btn-small:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .empty-announcements {
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
            .ann-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .ann-hero-badge {
              min-width: 120px;
              min-height: 95px;
              border-radius: 24px;
            }

            .ann-hero-badge strong {
              font-size: 34px;
            }

            .ann-tools {
              grid-template-columns: 1fr;
            }

            .ann-grid {
              grid-template-columns: 1fr;
            }

            .ann-form-card {
              position: static;
            }
          }

          @media (max-width: 600px) {
            .announcements-page {
              padding: 14px;
            }

            .ann-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .ann-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .ann-stat-card {
              padding: 14px;
              border-radius: 19px;
            }

            .ann-stat-card h2 {
              font-size: 22px;
            }

            .announcement-top {
              flex-direction: column;
            }

            .ann-form-head,
            .ann-form {
              padding: 17px;
            }

            .actions {
              flex-direction: column;
            }

            .btn-small {
              width: 100%;
            }
          }
        `}</style>

        <div className="ann-container">
          <div className="ann-hero">
            <div className="ann-hero-content">
              <span className="ann-label">Admin Broadcast Center</span>

              <h1>
                Announcements <span>Center</span>
              </h1>

              <p>
                Create, manage and publish important business updates, delivery
                notices, promotional messages and urgent customer announcements
                for Chafadia Enterprise.
              </p>
            </div>

            <div className="ann-hero-badge">
              <strong>{totalAnnouncements}</strong>
              <span>Notices</span>
            </div>
          </div>

          <div className="ann-stats">
            <div className="ann-stat-card">
              <h3>Total</h3>
              <h2>{totalAnnouncements}</h2>
            </div>

            <div className="ann-stat-card">
              <h3>Published</h3>
              <h2>{publishedAnnouncements}</h2>
            </div>

            <div className="ann-stat-card">
              <h3>Unpublished</h3>
              <h2>{unpublishedAnnouncements}</h2>
            </div>

            <div className="ann-stat-card">
              <h3>Urgent</h3>
              <h2>{urgentAnnouncements}</h2>
            </div>
          </div>

          <div className="ann-tools">
            <input
              type="search"
              placeholder="Search announcement title, message, audience or priority..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Announcements</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
              <option value="All Customers">All Customers</option>
              <option value="Customers">Customers</option>
              <option value="New Customers">New Customers</option>
            </select>
          </div>

          <div className="ann-grid">
            <div className="ann-form-card">
              <div className="ann-form-head">
                <h2>Create Announcement</h2>
                <p>
                  Publish professional updates for customers, promotions,
                  operations, deliveries and urgent notices.
                </p>
              </div>

              <div className="ann-form">
                <input
                  placeholder="Announcement Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Normal</option>
                  <option>Important</option>
                  <option>Urgent</option>
                </select>

                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  <option>All Customers</option>
                  <option>Customers</option>
                  <option>New Customers</option>
                  <option>Returning Customers</option>
                  <option>VIP Customers</option>
                </select>

                <textarea
                  placeholder="Announcement Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button className="publish-btn" onClick={addAnnouncement}>
                  Publish Announcement
                </button>
              </div>
            </div>

            <div className="ann-list">
              {filteredAnnouncements.length === 0 ? (
                <div className="empty-announcements">
                  No announcements found.
                </div>
              ) : (
                filteredAnnouncements.map((item) => (
                  <div className="announcement" key={item.id}>
                    <div className="announcement-top">
                      <div>
                        <h3>{item.title}</h3>

                        <div className="ann-meta">
                          <span className={priorityClass(item.priority)}>
                            {item.priority}
                          </span>

                          <span className={statusClass(item.active)}>
                            {item.active ? "Published" : "Unpublished"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="announcement-message">
                      {item.message}
                    </p>

                    <div className="ann-meta">
                      <span className="audience-badge">
                        {item.audience}
                      </span>

                      <span className="date-badge">
                        {item.date}
                      </span>
                    </div>

                    <div className="actions">
                      <button
                        className="btn-small toggle"
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.active ? "Unpublish Notice" : "Publish Notice"}
                      </button>

                      <button
                        className="btn-small delete"
                        onClick={() => deleteAnnouncement(item.id)}
                      >
                        Delete Notice
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Announcements;
