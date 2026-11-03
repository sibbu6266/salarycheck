const currentEmail = localStorage.getItem("ef_current");

if (!currentEmail) {
    window.location.href = "login.html";
}

const users = JSON.parse(localStorage.getItem("ef_users") || "[]");
const currentUser = users.find(user => user.email === currentEmail);

if (!currentUser) {
    localStorage.removeItem("ef_current");
    window.location.href = "login.html";
}

const storageKey = "ef_transactions_" + currentEmail;

let transactions = JSON.parse(localStorage.getItem(storageKey) || "[]");

const welcomeName = document.getElementById("welcomeName");
const userAvatar = document.getElementById("userAvatar");

welcomeName.textContent = "Welcome, " + currentUser.name;
userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();

function saveTransactions() {
    localStorage.setItem(storageKey, JSON.stringify(transactions));
}

function formatMoney(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }
    });

    const balance = income - expense;

    document.getElementById("totalIncome").textContent = formatMoney(income);
    document.getElementById("totalExpense").textContent = formatMoney(expense);
    document.getElementById("totalBalance").textContent = formatMoney(balance);

    const total = income + expense;
    const incomePercent = total ? (income / total) * 100 : 0;
    const expensePercent = total ? (expense / total) * 100 : 0;

    document.getElementById("incomeBar").style.width = incomePercent + "%";
    document.getElementById("expenseBar").style.width = expensePercent + "%";

    document.getElementById("incomePercent").textContent =
        Math.round(incomePercent) + "%";

    document.getElementById("expensePercent").textContent =
        Math.round(expensePercent) + "%";

    renderTransactions();
}

function renderTransactions() {
    const list = document.getElementById("transactionList");
    const emptyMessage = document.getElementById("emptyMessage");

    list.innerHTML = "";

    if (transactions.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    transactions.slice().reverse().forEach(transaction => {
        const row = document.createElement("tr");

        const title = document.createElement("td");
        title.textContent = transaction.title;

        const date = document.createElement("td");
        date.textContent = transaction.date;

        const type = document.createElement("td");
        type.textContent = transaction.type;
        type.className = transaction.type === "income" ?
            "type-income" : "type-expense";

        const amount = document.createElement("td");
        amount.textContent =
            (transaction.type === "income" ? "+" : "-") +
            formatMoney(transaction.amount);

        const action = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            transactions = transactions.filter(item => item.id !== transaction.id);
            saveTransactions();
            updateDashboard();
        });

        action.appendChild(deleteButton);

        row.append(title, date, type, amount, action);
        list.appendChild(row);
    });
}

const transactionForm = document.getElementById("transactionForm");

document.getElementById("transactionDate").value =
    new Date().toISOString().split("T")[0];

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("transactionTitle").value.trim();
    const amount = Number(document.getElementById("transactionAmount").value);
    const type = document.getElementById("transactionType").value;
    const date = document.getElementById("transactionDate").value;

    if (!title || amount <= 0 || !date) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push({
        id: Date.now(),
        title,
        amount,
        type,
        date
    });

    saveTransactions();
    transactionForm.reset();

    document.getElementById("transactionDate").value =
        new Date().toISOString().split("T")[0];

    updateDashboard();
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("ef_current");
    window.location.href = "login.html";
});

updateDashboard();