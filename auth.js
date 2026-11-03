function getUsers() {
    return JSON.parse(localStorage.getItem("ef_users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("ef_users", JSON.stringify(users));
}

function showMessage(message, success = false) {
    const element = document.getElementById("authMessage");

    if (element) {
        element.textContent = message;
        element.style.color = success ? "#16a879" : "#e85b70";
    }
}

// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            showMessage("This email is already registered.");
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);

        showMessage("Account created successfully! Redirecting...", true);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();
        const user = users.find(item =>
            item.email === email && item.password === password
        );

        if (!user) {
            showMessage("Invalid email or password.");
            return;
        }

        localStorage.setItem("ef_current", user.email);

        showMessage("Login successful!", true);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    });
}

// Forgot password
const resetForm = document.getElementById("resetForm");

if (resetForm) {
    resetForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("resetEmail").value.trim().toLowerCase();
        const password = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        const users = getUsers();
        const user = users.find(item => item.email === email);

        if (!user) {
            showMessage("Email not registered.");
            return;
        }

        user.password = password;
        saveUsers(users);

        showMessage("Password updated successfully!", true);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

// Show / Hide password
document.querySelectorAll(".show-password").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(this.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            this.textContent = "Hide";
        } else {
            input.type = "password";
            this.textContent = "Show";
        }
    });
});