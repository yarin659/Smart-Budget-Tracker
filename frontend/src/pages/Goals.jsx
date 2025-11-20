// ===== Logic =====
import { useState } from "react";
import styled from "styled-components";
import { useGoals } from "../hooks/useGoals";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();

  // Add form
  const [form, setForm] = useState({
    name: "",
    target: "",
    monthlyDeposit: "",
    autoDate: "",
    deadline: "",
  });

  // Edit form
  const [editGoalId, setEditGoalId] = useState(null);
  const [editForm, setEditForm] = useState({
    addAmount: "",
    removeAmount: "",
    target: "",
    monthlyDeposit: "",
  });

  // ===== Add Goal =====
  const handleAddGoal = (e) => {
    e.preventDefault();
    addGoal(form);

    setForm({
      name: "",
      target: "",
      monthlyDeposit: "",
      autoDate: "",
      deadline: "",
    });
  };

  // ===== Update Goal =====
  const handleSaveEdit = (goal) => {
    const add = Number(editForm.addAmount || 0);
    const remove = Number(editForm.removeAmount || 0);
    const updatedCurrent = Math.max(0, goal.current + add - remove);

    updateGoal(goal.id, {
      current: updatedCurrent,
      target: editForm.target || goal.target,
      monthlyDeposit: editForm.monthlyDeposit || goal.monthlyDeposit,
    });

    // reset edit box
    setEditGoalId(null);
    setEditForm({
      addAmount: "",
      removeAmount: "",
      target: "",
      monthlyDeposit: "",
    });
  };

  return (
    <Wrapper>
      <Header>💰 Saving Goals</Header>

      {/* ===== Add Goal Form ===== */}
      <Form onSubmit={handleAddGoal}>
        <InputsRow>
          <Input
            type="text"
            placeholder="Goal name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            type="number"
            placeholder="Target amount"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            required
          />

          <Input
            type="number"
            placeholder="Monthly deposit"
            value={form.monthlyDeposit}
            onChange={(e) =>
              setForm({ ...form, monthlyDeposit: e.target.value })
            }
            required
          />

          <Input
            type="number"
            placeholder="Adding date (1–31)"
            value={form.autoDate}
            onChange={(e) => setForm({ ...form, autoDate: e.target.value })}
            required
          />

          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
        </InputsRow>

        <AddButton type="submit">Add Goal</AddButton>
      </Form>

      {/* ===== Goals List ===== */}
      <GoalList>
        {goals.map((g) => {
          const progress = Math.min(
            (g.current / g.target) * 100,
            100
          ).toFixed(1);

          const currentMonthKey = `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
          ).padStart(2, "0")}`;

          return (
            <GoalCard key={g.id}>
              <RowBetween>
                <GoalTitle>{g.name}</GoalTitle>
                <DeleteButton onClick={() => deleteGoal(g.id)}>❌</DeleteButton>
              </RowBetween>

              {/* Progress Bar */}
              <ProgressContainer>
                <ProgressFill style={{ width: `${progress}%` }} />
              </ProgressContainer>

              <GoalDetails>
                <span>
                  {g.current} / {g.target} ₪
                </span>
                <span>{progress}%</span>
              </GoalDetails>

              <GoalInfo>💸 {g.monthlyDeposit}₪ on day {g.autoDate}</GoalInfo>

              <GoalInfo>
                📅 This month: {g.monthlyHistory?.[currentMonthKey] || 0} ₪
              </GoalInfo>

              <Deadline>
                ⏰ Deadline:{" "}
                {new Date(g.deadline).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Deadline>

              {/* Update Button */}
              <UpdateButton
                onClick={() => {
                  setEditGoalId(g.id);
                  setEditForm({
                    addAmount: "",
                    removeAmount: "",
                    target: g.target,
                    monthlyDeposit: g.monthlyDeposit,
                  });
                }}
              >
                Update Goal
              </UpdateButton>

              {/* Edit Box */}
              {editGoalId === g.id && (
                <EditBox>
                  <EditInput
                    type="number"
                    placeholder="Add amount"
                    value={editForm.addAmount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, addAmount: e.target.value })
                    }
                  />

                  <EditInput
                    type="number"
                    placeholder="Remove amount"
                    value={editForm.removeAmount}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        removeAmount: e.target.value,
                      })
                    }
                  />

                  <EditInput
                    type="number"
                    placeholder="New target"
                    value={editForm.target}
                    onChange={(e) =>
                      setEditForm({ ...editForm, target: e.target.value })
                    }
                  />

                  <EditInput
                    type="number"
                    placeholder="New monthly deposit"
                    value={editForm.monthlyDeposit}
                    onChange={(e) =>
                      setEditForm({ ...editForm, monthlyDeposit: e.target.value })
                    }
                  />

                  <SaveEditButton onClick={() => handleSaveEdit(g)}>
                    Save Changes
                  </SaveEditButton>
                </EditBox>
              )}

              {/* Monthly Chart */}
              {Object.keys(g.monthlyHistory).length > 0 && (
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart
                      data={Object.entries(g.monthlyHistory).map(
                        ([month, value]) => ({
                          month,
                          value,
                        })
                      )}
                    >
                      <XAxis dataKey="month" stroke="#00ffaa" />
                      <YAxis stroke="#00ffaa" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00ffaa"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              )}
            </GoalCard>
          );
        })}
      </GoalList>
    </Wrapper>
  );
}

/* ===== Styling ===== */

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
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 7px 0;
`;

const InputsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
`;

const Input = styled.input`
  width: 180px;
  padding: 10px;
  border: 1px solid #33a360;
  border-radius: 8px;
  background: white;
  color: black;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: black;
  padding: 12px 22px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  align-self: center;
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GoalCard = styled.div`
  background: white;
  padding: 1.2rem;
  border-radius: 12px;
`;

const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GoalTitle = styled.h3`
  color: black;
`;

const ProgressContainer = styled.div`
  background: rgba(0, 0, 0, 0.1);
  height: 10px;
  border-radius: 10px;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
`;

const GoalDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  color: black;
`;

const GoalInfo = styled.small`
  color: black;
`;

const Deadline = styled.small`
  color: #ff4d4d;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  margin-top: 10px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
`;

const EditBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.9);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditInput = styled.input`
  padding: 10px;
  background: white;
  border: 1px solid #00ff99;
  border-radius: 8px;
  color: black;
`;

const SaveEditButton = styled.button`
  padding: 10px 16px;
  background: #00ff99;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
`;

const ChartWrapper = styled.div`
  margin-top: 1rem;
  background: rgba(240,240,240,0.6);
  padding: 1rem;
  border-radius: 10px;
`;
