// ===== Logic =====
import { useState } from "react";
import styled from "styled-components";
import { useGoals } from "../hooks/useGoals";

export default function Goals() {
  const { goals, addGoal, deleteGoal, editGoal } = useGoals();

  // Add Goal Form
  const [form, setForm] = useState({
    name: "",
    target: "",
    deadline: "",
    monthlyAmount: "",
    monthlyDay: "",
  });

  // Currently Editing Goal
  const [editing, setEditing] = useState(null);

  // ===== Add Goal =====
  const handleAddGoal = (e) => {
    e.preventDefault();

    addGoal({
      title: form.name,
      targetAmount: Number(form.target),
      currentAmount: 0,
      deadline: form.deadline || null,
      monthlyAmount: form.monthlyAmount ? Number(form.monthlyAmount) : 0,
      monthlyDay: form.monthlyDay ? Number(form.monthlyDay) : null,
    });

    setForm({
      name: "",
      target: "",
      deadline: "",
      monthlyAmount: "",
      monthlyDay: "",
    });
  };

  // ===== Helpers =====
  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const computeStatus = (g) => {
    const current = Number(g.currentAmount || 0);
    const target = Number(g.targetAmount || 0);

    if (target > 0 && current >= target) return "Completed";

    if (g.deadline) {
      const today = new Date();
      const dl = new Date(g.deadline);
      if (today > dl) return "Past deadline";
    }

    return "In progress";
  };

  const computeEstimatedFinish = (g) => {
    const current = Number(g.currentAmount || 0);
    const target = Number(g.targetAmount || 0);
    const monthly = Number(g.monthlyAmount || 0);

    const remaining = target - current;
    if (remaining <= 0 || monthly <= 0) return null;

    const months = Math.ceil(remaining / monthly);

    if (!g.monthlyDay) {
      return { months, label: `${months} months` };
    }

    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    const day = Math.min(g.monthlyDay, 28);

    let firstPayment = new Date(year, month, day);

    if (firstPayment < today) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      firstPayment = new Date(year, month, day);
    }

    firstPayment.setMonth(firstPayment.getMonth() + (months - 1));
    return { months, label: firstPayment.toLocaleDateString() };
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
            min="0"
          />
        </InputsRow>

        <InputsRow>
          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Monthly deposit"
            value={form.monthlyAmount}
            onChange={(e) =>
              setForm({ ...form, monthlyAmount: e.target.value })
            }
            min="0"
          />
          <Input
            type="number"
            placeholder="Day of month (1–28)"
            value={form.monthlyDay}
            onChange={(e) =>
              setForm({ ...form, monthlyDay: e.target.value })
            }
            min="1"
            max="28"
          />
        </InputsRow>

        <AddButton type="submit">Add Goal</AddButton>
      </Form>

      {/* ===== Goals List ===== */}
      <GoalList>
        {goals.map((g) => {
          const progress = Math.min(
            (Number(g.currentAmount || 0) / Number(g.targetAmount || 1)) * 100,
            100
          ).toFixed(1);

          const status = computeStatus(g);
          const estimate = computeEstimatedFinish(g);

          const isEditing = editing?.id === g.id;

          return (
            <GoalCard key={g.id}>
              <RowBetween>
                <GoalTitle>{g.title}</GoalTitle>

                <RowBetween>
                  <EditButton onClick={() => setEditing(g)}>✏️</EditButton>
                  <DeleteButton onClick={() => deleteGoal(g.id)}>❌</DeleteButton>
                </RowBetween>
              </RowBetween>

                {isEditing && editing && (
                  <EditWrapper>
                    <EditLabel>Edit Goal</EditLabel>

                    {/* Title */}
                    <EditInput
                      type="text"
                      placeholder="Goal name"
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                    />

                    {/* Target amount */}
                    <EditInput
                      type="number"
                      placeholder="Target amount (₪)"
                      value={editing.targetAmount}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          targetAmount: Number(e.target.value),
                        })
                      }
                    />

                    {/* Current amount */}
                    <EditInput
                      type="number"
                      placeholder="Current saved amount (₪)"
                      value={editing.currentAmount ?? 0}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          currentAmount: Number(e.target.value),
                        })
                      }
                    />


                    {/* Deadline */}
                    <EditInput
                      type="date"
                      placeholder="Deadline"
                      value={editing.deadline || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, deadline: e.target.value })
                      }
                    />

                    {/* Monthly deposit */}
                    <EditInput
                      type="number"
                      placeholder="Monthly deposit (₪)"
                      value={editing.monthlyAmount || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          monthlyAmount: Number(e.target.value),
                        })
                      }
                    />

                    {/* Day of month */}
                    <EditInput
                      type="number"
                      placeholder="Deposit day (1–28)"
                      min="1"
                      max="28"
                      value={editing.monthlyDay || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          monthlyDay: Number(e.target.value),
                        })
                      }
                    />

                    {/* Buttons */}
                    <EditActions>
                      <SaveBtn
                        type="button"
                        onClick={() => {
                          editGoal(g.id, {
                            title: editing.title,
                            targetAmount: editing.targetAmount,
                            currentAmount: editing.currentAmount,
                            deadline: editing.deadline,
                            monthlyAmount: editing.monthlyAmount,
                            monthlyDay: editing.monthlyDay,
                          });
                          setEditing(null);
                        }}
                      >
                        Save
                      </SaveBtn>

                      <CancelBtn type="button" onClick={() => setEditing(null)}>
                        Cancel
                      </CancelBtn>
                    </EditActions>
                  </EditWrapper>
                )}



              {!isEditing && (
                <>
                  {/* Progress Bar */}
                  <ProgressContainer>
                    <ProgressFill style={{ width: `${progress}%` }} />
                  </ProgressContainer>

                  <GoalDetails>
                    <span>
                      {Number(g.currentAmount || 0)}₪ /{" "}
                      {Number(g.targetAmount || 0)}₪
                    </span>
                    <span>{progress}%</span>
                  </GoalDetails>

                  <GoalMeta>
                    <MetaItem>
                      <MetaLabel>Deadline</MetaLabel>
                      <MetaValue>{formatDate(g.deadline)}</MetaValue>
                    </MetaItem>

                    <MetaItem>
                      <MetaLabel>Monthly</MetaLabel>
                      <MetaValue>
                        {g.monthlyAmount
                          ? `${g.monthlyAmount}₪ on day ${g.monthlyDay}`
                          : "—"}
                      </MetaValue>
                    </MetaItem>

                    <MetaItem>
                      <MetaLabel>Status</MetaLabel>
                      <MetaValue>{status}</MetaValue>
                    </MetaItem>
                  </GoalMeta>

                  {estimate && (
                    <Estimated>
                      ~ Estimated finish: {estimate.label} ({estimate.months} months)
                    </Estimated>
                  )}
                </>
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
  gap: 12px;
`;

const InputsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 160px;
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
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
`;

const GoalDetails = styled.div`
  display: flex;
  justify-content: space-between;
  color: black;
`;

const GoalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

const MetaLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const MetaValue = styled.span`
  font-size: 0.95rem;
`;

const Estimated = styled.div`
  margin-top: 4px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const EditWrapper = styled.div`
  background: #f3f3f3;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditLabel = styled.h4`
  margin-bottom: 4px;
`;

const EditInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const EditActions = styled.div`
  display: flex;
  gap: 10px;
`;

const SaveBtn = styled.button`
  padding: 6px 12px;
  background: #4caf50;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
`;

const CancelBtn = styled.button`
  padding: 6px 12px;
  background: #999;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
`;
