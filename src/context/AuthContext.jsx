import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// localStorage key for persisting users
const USERS_KEY = "bytebite_users";
const SESSION_KEY = "bytebite_session";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Get all users from localStorage
  const getUsers = () => {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  // Save users list back to localStorage
  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signup = ({ name, email, password }) => {
    const users = getUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, error: "An account with this email already exists." };

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password, // NOTE: plain-text for demo; never do this in production
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    saveUsers(updated);

    // Auto-login after signup
    const { password: _p, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const login = ({ email, password }) => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, error: "Invalid email or password." };

    const { password: _p, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
