// ===== Logic =====
import styled from "styled-components";
import { useContext, useMemo, useState, useEffect } from "react";

import { TransactionsContext } from "../context/TransactionsContext";

import { SummaryCards } from "../components/SummaryCards";
import { GoalsMiniWidgets } from "../components/GoalsMiniWidgets";
import { LastTransactions } from "../components/LastTransactions";
import { BarChartYear } from "../components/BarChartYear";
import { ExpensePieChart } from "../components/ExpensePieChart";

export default function Dashboard() {
  const { transactions } = useContext(TransactionsContext);

  // === Get Logged User ===
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  // === Calculate Stats ===
  const currentYear = new Date().getFullYear();
  const yearTx = transactions.filter(
    (t) => new Date(t.date).getFullYear() === currentYear
  );

  const totalIncome = yearTx
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpenses = yearTx
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = totalIncome - totalExpenses;

  const lastFive = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Wrapper>

      {/* Greeting */}
      <Greeting>
        Hello {userName || "Friend"} 👋
      </Greeting>

      {/* Summary Cards */}
      <SummaryCards
        balance={balance}
        income={totalIncome}
        expenses={totalExpenses}
      />

      {/* Goals + Last Transactions */}
      <TopSection>
        <GoalsMiniWidgets />
        <LastTransactions items={lastFive} />
      </TopSection>

      {/* Bottom Charts */}
      <ChartsSection>
        <BarChartSection>
          <BarChartYear />
        </BarChartSection>

        <PieChartSection>
          <ExpensePieChart />
        </PieChartSection>
      </ChartsSection>

    </Wrapper>
  );
}

// ===== Styling =====
const Wrapper = styled.section`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Greeting = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin-top: 32px;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BarChartSection = styled.div`
  width: 100%;
`;

const PieChartSection = styled.div`
  width: 100%;
`;
