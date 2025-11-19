// ===== Logic =====
import { useState } from "react";
import styled from "styled-components";
import { YearSelector } from "../components/YearSelector";
import { SummaryCards } from "../components/SummaryCards";
import { BarChartYear } from "../components/BarChartYear";
import { ExpensePieChart } from "../components/ExpensePieChart";

export default function Dashboard() {
  // ===== Mock Data =====
  const yearlyData = {
    2025: [
      { month: "Jan", income: 4800, expense: 2500 },
      { month: "Feb", income: 4700, expense: 2200 },
      { month: "Mar", income: 4900, expense: 3100 },
      { month: "Apr", income: 5200, expense: 2600 },
      { month: "May", income: 5100, expense: 2800 },
      { month: "Jun", income: 5300, expense: 2900 },
      { month: "Jul", income: 4800, expense: 2700 },
      { month: "Aug", income: 5000, expense: 2600 },
      { month: "Sep", income: 4950, expense: 2550 },
      { month: "Oct", income: 5100, expense: 2750 },
      { month: "Nov", income: 5050, expense: 2800 },
      { month: "Dec", income: 5200, expense: 2950 },
    ],
    2024: [
      { month: "Jan", income: 4600, expense: 2400 },
      { month: "Feb", income: 4700, expense: 2500 },
      { month: "Mar", income: 4800, expense: 2600 },
    ],
  };

  const expenseCategories = [
    { category: "Food", value: 650 },
    { category: "Fuel", value: 400 },
    { category: "Utilities", value: 300 },
    { category: "Rent", value: 800 },
    { category: "Insurance", value: 200 },
    { category: "Other", value: 150 },
  ];

  // ===== Logic =====
  const [year, setYear] = useState(2025);
  const totalIncome = yearlyData[year].reduce((acc, m) => acc + m.income, 0);
  const totalExpenses = yearlyData[year].reduce((acc, m) => acc + m.expense, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <Wrapper>
      <Header>Dashboard - {year}</Header>

      {/* Year Selector */}
      <YearSelector
        year={year}
        setYear={setYear}
        options={Object.keys(yearlyData).sort((a, b) => b - a)}
      />

      {/* Summary Cards */}
      <SummaryCards balance={balance} income={totalIncome} expenses={totalExpenses} />

      {/* Charts */}
      <ChartsWrapper>
        <BarChartYear yearlyData={yearlyData} year={year} setYear={setYear} />
        <ExpensePieChart data={expenseCategories} />
      </ChartsWrapper>
    </Wrapper>
  );
}

// ===== Styling =====
const Wrapper = styled.section`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.accent};
`;

const ChartsWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
