// LOGIC PART
import React, { useState } from "react";
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
import styled from "styled-components";

export const BarChartYear = ({ yearlyData, year, setYear }) => {
  const handleChangeYear = (offset) => {
    setYear((prev) => prev + offset);
  };

  const data = yearlyData[year] || [];

  return (
    <Wrapper>
      <Header>
        <h3>Income vs Expenses ({year})</h3>
        <Controls>
          <Button onClick={() => handleChangeYear(-1)} disabled={!yearlyData[year - 1]}>
            ← Prev
          </Button>
          <Button onClick={() => handleChangeYear(1)} disabled={!yearlyData[year + 1]}>
            Next →
          </Button>
        </Controls>
      </Header>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `₪${value.toLocaleString()}`}
            contentStyle={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="#00C49F" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#FF4D4D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

// STYLING PART
const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    color: ${({ theme }) => theme.colors.accent};
    font-size: 1.1rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #00b977;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
