// ===== Logic =====
import { createContext, useState, useEffect } from "react";

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load goals (currently from localStorage, later from PostgreSQL)
  useEffect(() => {
    // Load from localStorage for now
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    setGoals(stored);
    setLoading(false);
  }, []);

  // Save to localStorage (will be swapped to fetch() in future)
  const saveGoalsToStorage = (updated) => {
    localStorage.setItem("goals", JSON.stringify(updated));
  };

  // Add a new goal
  const addGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      current: 0,
      recurring: false,
      monthlyHistory: {},
      groupMode: false,
      participants: [],
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoalsToStorage(updated);
  };

  // Update existing goal
  const updateGoal = (goalId, fields) => {
    const updated = goals.map((g) =>
      g.id === goalId ? { ...g, ...fields } : g
    );
    setGoals(updated);
    saveGoalsToStorage(updated);
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    saveGoalsToStorage(updated);
  };

  // Auto deposit simulation (same logic as before)
  useEffect(() => {
    const today = new Date().getDate();
    const monthKey = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;

    const updated = goals.map((g) => {
      if (Number(g.autoDate) === today) {
        const deposit = Number(g.monthlyDeposit);
        const newCurrent = Math.min(Number(g.current) + deposit, Number(g.target));

        return {
          ...g,
          current: newCurrent,
          monthlyHistory: {
            ...g.monthlyHistory,
            [monthKey]: (g.monthlyHistory?.[monthKey] || 0) + deposit,
          },
        };
      }
      return g;
    });

    setGoals(updated);
    saveGoalsToStorage(updated);
  }, []);

  return (
    <GoalsContext.Provider
      value={{
        goals,
        loading,
        addGoal,
        updateGoal,
        deleteGoal,
        setGoals, // optional for advanced usage
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};
