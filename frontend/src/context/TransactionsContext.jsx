import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  // ===== Load transactions =====
  const loadTransactions = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch transactions", res.status);
        return;
      }

      const data = await res.json();
      setTransactions(data);

    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [token]);


  // ===== Save (Add or Update) =====
  const saveTransaction = async (t) => {
    try {
      // UPDATE
      if (t.id) {
        const res = await fetch(
          `http://localhost:8080/api/transactions/${t.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(t),
          }
        );

        if (!res.ok) {
          console.error("Failed to update transaction");
          return;
        }

        const updated = await res.json();

        // Update state
        setTransactions((prev) =>
          prev.map((x) => (x.id === updated.id ? updated : x))
        );

        return;
      }

      // CREATE
      const res = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(t),
      });

      if (!res.ok) {
        console.error("Failed to add transaction");
        return;
      }

      const created = await res.json();
      setTransactions((prev) => [...prev, created]);

    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  };


  // ===== Delete =====
  const deleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) => prev.filter((t) => t.id !== id));

    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };


  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        saveTransaction,
        deleteTransaction,
        loadTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
