import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "expense_tracker_data_v1";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#FF6B6B" },
  { name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { name: "Housing", icon: "🏠", color: "#45B7D1" },
  { name: "Health", icon: "💊", color: "#96CEB4" },
  { name: "Shopping", icon: "🛍️", color: "#FFEAA7" },
  { name: "Entertainment", icon: "🎬", color: "#DDA0DD" },
  { name: "Utilities", icon: "⚡", color: "#F0E68C" },
  { name: "Other", icon: "📦", color: "#B0C4DE" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const seedExpenses = [
  { id: 1, description: "Groceries", amount: 12500, category: "Food", date: "2026-03-08" },
  { id: 2, description: "Uber to office", amount: 3200, category: "Transport", date: "2026-03-07" },
  { id: 3, description: "DSTV subscription", amount: 8500, category: "Entertainment", date: "2026-03-05" },
  { id: 4, description: "EKEDC bill", amount: 15000, category: "Utilities", date: "2026-03-03" },
  { id: 5, description: "Lunch at Chicken Republic", amount: 4500, category: "Food", date: "2026-03-01" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const today = () => new Date().toISOString().split("T")[0];

const getInitialExpenses = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedExpenses;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : seedExpenses;
  } catch {
    return seedExpenses;
  }
};

export default function App() {
  const [expenses, setExpenses] = useState(getInitialExpenses);
  const [form, setForm] = useState({ description: "", amount: "", category: "Food", date: today() });
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const filtered = useMemo(
    () => (filterCat === "All" ? expenses : expenses.filter((e) => e.category === filterCat)),
    [expenses, filterCat]
  );

  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach((expense) => {
      map[expense.category] = (map[expense.category] || 0) + expense.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const topCategory = byCategory[0];

  const thisMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.reduce((sum, expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear ? sum + expense.amount : sum;
    }, 0);
  }, [expenses]);

  const handleSubmit = () => {
    const description = form.description.trim();
    const amount = Number(form.amount);

    if (!description || !form.date || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    if (editId !== null) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editId
            ? { ...expense, description, amount, category: form.category, date: form.date }
            : expense
        )
      );
      setEditId(null);
    } else {
      setExpenses((prev) => [
        { id: Date.now(), description, amount, category: form.category, date: form.date },
        ...prev,
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({ description: "", amount: "", category: "Food", date: today() });
    setShowForm(false);
    setEditId(null);
  };

  const startEdit = (expense) => {
    setForm({
      description: expense.description,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
    });
    setEditId(expense.id);
    setShowForm(true);
  };

  const confirmDelete = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    setDeleteId(null);
  };

  const getCat = (name) => CATEGORIES.find((category) => category.name === name) || CATEGORIES[7];

  return (
    <div className="app-shell">
      <div className="tracker container">
        <header className="header">
          <div>
            <p className="eyebrow">Personal Finance</p>
            <h1 className="headline title">
              Expense <br />
              <span>Tracker</span>
            </h1>
          </div>

          <button
            className="btn btn-gold"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ description: "", amount: "", category: "Food", date: today() });
            }}
          >
            <span className="plus">+</span> Add Expense
          </button>
        </header>

        <section className="stats-grid">
          {[
            { label: "Total Spent", value: formatCurrency(totalSpent), sub: `${expenses.length} transactions` },
            {
              label: "Top Category",
              value: topCategory ? topCategory[0] : "—",
              sub: topCategory ? formatCurrency(topCategory[1]) : "No data",
            },
            {
              label: "This Month",
              value: formatCurrency(thisMonthTotal),
              sub: new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(new Date()),
            },
          ].map((item) => (
            <article key={item.label} className="stat-card">
              <p className="stat-label">{item.label}</p>
              <h2 className="headline stat-value">{item.value}</h2>
              <p className="stat-sub">{item.sub}</p>
            </article>
          ))}
        </section>

        {byCategory.length > 0 && (
          <section className="panel breakdown-panel">
            <p className="section-label">Breakdown</p>
            <div className="breakdown-list">
              {byCategory.map(([category, amount]) => {
                const cat = getCat(category);
                const pct = Math.round((amount / totalSpent) * 100);

                return (
                  <div key={category} className="breakdown-row">
                    <span className="breakdown-icon">{cat.icon}</span>
                    <span className="breakdown-name">{category}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                    <span className="breakdown-amount">{formatCurrency(amount)}</span>
                    <span className="breakdown-percent">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="filter-row">
          {["All", ...CATEGORIES.map((category) => category.name)].map((category) => (
            <button
              key={category}
              className={`cat-pill ${filterCat === category ? "active" : ""}`}
              onClick={() => setFilterCat(category)}
            >
              {category === "All" ? "All" : `${getCat(category).icon} ${category}`}
            </button>
          ))}
        </section>

        <section className="panel expense-list-panel">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No expenses found</p>
            </div>
          ) : (
            filtered.map((expense, index) => {
              const cat = getCat(expense.category);
              const date = new Date(expense.date);

              return (
                <div
                  key={expense.id}
                  className={`expense-row ${index < filtered.length - 1 ? "expense-divider" : ""}`}
                >
                  <div
                    className="expense-icon"
                    style={{ background: `${cat.color}18`, borderColor: `${cat.color}33` }}
                  >
                    {cat.icon}
                  </div>

                  <div className="expense-main">
                    <h3 className="expense-title">{expense.description}</h3>
                    <p className="expense-meta">
                      {expense.category} · {MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                    </p>
                  </div>

                  <div className="headline expense-amount">{formatCurrency(expense.amount)}</div>

                  <div className="expense-actions">
                    <button className="icon-btn" onClick={() => startEdit(expense)} title="Edit">
                      ✏️
                    </button>
                    <button className="icon-btn" onClick={() => setDeleteId(expense.id)} title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {filtered.length > 0 && (
          <footer className="total-footer">
            <span className="footer-label">{filterCat !== "All" ? `${filterCat} total` : "Grand total"}:</span>
            <span className="headline footer-value">
              {formatCurrency(filtered.reduce((sum, expense) => sum + expense.amount, 0))}
            </span>
          </footer>
        )}
      </div>

      {showForm && (
        <div className="overlay" onClick={resetForm}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2 className="headline modal-title">{editId !== null ? "Edit Expense" : "New Expense"}</h2>

            <div className="form-stack">
              <div>
                <label className="field-label">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Groceries at Shoprite"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div>
                <label className="field-label">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                />
              </div>

              <div>
                <label className="field-label">Category</label>
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                />
              </div>

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={resetForm}>
                  Cancel
                </button>
                <button className="btn btn-gold" onClick={handleSubmit}>
                  {editId !== null ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="overlay" onClick={() => setDeleteId(null)}>
          <div className="modal modal-small" onClick={(event) => event.stopPropagation()}>
            <div className="delete-wrap">
              <div className="delete-icon">🗑️</div>
              <h2 className="headline delete-title">Delete Expense?</h2>
              <p className="delete-text">This action cannot be undone.</p>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={() => confirmDelete(deleteId)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
