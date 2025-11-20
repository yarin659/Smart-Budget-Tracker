// ===== Logic =====
import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TransactionsContext } from "../context/TransactionsContext";

export const BarChartYear = () => {
  const { transactions } = useContext(TransactionsContext);

  // Extract all years dynamically
  const years = useMemo(() => {
    const set = new Set(
      transactions.map((t) => new Date(t.date).getFullYear())
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [transactions]);

  const [year, setYear] = useState(years[0] || new Date().getFullYear());

  // Build monthly data
  const data = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const d = new Date(t.date);

      if (d.getFullYear() !== year) return;
      const m = d.getMonth();
      const value = Math.abs(Number(t.amount)); // <— always positive

      if (t.type === "income") months[m].income += value;
      if (t.type === "expense") months[m].expense += value;
    });

    return months;
  }, [transactions, year]);

  const goPrev = () => {
    const idx = years.indexOf(year);
    if (idx < years.length - 1) setYear(years[idx + 1]);
  };

  const goNext = () => {
    const idx = years.indexOf(year);
    if (idx > 0) setYear(years[idx - 1]);
  };

  return (
    <Wrapper>
      <Header>
        <h3>Income vs Expenses ({year})</h3>

        <Controls>
          <Button onClick={goPrev} disabled={years.indexOf(year) === years.length - 1}>
            ← Prev
          </Button>
          <Button onClick={goNext} disabled={years.indexOf(year) === 0}>
            Next →
          </Button>
        </Controls>
      </Header>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip formatter={(v) => `₪${v.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="income" fill="#00C49F" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#FF4D4D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

// ===== Styling =====
const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;
  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;
