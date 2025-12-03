import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const InsightsContext = createContext();

export const InsightsProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [monthly, setMonthly] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const [categories, setCategories] = useState({});

  useEffect(() => {
    if (!token) return;

    const fetchMonthly = async () => {
      const res = await fetch("http://localhost:8080/api/insights/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMonthly(data);
    };

    const fetchCategories = async () => {
      const res = await fetch("http://localhost:8080/api/insights/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    };

    fetchMonthly();
    fetchCategories();
  }, [token]);

  return (
    <InsightsContext.Provider value={{ monthly, categories }}>
      {children}
    </InsightsContext.Provider>
  );
};
