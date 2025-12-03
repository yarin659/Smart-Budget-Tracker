// ===== Logic =====
import { useState, useContext, useMemo } from "react";
import styled from "styled-components";
import AddTransactionModal from "../components/AddTransactionModal.jsx";
import { TransactionsContext } from "../context/TransactionsContext";

export default function Transactions() {
  const { transactions, saveTransaction, deleteTransaction } = useContext(TransactionsContext);

  const [open, setOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const itemsPerPage = 8;
  const [page, setPage] = useState(1);

  // save directly to backend 
  const handleSave = async (tx) => {
    await saveTransaction({
      ...tx,
      description: tx.desc,   // map desc -> description
    });

    setOpen(false);
    setEditTx(null);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
  };

  // ===== Filtering + Searching =====
  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const s = search.toLowerCase();
        if (s) {
          const match =
            (t.description || "").toLowerCase().includes(s) ||
            t.category.toLowerCase().includes(s) ||
            t.date.includes(s) ||
            String(t.amount).includes(s);

          if (!match) return false;
        }

        if (filterCategory && t.category !== filterCategory) return false;
        if (filterType && t.type !== filterType) return false;
        if (dateFrom && t.date < dateFrom) return false;
        if (dateTo && t.date > dateTo) return false;
        if (minAmount && Math.abs(t.amount) < Number(minAmount)) return false;
        if (maxAmount && Math.abs(t.amount) > Number(maxAmount)) return false;

        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [
    transactions,
    search,
    filterCategory,
    filterType,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
  ]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const resetPage = () => setPage(1);

  return (
    <Wrapper>
      <Header>
        <h1>Transactions</h1>
        <AddButton
          onClick={() => {
            setEditTx(null);
            setOpen(true);
          }}
        >
          Add Transaction
        </AddButton>
      </Header>

      {/* Filters */}
      <Filters>
        {/* Search */}
        <FilterGroup>
          <label>Search</label>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </FilterGroup>

        {/* Category */}
        <FilterGroup>
          <label>Category</label>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              resetPage();
            }}
          >
            <option value="">All Categories</option>
            {[...new Set(transactions.map((t) => t.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Type */}
        <FilterGroup>
          <label>Type</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              resetPage();
            }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </FilterGroup>

        {/* Date filters */}
        <FilterGroup>
          <label>Date From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </FilterGroup>

        <FilterGroup>
          <label>Date To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </FilterGroup>

        {/* Amount filters */}
        <FilterGroup>
          <label>Min Amount</label>
          <input
            type="number"
            placeholder="Min"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <label>Max Amount</label>
          <input
            type="number"
            placeholder="Max"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </FilterGroup>
      </Filters>

      {/* Table */}
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={t.type}>
                {t.type === "income" ? "+" : "-"}
                {t.amount.toLocaleString()} ₪
              </td>
              <td>
                <MiniBtn onClick={() => { setEditTx(t); setOpen(true); }}>Edit</MiniBtn>
                <MiniBtnDelete onClick={() => handleDelete(t.id)}>Delete</MiniBtnDelete>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

        {/* Mobile Card View */}
        <CardList>
          {paginated.map((t) => (
            <MobileCard key={t.id}>
              <CardTop>
                <div className="desc">{t.description}</div>
                <div className={`amount ${t.type}`}>
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString()} ₪
                </div>
              </CardTop>

              <CardRow>
                <span className="label">Date:</span>
                <span className="value">{t.date}</span>
              </CardRow>

              <CardRow>
                <span className="label">Category:</span>
                <span className="value">{t.category}</span>
              </CardRow>

              <CardActions>
                <MiniBtn onClick={() => { setEditTx(t); setOpen(true); }}>Edit</MiniBtn>
                <MiniBtnDelete onClick={() => handleDelete(t.id)}>Delete</MiniBtnDelete>
              </CardActions>
            </MobileCard>
          ))}
        </CardList>


      

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </Pagination>
      )}

      {/* Modal */}
      {open && (
        <AddTransactionModal
          onClose={() => {
            setOpen(false);
            setEditTx(null);
          }}
          onSave={handleSave}
          editData={editTx}
        />
      )}
    </Wrapper>
  );
}


// ===== Styling =====
const Wrapper = styled.section`
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
  padding: 18px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.8rem;
    color: #666;
    font-weight: 600;
  }

  input,
  select {
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.inputBg || "#f7f9fa"};
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    transition: 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accent};
      box-shadow: 0 0 0 2px rgba(0, 168, 107, 0.18);
      outline: none;
    }
  }
`;



const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #00c56b;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  th, td {
    text-align: left;
    padding: 14px 18px;
  }

  th {
    background: #f0f2f3;
    color: #555;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  .income {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }

  .expense {
    color: #ff4d4d;
    font-weight: 600;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);

  h3 {
    margin: 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 4px 0;
    color: #555;
    font-size: 0.9rem;
  }

  span {
    display: inline-block;
    font-weight: 600;
    margin-top: 4px;
  }

  .income {
    color: ${({ theme }) => theme.colors.accent};
  }

  .expense {
    color: #ff4d4d;
  }
`;

const MiniBtn = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  padding: 6px 12px;
  margin-right: 6px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #00c56b;
  }
`;

const MiniBtnDelete = styled.button`
  background: #ff4d4d;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #d93636;
  }
`;

const Pagination = styled.div`
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  button {
    padding: 8px 14px;
    border-radius: 6px;
    border: none;
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    cursor: pointer;
    transition: 0.2s;
    font-size: 0.85rem;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #00c56b;
    }
  }

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const CardList = styled.div`
  display: none;

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 16px;
  }
`;

const MobileCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .desc {
    font-size: 1.05rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  .amount {
    font-weight: 700;
    font-size: 1.05rem;

    &.income {
      color: ${({ theme }) => theme.colors.accent};
    }

    &.expense {
      color: #ff4d4d;
    }
  }
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;

  .label {
    color: #777;
    font-size: 0.85rem;
  }

  .value {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
`;


