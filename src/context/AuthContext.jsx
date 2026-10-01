import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const mainAdmin = {
  id: 1,
  name: "Main Admin",
  email: "admin@gmail.com",
  password: "admin123",
  phone: "",
  role: "admin",
};

const getSavedUsers = () => {
  const saved = JSON.parse(localStorage.getItem("users")) || [];

  const adminExists = saved.some(
    (user) => user.email?.toLowerCase() === "admin@gmail.com"
  );

  return adminExists ? saved : [mainAdmin, ...saved];
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getSavedUsers);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === cleanEmail &&
        item.password === password
    );

    if (!user) return false;

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));

    return user;
  };

  const signup = (name, email, password, phone = "") => {
    const cleanEmail = email.trim().toLowerCase();

    const exists = users.find(
      (user) => user.email?.toLowerCase() === cleanEmail
    );

    if (exists) return false;

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      phone,
      role: "customer",
    };

    saveUsers([...users, newUser]);
    return true;
  };

  const addUser = (user) => {
    const cleanEmail = user.email.trim().toLowerCase();

    const exists = users.find(
      (item) => item.email?.toLowerCase() === cleanEmail
    );

    if (exists) {
      alert("This email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: user.name,
      email: cleanEmail,
      password: user.password,
      phone: user.phone || "",
      role: user.role || "customer",
    };

    saveUsers([...users, newUser]);
  };

  const removeUser = (id) => {
    const userToRemove = users.find((user) => user.id === id);

    if (userToRemove?.email === "admin@gmail.com") {
      alert("Main Admin cannot be removed.");
      return;
    }

    saveUsers(users.filter((user) => user.id !== id));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        login,
        signup,
        addUser,
        removeUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This hook belongs to the context API and must remain available from this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);