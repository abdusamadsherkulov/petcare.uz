const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const errorMsg = document.getElementById('errorMsg');
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const confirmPasswordInput = document.getElementById('confirmPassword');
let isLogin = true;
const API_URL = 'https://petcare-backend-h0cq.onrender.com/api/auth';

let users = JSON.parse(localStorage.getItem('users')) || [];

function toggleFormFields() {
  const signupFields = document.querySelectorAll('.signup-only');
  signupFields.forEach(field => {
    field.style.display = isLogin ? 'none' : 'block';
    field.required = !isLogin;
  });
}

toggleFormFields();

toggleLink.addEventListener('click', e => {
  e.preventDefault();
  isLogin = !isLogin;
  const currentLang = localStorage.getItem('lang') || 'en';
  formTitle.textContent = isLogin
    ? languages[currentLang].formTitle
    : languages[currentLang].signup;
  submitBtn.textContent = isLogin
    ? languages[currentLang].formTitle
    : languages[currentLang].signup;
  toggleText.textContent = isLogin
    ? languages[currentLang].toggleText
    : languages[currentLang].toggleTextAlt;

  toggleLink.textContent = isLogin
    ? languages[currentLang].toggleLink
    : languages[currentLang].formTitle;
  errorMsg.style.display = 'none';
  toggleFormFields();
});

authForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isLogin) {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'index.html';
    } else {
      errorMsg.textContent = data.message || 'Invalid email or password';
      errorMsg.style.display = 'block';
    }
  } else {
    const name = nameInput.value;
    const surname = surnameInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match';
      errorMsg.style.display = 'block';
      return;
    }

    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, surname, email, password}),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user)); // Store user data
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      errorMsg.textContent = data.message || 'Error during registration';
      errorMsg.style.display = 'block';
    }
  }
});

const currentUser = localStorage.getItem('currentUser');
const token = localStorage.getItem('token');

if (localStorage.getItem('currentUser')) {
  window.location.href = 'index.html';
}

async function loadTranslations() {
  try {
    const response = await fetch('languages.json');
    if (!response.ok) throw new Error('Failed to load languages.json');
    languages = await response.json();
    const savedLang = localStorage.getItem('lang') || 'en';
    updateLanguage(savedLang);
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
}

function updateLanguage(lang = localStorage.getItem('lang') || 'en') {
  if (!languages[lang]) {
    console.error(`Language ${lang} not found in translations`);
    return;
  }

  const elements = {
    formTitle: formTitle,
    submitBtn: submitBtn,
    toggleText: toggleText,
    toggleLink: toggleLink,
    errorMsg: errorMsg,
  };

  elements.formTitle.textContent = isLogin
    ? languages[lang].formTitle
    : languages[lang].signup || 'Sign Up';
  elements.submitBtn.textContent = isLogin
    ? languages[lang].formTitle
    : languages[lang].signup || 'Sign Up';
  elements.toggleText.textContent = isLogin
    ? languages[lang].toggleText || "Don't have an account?"
    : languages[lang].toggleTextAlt || 'Already have an account?';
  elements.toggleLink.textContent = isLogin
    ? languages[lang].toggleLink || 'Sign Up'
    : languages[lang].login || 'Log In';
  elements.errorMsg.textContent =
    languages[lang].errorMsg || 'Invalid email or password';

  document.getElementById('name').placeholder = languages[lang].name || 'Name';
  document.getElementById('surname').placeholder =
    languages[lang].surname || 'Surname';
  document.getElementById('email').placeholder =
    languages[lang].email || 'Email';
  document.getElementById('password').placeholder =
    languages[lang].password || 'Password';
  document.getElementById('confirmPassword').placeholder =
    languages[lang].confirmPassword || 'Confirm Password';
}

loadTranslations();

document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', function () {
    const targetId = this.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.classList.remove('ri-eye-line');
      this.classList.add('ri-eye-off-line');
    } else {
      passwordInput.type = 'password';
      this.classList.remove('ri-eye-off-line');
      this.classList.add('ri-eye-line');
    }
  });
});
