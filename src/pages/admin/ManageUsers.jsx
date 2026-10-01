import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

function ManageUsers() {
  const { users, addUser, removeUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = `${user.name} ${user.email} ${user.role}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;
  const admins = users.filter((user) => user.role === "admin").length;
  const cashiers = users.filter((user) => user.role === "cashier").length;
  const customers = users.filter((user) => user.role === "customer").length;

  const handleAdd = (e) => {
    e.preventDefault();

    addUser({
      ...form,
      email: form.email.trim().toLowerCase(),
      name: form.name.trim(),
    });

    setForm({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";
  };

  const roleClass = (role) => {
    if (role === "admin") return "role-badge role-admin";
    if (role === "cashier") return "role-badge role-cashier";
    return "role-badge role-customer";
  };

  const roleLabel = (role) => {
    if (role === "admin") return "Admin";
    if (role === "cashier") return "Cashier";
    return "Customer";
  };

  const isMainAdmin = (email) => {
    return email?.toLowerCase() === "admin@gmail.com";
  };

  return (
    <>
      <Navbar />

      <div className="users-page">
        <style>{`
          .users-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.25), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .users-container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .users-hero {
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

          .users-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%);
          }

          .users-hero::after {
            content: "";
            position: absolute;
            width: 165px;
            height: 165px;
            left: -72px;
            bottom: -78px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,74,173,0.2), transparent 70%);
          }

          .users-hero-content {
            position: relative;
            z-index: 2;
          }

          .users-label {
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

          .users-hero h1 {
            color: #001f4d;
            font-size: clamp(34px, 5vw, 58px);
            font-weight: 950;
            letter-spacing: -1.3px;
            margin-bottom: 10px;
          }

          .users-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .users-hero p {
            color: #667085;
            max-width: 760px;
            line-height: 1.78;
            font-weight: 650;
            font-size: 15.5px;
          }

          .users-hero-badge {
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

          .users-hero-badge strong {
            font-size: 44px;
            color: #d4af37;
            line-height: 1;
          }

          .users-hero-badge span {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .users-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(155px, 190px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .user-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .user-stat-card::after {
            content: "";
            position: absolute;
            width: 85px;
            height: 85px;
            right: -38px;
            top: -38px;
            border-radius: 50%;
            background: rgba(212,175,55,0.18);
          }

          .user-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .user-stat-card h3 {
            color: #667085;
            font-size: 11.2px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .user-stat-card h2 {
            color: #d4af37;
            font-size: 26px;
            font-weight: 950;
          }

          .users-main-grid {
            display: grid;
            grid-template-columns: minmax(330px, 390px) minmax(0, 1fr);
            gap: 22px;
            align-items: start;
          }

          .add-user-card,
          .user-card {
            background: rgba(255,255,255,0.985);
            border-radius: 28px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
          }

          .add-user-card {
            position: sticky;
            top: 95px;
            overflow: hidden;
          }

          .add-user-head {
            padding: 22px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .add-user-head h2 {
            color: #001f4d;
            font-size: 23px;
            margin-bottom: 7px;
          }

          .add-user-head p {
            color: #667085;
            font-size: 13.5px;
            line-height: 1.6;
            font-weight: 650;
          }

          .add-user-form {
            padding: 22px;
            display: grid;
            gap: 13px;
          }

          .add-user-form input,
          .add-user-form select,
          .users-tools input,
          .users-tools select {
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

          .add-user-form input:focus,
          .add-user-form select:focus,
          .users-tools input:focus,
          .users-tools select:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .password-box {
            position: relative;
          }

          .password-box input {
            padding-right: 50px;
          }

          .eye-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: none;
            background: rgba(0,74,173,0.08);
            cursor: pointer;
            transition: 0.25s ease;
          }

          .eye-btn:hover {
            background: rgba(212,175,55,0.22);
          }

          .add-user-btn {
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

          .add-user-btn:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .users-panel {
            display: grid;
            gap: 18px;
          }

          .users-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 220px;
            gap: 14px;
          }

          .users-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 16px;
          }

          .user-card {
            position: relative;
            overflow: hidden;
            padding: 20px;
            transition: 0.3s ease;
          }

          .user-card::before {
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

          .user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 24px 58px rgba(0,31,77,0.14);
          }

          .user-top {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 16px;
          }

          .user-avatar {
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

          .user-card h3 {
            color: #001f4d;
            font-size: 18px;
            margin-bottom: 4px;
          }

          .user-email {
            color: #667085;
            font-size: 13px;
            line-height: 1.45;
            word-break: break-word;
          }

          .role-badge,
          .main-admin-badge {
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

          .role-badge::before,
          .main-admin-badge::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .role-admin {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
            border-color: rgba(146,64,14,0.12);
          }

          .role-admin::before {
            background: #d97706;
            box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
          }

          .role-cashier {
            background: linear-gradient(135deg, #ecfeff, #cffafe);
            color: #155e75;
            border-color: rgba(21,94,117,0.12);
          }

          .role-cashier::before {
            background: #0891b2;
            box-shadow: 0 0 0 4px rgba(8,145,178,0.12);
          }

          .role-customer {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #1e3a8a;
            border-color: rgba(30,58,138,0.12);
          }

          .role-customer::before {
            background: #2563eb;
            box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
          }

          .main-admin-badge {
            margin-left: 8px;
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            border-color: rgba(22,101,52,0.12);
          }

          .main-admin-badge::before {
            background: #16a34a;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
          }

          .user-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
          }

          .remove-user-btn {
            width: 100%;
            border: none;
            padding: 12px 14px;
            border-radius: 16px;
            cursor: pointer;
            font-weight: 950;
            background: #dc2626;
            color: white;
            transition: 0.3s ease;
          }

          .remove-user-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .protected-user {
            width: 100%;
            padding: 12px 14px;
            border-radius: 16px;
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            font-weight: 950;
            text-align: center;
          }

          .empty-users {
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
            .users-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .users-hero-badge {
              min-width: 120px;
              min-height: 95px;
              border-radius: 24px;
            }

            .users-hero-badge strong {
              font-size: 34px;
            }

            .users-main-grid {
              grid-template-columns: 1fr;
            }

            .add-user-card {
              position: static;
            }

            .users-tools {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .users-page {
              padding: 14px;
            }

            .users-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .users-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .user-stat-card {
              padding: 14px;
              border-radius: 19px;
            }

            .user-stat-card h2 {
              font-size: 22px;
            }

            .add-user-head,
            .add-user-form {
              padding: 17px;
            }

            .users-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="users-container">
          <div className="users-hero">
            <div className="users-hero-content">
              <span className="users-label">Admin Access Control</span>

              <h1>
                Manage <span>Users</span>
              </h1>

              <p>
                Create, organize and protect Chafadia Enterprise accounts. Add
                admins, cashiers and customers, filter users by role, and keep
                access management clean and professional.
              </p>
            </div>

            <div className="users-hero-badge">
              <strong>{totalUsers}</strong>
              <span>Users</span>
            </div>
          </div>

          <div className="users-stats">
            <div className="user-stat-card">
              <h3>Total Users</h3>
              <h2>{totalUsers}</h2>
            </div>

            <div className="user-stat-card">
              <h3>Admins</h3>
              <h2>{admins}</h2>
            </div>

            <div className="user-stat-card">
              <h3>Cashiers</h3>
              <h2>{cashiers}</h2>
            </div>

            <div className="user-stat-card">
              <h3>Customers</h3>
              <h2>{customers}</h2>
            </div>
          </div>

          <div className="users-main-grid">
            <div className="add-user-card">
              <div className="add-user-head">
                <h2>Add New User</h2>

                <p>
                  Create an account for an admin, cashier or customer with the
                  correct access level.
                </p>
              </div>

              <form className="add-user-form" onSubmit={handleAdd}>
                <input
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Show or hide password"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>

                <button className="add-user-btn" type="submit">
                  Add User
                </button>
              </form>
            </div>

            <div className="users-panel">
              <div className="users-tools">
                <input
                  type="search"
                  placeholder="Search by name, email or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="cashier">Cashiers</option>
                  <option value="customer">Customers</option>
                </select>
              </div>

              <div className="users-grid">
                {filteredUsers.length === 0 ? (
                  <div className="empty-users">
                    No users found.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div className="user-card" key={user.id}>
                      <div className="user-top">
                        <div className="user-avatar">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <h3>{user.name}</h3>
                          <p className="user-email">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="user-meta">
                        <span className={roleClass(user.role)}>
                          {roleLabel(user.role)}
                        </span>

                        {isMainAdmin(user.email) && (
                          <span className="main-admin-badge">
                            Protected
                          </span>
                        )}
                      </div>

                      {isMainAdmin(user.email) ? (
                        <div className="protected-user">
                          Main Admin cannot be removed
                        </div>
                      ) : (
                        <button
                          className="remove-user-btn"
                          onClick={() => removeUser(user.id)}
                        >
                          Remove User
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUsers;
