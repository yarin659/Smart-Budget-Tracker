// ===== Logic =====
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const COLORS = [
  "#00C49F", // Food
  "#FF8042", // Rent
  "#0088FE", // Utilities
  "#FFBB28", // Insurance
  "#FF4D4D", // Other
  "#A65FF3", // Fuel
];

export const ExpensePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderPercentageLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / total) * 100).toFixed(1);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          pointerEvents: "none",
        }}
      >
        {percentage}%
      </text>
    );
  };

  // === Tooltip מותאם ===
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / total) * 100).toFixed(1);
      return (
        <TooltipBox>
          <p>
            <strong>{name}</strong>: ₪{value.toLocaleString()} ({percentage}%)
          </p>
        </TooltipBox>
      );
    }
    return null;
  };

  return (
    <Wrapper>
      <h3>Expense Breakdown (Current Month)</h3>
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            label={renderPercentageLabel} 
            labelLine={false} 
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
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
  border-radius: 16px;
  padding: 24px 24px;
  margin-top: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    color: ${({ theme }) => theme.colors.accent};
    margin-bottom: 32px;
    font-size: 1.3rem;
    text-align: center;
  }
`;

const TooltipBox = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  font-weight: 500;
`;
