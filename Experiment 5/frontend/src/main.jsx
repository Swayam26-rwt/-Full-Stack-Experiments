import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = "http://localhost:8080/api/accounts";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountNumber: "",
    holderName: "",
    accountType: "SAVINGS",
    balance: 5000,
  });
  const [transferForm, setTransferForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [backendOnline, setBackendOnline] = useState(true);

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const loadAccounts = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();
      setAccounts(json.data || []);
      setBackendOnline(true);
    } catch (err) {
      console.warn("Backend unavailable or network error:", err);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (res.ok) {
        showNotification(json.message || "Account created successfully", "success");
        setForm({
          accountNumber: "",
          holderName: "",
          accountType: "SAVINGS",
          balance: 1000,
        });
        loadAccounts();
      } else {
        showNotification(json.data || json.message || "Failed to create account", "error");
      }
    } catch (err) {
      showNotification("Error connecting to Spring Boot backend: " + err.message, "error");
    }
  };

  const deposit = async (id) => {
    const amountStr = prompt("Enter deposit amount (₹):", "500");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid deposit amount");
      return;
    }

    try {
      const res = await fetch(`${API}/${id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (res.ok) {
        showNotification(json.message || "Deposit successful", "success");
        loadAccounts();
      } else {
        showNotification(json.message || "Deposit failed", "error");
      }
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const withdraw = async (id) => {
    const amountStr = prompt("Enter withdrawal amount (₹):", "200");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid withdrawal amount");
      return;
    }

    try {
      const res = await fetch(`${API}/${id}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const json = await res.json();
      if (res.ok) {
        showNotification(json.message || "Withdrawal successful", "success");
        loadAccounts();
      } else {
        showNotification(json.message || "Withdrawal failed", "error");
      }
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount) {
      alert("Please fill all transfer fields");
      return;
    }
    if (transferForm.fromAccountId === transferForm.toAccountId) {
      alert("Source and Destination accounts must be different");
      return;
    }

    try {
      const res = await fetch(`${API}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: Number(transferForm.fromAccountId),
          toAccountId: Number(transferForm.toAccountId),
          amount: Number(transferForm.amount),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        showNotification(json.message || "Transfer successful", "success");
        setShowTransferModal(false);
        setTransferForm({ fromAccountId: "", toAccountId: "", amount: "" });
        loadAccounts();
      } else {
        showNotification(json.message || "Transfer failed", "error");
      }
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  const deleteAccount = async (id) => {
    if (!confirm("Are you sure you want to delete Account ID: " + id + "?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        showNotification(json.message || "Account deleted", "success");
        loadAccounts();
      } else {
        showNotification(json.message || "Delete failed", "error");
      }
    } catch (err) {
      showNotification("Error: " + err.message, "error");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-badge">EXPERIMENT 5 · FSD-II</div>
        <h1>🏦 Banking Management System</h1>
        <p className="subtitle">
          React + Vite Frontend connected to Spring Boot Layered REST API (Controller → Service → Repository)
        </p>
        <div className="status-strip">
          <span className={`status-indicator ${backendOnline ? "online" : "offline"}`}></span>
          <span>{backendOnline ? "Backend Live on http://localhost:8080" : "Spring Boot Server Offline (Start mvn spring-boot:run)"}</span>
          <span className="student-tag">Student: Swayam Rawat</span>
        </div>
      </header>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="msg-icon">{message.type === "success" ? "✓" : "⚠️"}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid-layout">
        <section className="card">
          <h2>Create New Account</h2>
          <p className="card-desc">Validated via Jakarta Bean Validation in Spring Boot</p>
          <form onSubmit={createAccount} className="form-grid">
            <div className="form-group">
              <label>Account Number (10 digits)</label>
              <input
                placeholder="e.g. 1234567890"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Holder Name</label>
              <input
                placeholder="e.g. Swayam Rawat"
                value={form.holderName}
                onChange={(e) => setForm({ ...form, holderName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <select
                value={form.accountType}
                onChange={(e) => setForm({ ...form, accountType: e.target.value })}
              >
                <option value="SAVINGS">SAVINGS</option>
                <option value="CURRENT">CURRENT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Initial Balance (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="Opening balance"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              + Create Account
            </button>
          </form>
        </section>

        <section className="card card-wide">
          <div className="heading-row">
            <div>
              <h2>Bank Accounts Overview</h2>
              <p className="card-desc">Real-time balances from in-memory ConcurrentHashMap repository</p>
            </div>
            <div className="btn-group">
              <button className="btn-secondary" onClick={() => setShowTransferModal(true)}>
                ⇄ Transfer Funds
              </button>
              <button className="btn-secondary" onClick={loadAccounts}>
                ↻ Refresh
              </button>
            </div>
          </div>

          {accounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No active accounts found.</p>
              <span className="empty-sub">Create an account above or run the Postman collection to populate data.</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account No.</th>
                    <th>Holder Name</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td className="id-col">#{account.id}</td>
                      <td className="mono">{account.accountNumber}</td>
                      <td><strong>{account.holderName}</strong></td>
                      <td>
                        <span className={`pill ${account.accountType.toLowerCase()}`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="balance">₹ {Number(account.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="actions-cell">
                        <button className="btn-action deposit" onClick={() => deposit(account.id)}>+ Deposit</button>
                        <button className="btn-action withdraw" onClick={() => withdraw(account.id)}>- Withdraw</button>
                        <button className="btn-action danger" onClick={() => deleteAccount(account.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showTransferModal && (
        <div className="modal-backdrop" onClick={() => setShowTransferModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⇄ Inter-Account Transfer</h3>
              <button className="modal-close" onClick={() => setShowTransferModal(false)}>×</button>
            </div>
            <form onSubmit={handleTransfer} className="modal-form">
              <div className="form-group">
                <label>From Account (Source ID):</label>
                <select
                  value={transferForm.fromAccountId}
                  onChange={(e) => setTransferForm({ ...transferForm, fromAccountId: e.target.value })}
                  required
                >
                  <option value="">Select source account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.id} - {a.holderName} (₹{a.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>To Account (Destination ID):</label>
                <select
                  value={transferForm.toAccountId}
                  onChange={(e) => setTransferForm({ ...transferForm, toAccountId: e.target.value })}
                  required
                >
                  <option value="">Select destination account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.id} - {a.holderName} (₹{a.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Transfer Amount (₹):</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Amount to transfer"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
