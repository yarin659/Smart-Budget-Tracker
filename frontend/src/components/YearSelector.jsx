// ===== Logic =====
import styled from "styled-components";

export const YearSelector = ({ year, setYear, options }) => (
  <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
    {options.map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))}
  </Select>
);

// ===== Styling =====
const Select = styled.select`
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;
