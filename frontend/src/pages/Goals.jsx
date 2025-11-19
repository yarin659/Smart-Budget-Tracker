// ===== Logic =====
import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [editGoalId, setEditGoalId] = useState(null);
  const [editForm, setEditForm] = useState({
    addAmount: "",
    removeAmount: "",
    target: "",
    monthlyDeposit: "",
  });

  const [form, setForm] = useState({
    name: "",
    target: "",
    monthlyDeposit: "",
    autoDate: "",
    deadline: "",
  });

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    setGoals(stored);
  }, []);

  const saveGoals = (data) => {
    localStorage.setItem("goals", JSON.stringify(data));
  };

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();

    const newGoal = {
      id: Date.now(),
      ...form,
      current: 0,
      recurring: false,
      monthlyHistory: {},
      groupMode: false,
      participants: [],
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);

    setForm({
      name: "",
      target: "",
      monthlyDeposit: "",
      autoDate: "",
      deadline: "",
    });
  };

  // Delete goal
  const deleteGoal = (id) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  // Update goal
  const handleUpdateGoal = (goal) => {
    const updated = goals.map((g) => {
      if (g.id !== goal.id) return g;

      const add = Number(editForm.addAmount || 0);
      const remove = Number(editForm.removeAmount || 0);
      const newCurrent = Math.max(0, Number(g.current) + add - remove);

      return {
        ...g,
        current: newCurrent,
        target: editForm.target || g.target,
        monthlyDeposit: editForm.monthlyDeposit || g.monthlyDeposit,
      };
    });

    setGoals(updated);
    saveGoals(updated);

    setEditGoalId(null);
    setEditForm({
      addAmount: "",
      removeAmount: "",
      target: "",
      monthlyDeposit: "",
    });
  };

  // Auto deposit simulation + monthly history
  useEffect(() => {
    const today = new Date().getDate();
    const monthKey = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;

    const updated = goals.map((g) => {
      if (Number(g.autoDate) === today) {
        const deposit = Number(g.monthlyDeposit);

        const newCurr = Math.min(Number(g.current) + deposit, Number(g.target));

        const updatedHistory = {
          ...g.monthlyHistory,
          [monthKey]: (g.monthlyHistory?.[monthKey] || 0) + deposit,
        };

        return { ...g, current: newCurr, monthlyHistory: updatedHistory };
      }
      return g;
    });

    setGoals(updated);
    saveGoals(updated);
  }, []);

  return (
    <Wrapper>
      <Header>💰 Saving Goals</Header>

      {/* ===== Form ===== */}
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
            (Number(g.current) / Number(g.target)) * 100,
            100
          ).toFixed(1);

          const currentMonthKey = `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
          ).padStart(2, "0")}`;

          return (
            <GoalCard key={g.id}>
              <RowBetween>
                <GoalTitle>{g.name}</GoalTitle>

                {/* DELETE BUTTON */}
                <DeleteButton onClick={() => deleteGoal(g.id)}>❌</DeleteButton>
              </RowBetween>

              <ProgressContainer>
                <ProgressFill style={{ width: `${progress}%` }} />
              </ProgressContainer>

              <GoalDetails>
                <span>
                  {g.current} / {g.target} ₪
                </span>
                <span>{progress}%</span>
              </GoalDetails>

              <GoalInfo>
                💸 {g.monthlyDeposit}₪ deposited on day {g.autoDate}
              </GoalInfo>

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

              {/* UPDATE BUTTON */}
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

              {/* EDIT BOX */}
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
                      setEditForm({
                        ...editForm,
                        monthlyDeposit: e.target.value,
                      })
                    }
                  />

                  <SaveEditButton onClick={() => handleUpdateGoal(g)}>
                    Save Changes
                  </SaveEditButton>
                </EditBox>
              )}

              {/* MONTHLY CHART */}
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
  width: 100%;
`;


const Input = styled.input`
  width: 180px;   
  max-width: 180px;   
  min-width: 180px; 
  padding: 10px;
  border: 1px solid #33a360;
  border-radius: 8px;
  background: white;
  color: black;
  font-size: 0.95rem;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: black;
  padding: 12px 22px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  align-self: center; 
  width: 200px;
  margin-top: 5px;
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
  margin: 0;
  color: black;
`;

const ProgressContainer = styled.div`
  background: rgba(0, 0, 0, 0.1);
  height: 10px;
  border-radius: 10px;
  overflow: hidden;
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
  font-size: 0.9rem;
  color: black;
`;

const GoalInfo = styled.small`
  color: black;
`;

const Deadline = styled.small`
  display: block;
  margin-top: 6px;
  color: #ff4d4d;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
`;

const UpdateButton = styled.button`
  margin-top: 10px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: black;
  font-weight: 600;
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
  cursor: pointer;
  color: black;
  font-weight: 700;
`;

const ChartWrapper = styled.div`
  margin-top: 1rem;
  background: rgba(240,240,240,0.6);
  padding: 1rem;
  border-radius: 10px;
`;
