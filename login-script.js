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

// Load users from localStorage (for demo purposes)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to toggle form fields visibility
function toggleFormFields() {
  const signupFields = document.querySelectorAll('.signup-only');
  signupFields.forEach(field => {
    field.style.display = isLogin ? 'none' : 'block';
    field.required = !isLogin; // Make fields required only for signup
  });
}

// Initial call to set correct field visibility
toggleFormFields();

// Toggle between login and sign-up
toggleLink.addEventListener('click', e => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Log In' : 'Sign Up';
  submitBtn.textContent = isLogin ? 'Log In' : 'Sign Up';
  toggleText.textContent = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';
  toggleLink.textContent = isLogin ? 'Sign Up' : 'Log In';
  errorMsg.style.display = 'none';
  toggleFormFields(); // Show/hide signup fields
});

// Handle form submission
authForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isLogin) {
    // Login logic
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      errorMsg.textContent = 'Invalid email or password';
      errorMsg.style.display = 'block';
    }
  } else {
    // Sign-up logic
    const name = nameInput.value;
    const surname = surnameInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (password !== confirmPassword) {
      errorMsg.textContent = 'Passwords do not match';
      errorMsg.style.display = 'block';
      return;
    }

    if (users.some(u => u.email === email)) {
      errorMsg.textContent = 'Email already exists';
      errorMsg.style.display = 'block';
    } else {
      const newUser = {name, surname, email, password};
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      window.location.href = 'index.html'; // Redirect to home page
    }
  }
});

// Check if user is already logged in
if (localStorage.getItem('currentUser')) {
  window.location.href = 'index.html';
}

// Fetch translations from languages.json
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

  // Update text content based on language
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

  // Update placeholders (optional, if you want them translated)
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

// Load translations when the page loads
loadTranslations();
