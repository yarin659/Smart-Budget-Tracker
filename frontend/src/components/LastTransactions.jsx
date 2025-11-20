import styled from "styled-components";

export const LastTransactions = ({ items }) => (
  <Wrapper>
    <h3>Last 5 Transactions</h3>
    {items.map((tx) => (
      <Tx key={tx.id}>
        <span>{tx.desc}</span>
        <Amount type={tx.type}>
          {tx.type === "expense" ? "-" : "+"}₪{tx.amount}
        </Amount>
      </Tx>
    ))}
  </Wrapper>
);

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 12px;
`;

const Tx = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Amount = styled.span`
  color: ${({ type }) => (type === "expense" ? "#ff4d4d" : "#00b977")};
  font-weight: 700;
`;
