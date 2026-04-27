const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("passwordStrength");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const form = document.querySelector("form");

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    if (password.length === 0) {
        strengthText.textContent = "";
        return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = "";
    let color = "";

    if (password.length >= 8 && hasUpper && hasNumber && hasSymbol) {
        strength = "Strong";
        color = "green";
    } else if (password.length >= 6 && hasUpper && hasNumber) {
        strength = "Medium";
        color = "orange";
    } else {
        strength = "Weak";
        color = "red";
    }

    strengthText.textContent = strength;
    strengthText.style.color = color;
});

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    if (isPassword) {
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstname = document.getElementById('first-name').value.trim();
  const lastname = document.getElementById('last-name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone1 = document.getElementById('phone1').value.trim();
  const phone2 = document.getElementById('phone2').value.trim();
  const address = document.getElementById('address').value.trim();
  const password = document.getElementById('password').value;
  const confirmpassword = password; 

  if (!firstname || !lastname || !username || !email || !phone1 || !phone2 || !address) {
    alert('Please fill in all required fields!');
    return;
  }

  if (strengthText.textContent === 'Weak') {
    alert('Password is too weak. Please choose a stronger password.');
    return;
  }

  const formData = new FormData();
  formData.append('action', 'signup');
  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('username', username);
  formData.append('email', email);
  formData.append('phone1', phone1);    
  formData.append('phone2', phone2);  
  formData.append('address', address);       
  formData.append('password', password);
  

  try {
    const res = await fetch('../api.php', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.status === 'success') {
      alert(data.message || 'Account created successfully.');
      window.location.href = '../login/login.html';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (e2) {
    alert('Server error. Please try again later.');
  }
});

$(document).ready(function() {
   
    $("form, #passwordStrength").hide().fadeIn(800);

    $("input").focus(function() {
        $(this).css("outline", "2px solid #007BFF");
    }).blur(function() {
        $(this).css("outline", "none");
    });

    
    $(form).submit(function() {
        if (strengthText.textContent === "Weak") {
            $(form).fadeOut(50).fadeIn(50); 
        }
    });
});