import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== Load goals from backend =====
  useEffect(() => {
    if (!token) return;

    const fetchGoals = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/goals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setGoals(data);
        setLoading(false);

      } catch (err) {
        console.error("Failed to load goals:", err);
        setLoading(false);
      }
    };

    fetchGoals();
  }, [token]);

  // ===== Add goal =====
  const addGoal = async (goal) => {
    try {
      const res = await fetch("http://localhost:8080/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(goal),
      });

      const saved = await res.json();
      setGoals((prev) => [...prev, saved]);

    } catch (err) {
      console.error("Failed to add goal:", err);
    }
  };

  // ===== Delete goal =====
  const deleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoals((prev) => prev.filter((g) => g.id !== id));

    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };


  //edit goal
const editGoal = async (id, updates) => {
  try {
    const res = await fetch(`http://localhost:8080/api/goals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const updated = await res.json();

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? updated : g))
    );

  } catch (err) {
    console.error("Failed to update goal:", err);
  }
};


  return (
    <GoalsContext.Provider value={{ goals, loading, addGoal, deleteGoal, editGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};
