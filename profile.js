// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

const token = localStorage.getItem('token');

function closeMenu() {
  navLinks.classList.remove('open');
  menuBtnIcon.setAttribute('class', 'ri-menu-line');
  overlay.classList.add('hidden');
}

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
});

// Modal handling
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.close-modal');
const btnShowModal = document.querySelector('.show-modal');

btnShowModal.addEventListener('click', function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

overlay.addEventListener('click', () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

// Language translations
let languages = {};

async function loadTranslations() {
  try {
    const response = await fetch('languages.json');
    if (!response.ok) throw new Error('Failed to load languages.json');
    languages = await response.json();
    const savedLang = localStorage.getItem('lang') || 'en';
    changeLanguage(savedLang);
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
}

function changeLanguage(lang) {
  if (!languages[lang]) return;

  const elements = {
    chooselang: document.getElementById('chooselang'),
    logoutBtn: document.getElementById('logoutBtn'),
    profileTitle: document.getElementById('profileTitle'),
    profileNameLabel: document.getElementById('profileNameLabel'),
    profileSurnameLabel: document.getElementById('profileSurnameLabel'),
    profileEmailLabel: document.getElementById('profileEmailLabel'),
    changePassword: document.getElementById('changePassword'),
    changePasswordTitle: document.getElementById('changePasswordTitle'),
    submitPasswordChange: document.getElementById('submitPasswordChange'),
  };

  document.getElementById('oldPassword').placeholder =
    languages[lang].oldPassword;
  document.getElementById('newPassword').placeholder =
    languages[lang].newPassword;
  document.getElementById('confirmNewPassword').placeholder =
    languages[lang].confirmNewPassword;

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  localStorage.setItem('lang', lang);
}

loadTranslations();

// Profile data handling
// function updateProfile() {
//   const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
//   const token = localStorage.getItem('token');

//   if (currentUser && token) {
//     document.getElementById('profileNameValue').textContent = `
//       ${currentUser.name}`;
//     document.getElementById('profileSurnameValue').textContent = `
//       ${currentUser.surname}`;
//     document.getElementById(
//       'profileEmailValue'
//     ).textContent = `${currentUser.email}`;
//   } else {
//     window.location.href = 'index.html'; // Redirect if not logged in
//   }
// }

// Profile data fetching from backend
async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html'; // Redirect if not logged in
    return;
  }

  try {
    const response = await fetch('http://localhost:10000/api/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'index.html'; // Token invalid/expired
      }
      throw new Error('Failed to fetch profile');
    }

    const user = await response.json();
    document.getElementById('profileNameValue').textContent =
      user.name || 'Not available';
    document.getElementById('profileSurnameValue').textContent =
      user.surname || 'Not available';
    document.getElementById('profileEmailValue').textContent =
      user.email || 'Not available';
  } catch (error) {
    console.error('Error fetching profile:', error);
    alert('Unable to load profile. Please try again later.');
  }
}

// Initial setup
fetchProfile();

// Change password modal handling
const passwordModal = document.querySelector('.password-modal');
const btnClosePasswordModal = passwordModal.querySelector('.close-modal');
const btnChangePassword = document.getElementById('changePassword');
const changePasswordForm = document.getElementById('changePasswordForm');
const passwordError = document.getElementById('passwordError');

btnChangePassword.addEventListener('click', () => {
  passwordModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

btnClosePasswordModal.addEventListener('click', () => {
  passwordModal.classList.add('hidden');
  overlay.classList.add('hidden');
  passwordError.style.display = 'none';
});

console.log('Sending password change request with:', {
  oldPassword,
  newPassword,
  token,
});

// Toggle password visibility and handle Arrow Down/Focus
const passwordInputs = document.querySelectorAll('.password-container input');
const toggleIcons = document.querySelectorAll('.toggle-password');

function resetPasswordVisibility(excludeInputId) {
  toggleIcons.forEach(icon => {
    const inputId = icon.getAttribute('data-target');
    if (inputId !== excludeInputId) {
      const input = document.getElementById(inputId);
      input.type = 'password';
      icon.classList.add('ri-eye-line');
      icon.classList.remove('ri-eye-off-line');
    }
  });
}

toggleIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const inputId = icon.getAttribute('data-target');
    const input = document.getElementById(inputId);
    const isPasswordVisible = input.type === 'text';

    input.type = isPasswordVisible ? 'password' : 'text';
    icon.classList.toggle('ri-eye-line', isPasswordVisible);
    icon.classList.toggle('ri-eye-off-line', !isPasswordVisible);
  });
});

passwordInputs.forEach((input, index) => {
  // Arrow Down to next input
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < passwordInputs.length) {
        passwordInputs[nextIndex].focus();
      }
    }
  });

  // Reset eye icon on focus change
  input.addEventListener('focus', () => {
    resetPasswordVisibility(input.id);
  });
});

changePasswordForm.addEventListener('submit', async e => {
  e.preventDefault();

  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword =
    document.getElementById('confirmNewPassword').value;
  const token = localStorage.getItem('token');
  const currentLang = localStorage.getItem('lang') || 'en';

  // if (oldPassword !== currentUser.password) {
  //   passwordError.textContent =
  //     languages[currentLang].wrongOldPassword || 'Incorrect old password';
  //   passwordError.style.display = 'block';
  //   return;
  // }

  if (newPassword !== confirmNewPassword) {
    passwordError.textContent =
      languages[currentLang].passwordMismatch || 'New passwords do not match';
    passwordError.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:10000/api/auth/change-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({oldPassword, newPassword}),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      passwordError.textContent = result.message || 'Password change failed';
      passwordError.style.display = 'block';
      return;
    }

    // Success – close modal and show success alert
    alert(
      languages[currentLang].passwordChangeSuccess ||
        'Password updated successfully'
    );
    passwordModal.classList.add('hidden');
    overlay.classList.add('hidden');
    passwordError.style.display = 'none';
    changePasswordForm.reset();
  } catch (error) {
    console.error('Error changing password:', error);
    passwordError.textContent = 'Something went wrong. Please try again.';
    passwordError.style.display = 'block';
  }

  // Update password in localStorage
  // currentUser.password = newPassword;
  // const users = JSON.parse(localStorage.getItem('users')) || [];
  // const userIndex = users.findIndex(u => u.email === currentUser.email);
  // if (userIndex !== -1) {
  //   users[userIndex].password = newPassword;
  //   localStorage.setItem('users', JSON.stringify(users));
  // }
  // localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Close modal and reset form
  passwordModal.classList.add('hidden');
  overlay.classList.add('hidden');
  passwordError.style.display = 'none';
  changePasswordForm.reset();
});

overlay.addEventListener('click', () => {
  passwordModal.classList.add('hidden');
  overlay.classList.add('hidden');
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

// Initial setup
// updateProfile();
