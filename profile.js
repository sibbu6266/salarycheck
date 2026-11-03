const email = localStorage.getItem("ef_current");

if (!email) {
    window.location.href = "login.html";
}

const users = JSON.parse(localStorage.getItem("ef_users") || "[]");
const currentUser = users.find(user => user.email === email);

if (!currentUser) {
    localStorage.removeItem("ef_current");
    window.location.href = "login.html";
}

const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const profileForm = document.getElementById("profileForm");
const message = document.getElementById("profileMessage");

nameInput.value = currentUser.name;
emailInput.value = currentUser.email;

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newName = nameInput.value.trim();

    if (!newName) {
        message.textContent = "Please enter your name.";
        return;
    }

    currentUser.name = newName;
    localStorage.setItem("ef_users", JSON.stringify(users));

    message.style.color = "#16a879";
    message.textContent = "Profile updated successfully!";
});