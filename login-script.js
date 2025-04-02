//Oauth
const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const errorMsg = document.getElementById('errorMsg');
let isLogin = true;

// Load users from localStorage (for demo purposes)
let users = JSON.parse(localStorage.getItem('users')) || [];

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
      errorMsg.style.display = 'block';
    }
  } else {
    // Sign-up logic
    if (users.some(u => u.email === email)) {
      errorMsg.textContent = 'Email already exists';
      errorMsg.style.display = 'block';
    } else {
      const newUser = {email, password};
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

//here's my login page code now explain it again. if user has already signed in with google account he may log in with google account if he's not the page should ask him to sign in first. and if user doesn't sign in with google account, his login password information should be keeped in somewhere, so when he next time logs in there won't be problem. and after logging
