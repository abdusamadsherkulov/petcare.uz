// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
const shoppingCartLi = document.getElementById('shoppingCartLi');

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

// Profile data fetching from backend
async function fetchProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/auth/profile',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
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
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < passwordInputs.length) {
        passwordInputs[nextIndex].focus();
      }
    }
  });

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

  if (newPassword !== confirmNewPassword) {
    passwordError.textContent =
      languages[currentLang].passwordMismatch || 'New passwords do not match';
    passwordError.style.display = 'block';
    return;
  }

  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/auth/change-password',
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
// document.getElementById('logoutBtn').addEventListener('click', e => {
//   e.preventDefault();
//   localStorage.removeItem('currentUser');
//   localStorage.removeItem('token');
//   window.location.href = 'index.html';
// });

async function fetchAndDisplayPets() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/pets/my-pets',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pets');
    }

    const pets = await response.json();
    const petGrid = document.getElementById('yourPetsGrid');
    petGrid.innerHTML = ''; // Clear existing content

    pets.forEach(pet => {
      const firstPhoto =
        pet.photos && pet.photos.length > 0
          ? `https://petcare-backend-h0cq.onrender.com/proxy-image?url=${encodeURIComponent(
              pet.photos[0]
            )}`
          : '';
      console.log('Pet:', pet.name, 'Photo URL:', firstPhoto);
      const petCard = document.createElement('div');
      petCard.classList.add('pet__card');
      petCard.innerHTML = `
        ${
          firstPhoto
            ? `<img src="${firstPhoto}" alt="${pet.name}" loading="lazy" onerror="console.log('Image failed: ${firstPhoto}');this.nextSibling.style.display='block';this.style.display='none';"><p style="display:none;">No photo available</p>`
            : '<p>No photo available</p>'
        }
        <h3>${pet.name}</h3>
        <p>Species: ${pet.species}</p>
        <p>Age: ${pet.age}</p>
        <p>Cost: ${pet.cost}</p>
        <div class="button-container">
          <button class="edit-button" data-pet-id="${pet._id}">
            <svg class="edit-svgIcon" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </button>
          <button class="bin-button" data-pet-id="${pet._id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 39 7" class="bin-top">
              <line stroke-width="4" stroke="white" y2="5" x2="39" y1="5"></line>
              <line stroke-width="3" stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1="12"></line>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" class="bin-bottom">
              <mask fill="white" id="path-1-inside-1_8_19">
                <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
              </mask>
              <path mask="url(#path-1-inside-1_8_19)" fill="white" d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"></path>
              <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
              <path stroke-width="4" stroke="white" d="M21 6V29"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 89 80" class="garbage">
              <path fill="white" d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"></path>
            </svg>
          </button>
        </div>
      `;
      petGrid.appendChild(petCard);
    });

    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const overlay = document.querySelector('.overlay');
    let petIdToDelete = null;
    let isDeleting = false;

    document.querySelectorAll('.bin-button').forEach(button => {
      button.addEventListener('click', () => {
        if (isDeleting) return;
        petIdToDelete = button.getAttribute('data-pet-id');
        deleteModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
      });
    });

    confirmDeleteBtn.addEventListener('click', async () => {
      if (isDeleting) return;
      isDeleting = true;
      try {
        console.log('Attempting to delete pet with ID:', petIdToDelete);
        const deleteResponse = await fetch(
          `https://petcare-backend-h0cq.onrender.com/api/pets/delete/${petIdToDelete}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await deleteResponse.json();
        console.log('Delete response:', deleteResponse.status, result);

        if (!deleteResponse.ok) {
          throw new Error(result.message || 'Unknown error');
        }

        alert('Pet deleted successfully');
        deleteModal.classList.add('hidden');
        overlay.classList.add('hidden');
        fetchAndDisplayPets();
      } catch (error) {
        console.error('Error deleting pet:', error.message);
        alert(`Failed to delete pet: ${error.message}. Please try again.`);
        deleteModal.classList.add('hidden');
        overlay.classList.add('hidden');
      } finally {
        isDeleting = false;
        petIdToDelete = null;
      }
    });

    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.add('hidden');
      overlay.classList.add('hidden');
      petIdToDelete = null;
    });

    overlay.addEventListener('click', () => {
      deleteModal.classList.add('hidden');
      overlay.classList.add('hidden');
      petIdToDelete = null;
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    alert('Unable to load your pets. Please try again later.');
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    fetchProfile();
    fetchAndDisplayPets();
  },
  {once: true}
);

function updateAuthSection() {
  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');
  if (currentUser && token) {
    authSection.innerHTML = `
      <a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>
    `;
    shoppingCartLi.style = 'display: block';

    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    shoppingCartLi.style = 'display: none';
  }
}

updateAuthSection();
