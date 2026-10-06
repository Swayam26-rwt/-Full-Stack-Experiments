const express = require("express");
const cors = require("cors");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Correlation-ID"]
}));

// Correlation ID middleware
app.use((req, res, next) => {
  const correlationId = req.headers["x-correlation-id"] || randomUUID();
  req.correlationId = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
});

// Logging middleware / filter equivalent
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `Request: ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${Date.now() - start} ms | CID: ${req.correlationId}`
    );
  });
  next();
});

// In-Memory Bank Accounts Storage
const accounts = new Map();
let nextId = 1;

// Seed initial demo accounts
accounts.set(1, {
  id: 1,
  accountNumber: "1234567890",
  holderName: "Swayam Rawat",
  accountType: "SAVINGS",
  balance: 6500.0
});
accounts.set(2, {
  id: 2,
  accountNumber: "9876543210",
  holderName: "Rahul Verma",
  accountType: "CURRENT",
  balance: 4000.0
});
nextId = 3;

function success(res, code, message, data = null) {
  return res.status(code).json({
    status: "success",
    message,
    data
  });
}

function failure(res, code, message, data = null) {
  return res.status(code).json({
    status: "error",
    message,
    data
  });
}

const router = express.Router();

// GET all accounts
router.get("/accounts", (req, res) => {
  return success(res, 200, "Accounts fetched", Array.from(accounts.values()));
});

// GET account by ID
router.get("/accounts/:id", (req, res) => {
  const id = Number(req.params.id);
  const account = accounts.get(id);
  if (!account) {
    return failure(res, 404, `Account not found: ${id}`, null);
  }
  return success(res, 200, "Account fetched", account);
});

// POST create account
router.post("/accounts", (req, res) => {
  const { accountNumber, holderName, accountType, balance } = req.body || {};
  const errors = [];

  if (!accountNumber || !/^\d{10}$/.test(accountNumber)) {
    errors.push("accountNumber: Account number must contain exactly 10 digits");
  }
  if (!holderName || holderName.trim().length < 2 || holderName.trim().length > 50) {
    errors.push("holderName: Holder name is required (2-50 characters)");
  }
  if (!accountType || !["SAVINGS", "CURRENT"].includes(accountType)) {
    errors.push("accountType: Account type must be SAVINGS or CURRENT");
  }
  if (balance === undefined || balance === null || Number(balance) < 0) {
    errors.push("balance: Balance cannot be negative");
  }

  if (errors.length > 0) {
    return failure(res, 400, "Validation failed", errors.join(", "));
  }

  // Check duplicate
  for (const a of accounts.values()) {
    if (a.accountNumber === accountNumber) {
      return failure(res, 400, "Account number already exists", null);
    }
  }

  const newAccount = {
    id: nextId++,
    accountNumber,
    holderName: holderName.trim(),
    accountType,
    balance: Number(balance)
  };
  accounts.set(newAccount.id, newAccount);
  return success(res, 201, "Account created", newAccount);
});

// PUT update account
router.put("/accounts/:id", (req, res) => {
  const id = Number(req.params.id);
  const account = accounts.get(id);
  if (!account) {
    return failure(res, 404, `Account not found: ${id}`, null);
  }

  const { accountNumber, holderName, accountType, balance } = req.body || {};
  if (!accountNumber || !holderName) {
    return failure(res, 400, "Validation failed", "Missing required fields");
  }

  account.accountNumber = accountNumber;
  account.holderName = holderName;
  account.accountType = accountType || account.accountType;
  account.balance = balance !== undefined ? Number(balance) : account.balance;

  return success(res, 200, "Account updated", account);
});

// DELETE account
router.delete("/accounts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!accounts.has(id)) {
    return failure(res, 404, `Account not found: ${id}`, null);
  }
  accounts.delete(id);
  return success(res, 200, "Account deleted", null);
});

// POST deposit
router.post("/accounts/:id/deposit", (req, res) => {
  const id = Number(req.params.id);
  const account = accounts.get(id);
  if (!account) {
    return failure(res, 404, `Account not found: ${id}`, null);
  }
  const amount = Number(req.body?.amount);
  if (!amount || amount <= 0) {
    return failure(res, 400, "Deposit amount must be greater than zero", null);
  }

  account.balance += amount;
  return success(res, 200, "Deposit successful", account);
});

// POST withdraw
router.post("/accounts/:id/withdraw", (req, res) => {
  const id = Number(req.params.id);
  const account = accounts.get(id);
  if (!account) {
    return failure(res, 404, `Account not found: ${id}`, null);
  }
  const amount = Number(req.body?.amount);
  if (!amount || amount <= 0) {
    return failure(res, 400, "Withdrawal amount must be greater than zero", null);
  }
  if (account.balance < amount) {
    return failure(res, 400, "Insufficient balance", null);
  }

  account.balance -= amount;
  return success(res, 200, "Withdrawal successful", account);
});

// POST transfer
router.post("/accounts/transfer", (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body || {};
  if (fromAccountId === toAccountId) {
    return failure(res, 400, "Source and destination accounts must be different", null);
  }
  const from = accounts.get(Number(fromAccountId));
  const to = accounts.get(Number(toAccountId));
  if (!from || !to) {
    return failure(res, 404, "One or both accounts not found", null);
  }
  const amt = Number(amount);
  if (!amt || amt <= 0) {
    return failure(res, 400, "Transfer amount must be greater than zero", null);
  }
  if (from.balance < amt) {
    return failure(res, 400, "Insufficient balance", null);
  }

  from.balance -= amt;
  to.balance += amt;
  return success(res, 200, "Transfer successful", null);
});

app.use("/api", router);

// Serve frontend build from frontend/dist
const distPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return failure(res, 404, "API endpoint not found", null);
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("Banking Management System — Swayam Rawat");
    }
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
