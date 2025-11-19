import { useContext, useEffect, useState } from "react";
import { TransactionsContext } from "../context/TransactionsContext";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Insights() {
  const { transactions } = useContext(TransactionsContext);
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    if (!transactions.length) {
      setData([]);
      return;
    }

    const monthly = {};
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const month = d.toLocaleString("en-US", { month: "short" });
      if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 };
      monthly[month][tx.type] += Number(tx.amount);
    });

    const monthsOrder = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const sorted = monthsOrder.filter((m) => monthly[m]).map((m) => monthly[m]);
    setData(sorted);

    if (sorted.length >= 2) {
      const last = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      const change = ((last.expense - prev.expense) / prev.expense) * 100;
      if (change > 0)
        setInsight(`📈 Expenses increased by ${change.toFixed(1)}% compared to last month.`);
      else if (change < 0)
        setInsight(`📉 Expenses decreased by ${Math.abs(change).toFixed(1)}% compared to last month.`);
      else setInsight(`✅ Expenses remained stable compared to last month.`);
    }
  }, [transactions]);

  return (
    <Wrapper>
      <Header>📊 Financial Insights</Header>

      {data.length ? (
        <>
          <ChartBox>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,100,0.15)" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00ff88" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#ff4d4d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
          <InsightText>{insight}</InsightText>
        </>
      ) : (
        <EmptyText>No transaction data found yet 📅</EmptyText>
      )}
    </Wrapper>
  );
}

/* ===== Styled Components ===== */
const Wrapper = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.accent};
`;

const ChartBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 100, 0.15);
`;

const InsightText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
`;

const EmptyText = styled.p`
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
`;
