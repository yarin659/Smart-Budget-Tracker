// ===== Logic =====
import styled from "styled-components";
import { useState } from "react";

export default function AddTransactionModal({ onClose, onSave, editData }) {

  const [form, setForm] = useState(
  editData || {
    date: "",
    desc: "",
    category: "",
    amount: "",
    type: "expense",
  }
);


  // Expense categories
  const expenseCategories = [
    "Food & Groceries",
    "Rent / Apartment",
    "Utilities",
    "Transportation",
    "Shopping",
    "Subscriptions",
    "Health & Fitness",
    "Entertainment",
    "Insurance",
    "Savings / Investments",
    "Other",
  ];

  // Income categories
  const incomeCategories = [
    "Monthly Salary",
    "One-Time Income",
    "Side Job / Freelancing",
    "Money Transfer From Someone",
    "Refund / Reimbursement",
    "Investment Profit / Dividend",
    "Gift",
    "Other",
  ];

  // Category selection based on type
  const dynamicCategories =
    form.type === "income" ? incomeCategories : expenseCategories;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.desc || !form.amount || !form.category)
      return alert("Please fill all fields");
    onSave(form);
    onClose();
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>Add Transaction</Title>
        <Form onSubmit={handleSubmit}>
          
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <Label>Description</Label>
          <Input
            type="text"
            name="desc"
            placeholder="e.g. Salary, Gas, Netflix..."
            value={form.desc}
            onChange={handleChange}
            required
          />

          <Label>Type</Label>
          <Select
            name="type"
            value={form.type}
            onChange={(e) => {
              setForm({
                ...form,
                type: e.target.value,
                category: "", // reset category
              });
            }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          <Label>Category</Label>
          <Select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {dynamicCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Label>Amount</Label>
          <Input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <ButtonRow>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="save">Save</Button>
          </ButtonRow>

        </Form>
      </ModalBox>
    </Backdrop>
  );
}



// ===== Styling =====
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 36px;
  width: 95%;
  max-width: 440px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e3e6e8;
  animation: fadeIn 0.25s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 22px;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fafafa;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(0, 168, 107, 0.15);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fafafa;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(0, 168, 107, 0.15);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.25s;

  ${({ variant, theme }) =>
    variant === "save"
      ? `
      background: ${theme.colors.accent};
      color: #fff;
      &:hover { background: #00c56b; }
    `
      : `
      background: #f3f3f3;
      color: #333;
      &:hover { background: #e5e5e5; }
    `}
`;
