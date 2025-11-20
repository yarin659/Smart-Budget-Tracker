// ===== Logic =====
import styled from "styled-components";
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export const SummaryCards = ({ balance, income, expenses }) => (
  <Cards>
    <Card>
      <IconWrapper>
        <DollarSign
          size={32}
          color={balance <= 0 ? "#00b977" : "#ff4d4d"}
        />
      </IconWrapper>

      <Title>Balance</Title>

      <Amount
        type={balance >= 0 ? "income" : "expense"}
        style={{
          color: balance <= 0 ? "#00b977" : "#ff4d4d"
        }}
      >
        {balance <= 0
          ? `+${balance.toLocaleString()} ₪`
          : `-${Math.abs(balance).toLocaleString()} ₪`}
      </Amount>

    </Card>

    <Card>
      <IconWrapper>
        <ArrowUpCircle size={32} color="#00b977" />
      </IconWrapper>
      <Title>Income</Title>
      <Amount type="income">+{income.toLocaleString()} ₪</Amount>
    </Card>

    <Card>
      <IconWrapper>
        <ArrowDownCircle size={32} color="#ff4d4d" />
      </IconWrapper>
      <Title>Expenses</Title>
      <Amount type="expense">{expenses.toLocaleString()} ₪</Amount>
    </Card>
  </Cards>
);

// ===== Styling =====
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: all 0.25s ease-in-out;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.10);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.accent};
`;

const Amount = styled.p`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: ${({ type, theme }) =>
    type === "income"
      ? "#00b977"
      : type === "expense"
      ? "#ff4d4d"
      : theme.colors.text};
`;
