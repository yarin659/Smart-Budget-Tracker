// ===== Logic =====
import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TransactionsContext } from "../context/TransactionsContext";

const COLORS = [
  "#00C49F",
  "#FF8042",
  "#0088FE",
  "#FFBB28",
  "#FF4D4D",
  "#A65FF3",
  "#36CFC9",
  "#DA70D6",
];

export const ExpensePieChart = () => {
  const { transactions } = useContext(TransactionsContext);

  const chartData = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const exp = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    const map = {};
    exp.forEach((t) => {
      const value = Math.abs(Number(t.amount)); // <— always positive
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += value;
    });

    return Object.entries(map).map(([category, value]) => ({
      category,
      value,
    }));
  }, [transactions]);

  const total = chartData.reduce((a, b) => a + b.value, 0);

  // Empty state
  if (chartData.length === 0) {
    return (
      <Wrapper>
        <h3>Expense Breakdown (This Month)</h3>
        <Empty>No expenses this month.</Empty>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h3>Expense Breakdown (This Month)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              label={({ value }) => `${((value / total) * 100).toFixed(1)}%`}
              labelLine={false}
              labelRadius={80} 
            >

            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(v) => `₪${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </Wrapper>
  );
};

// ===== Styling =====
const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
  border-radius: 16px;

  h3 {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.accent};
    text-align: center;
    margin-bottom: 20px;
  }
`;

const Empty = styled.div`
  font-size: 1rem;
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
