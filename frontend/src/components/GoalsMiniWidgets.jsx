import styled from "styled-components";
import { useGoals } from "../hooks/useGoals";

export const GoalsMiniWidgets = () => {
  const { goals } = useGoals();

  const topGoals = goals.slice(0, 3);

  return (
    <Wrapper>
      <Title>🎯 Goals Overview</Title>

      {topGoals.length === 0 && <Empty>No goals added yet.</Empty>}

      {topGoals.map((g) => {
        const progress = Math.min(
          (Number(g.current) / Number(g.target)) * 100,
          100
        ).toFixed(1);

        return (
          <GoalCard key={g.id}>
            <Row>
              <Name>{g.name}</Name>
              <Pct>{progress}%</Pct>
            </Row>

            <Bar>
              <Fill style={{ width: `${progress}%` }} />
            </Bar>

            <Amounts>{g.current}₪ / {g.target}₪</Amounts>
          </GoalCard>
        );
      })}
    </Wrapper>
  );
};

// ===== Styling =====
const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 14px;
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 0;
`;

const GoalCard = styled.div`
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Name = styled.span`
  font-weight: 600;
`;

const Pct = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`;

const Bar = styled.div`
  height: 8px;
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 6px;
`;

const Fill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
`;

const Amounts = styled.div`
  margin-top: 4px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
