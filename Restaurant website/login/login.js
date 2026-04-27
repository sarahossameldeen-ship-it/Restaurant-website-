const loginForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const popup = document.createElement("div");
popup.id = "popupMessage";
popup.className = "popup hidden";
popup.innerHTML = `
    <div class="popup-content">
        <p id="popupText">Message</p>
        <button id="popupOkBtn">OK</button>
    </div>
`;

document.body.appendChild(popup);

function showMessage(message, redirectUrl) {
    const popupTextEl = document.getElementById("popupText");
    const popupEl = document.getElementById("popupMessage");
    const okBtn = document.getElementById("popupOkBtn");

    if (popupTextEl) popupTextEl.innerText = message;
    if (popupEl) popupEl.classList.remove("hidden");

    if (okBtn) {
        okBtn.onclick = function() {
            closeMessage();
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        };
    }
}

function closeMessage() {
    const popupEl = document.getElementById("popupMessage");
    const okBtn = document.getElementById("popupOkBtn");
    if (okBtn) okBtn.onclick = null;
    if (popupEl) popupEl.classList.add("hidden");
}

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = usernameInput.value.trim();  
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage('Please fill in all fields!');
    return;
  }

  const formData = new FormData();
  formData.append('action', 'login');
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch('../api.php', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (data.status === 'success') {
      showMessage(data.message || 'Login successful!', '../user/user.html');
    } else {
      showMessage(data.message || 'Login failed.');
    }
  } catch (err) {
    showMessage('Server error. Please try again later.');
  }
});

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    if(isPassword){
        eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <circle cx="12" cy="12" r="3"></circle>
        `;
    } else {
        eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const accountBtn = document.getElementById("accountBtn");

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
      loginBtn.classList.add("hidden");
      accountBtn.classList.remove("hidden");
  } else {
      loginBtn.classList.remove("hidden");
      accountBtn.classList.add("hidden");
  }
});

$(document).ready(function () {

    function showMessageJQ(message, redirectUrl) {
        $("#popupText").text(message);
        $("#popupMessage").fadeIn(200);

        $("#popupOkBtn").off("click").on("click", function() {
            $("#popupMessage").fadeOut(200, function() {
                if (redirectUrl) window.location.href = redirectUrl;
            });
        });
    }

    $("#togglePassword").on("click", function() {
        const $pw = $("#password");
        const isPassword = $pw.attr("type") === "password";
        $pw.attr("type", isPassword ? "text" : "password");

        const $icon = $("#eyeIcon");
        if (isPassword) {
            $icon.html(`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <circle cx="12" cy="12" r="3"></circle>
            `);
        } else {
            $icon.html(`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `);
        }
    });

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn) {
        $("#loginBtn").addClass("hidden");
        $("#accountBtn").removeClass("hidden");
    } else {
        $("#loginBtn").removeClass("hidden");
        $("#accountBtn").addClass("hidden");
    }

  
});
