// ===== Logic =====
import styled from "styled-components";

export const SummaryCards = ({ balance, income, expenses }) => (
  <Cards>
    <Card>
      <Title>Balance</Title>
      <Amount>{balance.toLocaleString()} ₪</Amount>
    </Card>
    <Card>
      <Title>Income</Title>
      <Amount type="income">+{income.toLocaleString()} ₪</Amount>
    </Card>
    <Card>
      <Title>Expenses</Title>
      <Amount type="expense">-{expenses.toLocaleString()} ₪</Amount>
    </Card>
  </Cards>
);

// ===== Styling =====
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  }
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 8px;
`;

const Amount = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ type, theme }) =>
    type === "income"
      ? theme.colors.accent
      : type === "expense"
      ? "#ff4d4d"
      : "#222"};
`;
