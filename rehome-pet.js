// Reuse menu toggle and language modal logic from your main page
// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
const profileLi = document.getElementById('profileLi');

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
  localStorage.setItem('lang', lang);
  // Add translations for this page if needed
}

loadTranslations();

function updateAuthSection() {
  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');
  if (currentUser && token) {
    authSection.innerHTML = `
      <a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>
    `;
    profileLi.style.display = 'block';
    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    profileLi.style.display = 'none';
  }
}

updateAuthSection();

// Form handling
const rehomeForm = document.getElementById('rehomeForm');
const photoInput = document.getElementById('photos');
const photoPreview = document.getElementById('photoPreview');
const notification = document.getElementById('notification');
const phoneInput = document.getElementById('phone'); // ADDED
const costInput = document.getElementById('cost'); // ADDED
const currencySelect = document.getElementById('currency'); // ADDED

// ADDED: Phone number validation
// phoneInput.addEventListener('input', e => {
//   const value = e.target.value;
//   // Allow only +998 followed by digits and limit to 12 characters
//   // if (!value.startsWith('+998') || /[^0-18+]/.test(value)) {
//   //   e.target.value = '+998';
//   // }
//   // if (value.length > 18) {
//   //   e.target.value = value.slice(0, 18);
//   // }
// });

// ADDED: Ensure phone starts with +998 on page load
// phoneInput.value = '+998';

photoInput.addEventListener('change', () => {
  photoPreview.innerHTML = '';
  const files = photoInput.files;
  if (files.length > 5) {
    showNotification('You can upload a maximum of 5 photos.', 'error');
    photoInput.value = '';
    return;
  }
  Array.from(files).forEach(file => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    photoPreview.appendChild(img);
  });
});

rehomeForm.addEventListener('submit', async e => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    showNotification('Please log in to submit the form.', 'error');
    setTimeout(() => (window.location.href = 'login-page.html'), 2000);
    return;
  }

  const formData = new FormData(rehomeForm);
  const photos = photoInput.files;

  if (photos.length === 0) {
    showNotification('Please upload at least one photo.', 'error');
    return;
  }

  if (photos.length > 5) {
    showNotification('Maximum 5 photos allowed.', 'error');
    return;
  }

  // Append currency to formData (since backend doesn't expect it separately)
  formData.set('cost', `${formData.get('cost')} ${formData.get('currency')}`);
  formData.delete('cost'); // Remove standalone price
  formData.delete('currency'); // Remove standalone currency

  // Show loading modal
  const loadingModal = document.getElementById('loadingModal');
  const loadingOverlay = document.getElementById('loadingOverlay');

  loadingModal.style.display = 'block';
  loadingOverlay.style.display = 'block';

  try {
    const response = await fetch('http://localhost:5000/api/pets/rehoming', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    // Hide loading modal after response
    loadingModal.style.display = 'none';
    loadingOverlay.style.display = 'none';

    if (response.ok) {
      showNotification('Pet successfully added for rehoming!', 'success');
      rehomeForm.reset();
      phoneInput.value = '+998';
      photoPreview.innerHTML = '';
    } else {
      showNotification(result.message || 'Failed to submit form.', 'error');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    // Hide loading modal on error
    loadingModal.style.display = 'none';
    loadingOverlay.style.display = 'none';
    showNotification('An error occurred. Please try again.', 'error');
  }

  // try {
  //   const response = await fetch('http://localhost:5000/api/pets/rehoming', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`, // Send JWT token
  //     },
  //     body: formData, // Send FormData with files and fields
  //   });

  //   const result = await response.json();

  //   if (response.ok) {
  //     showNotification('Pet successfully added for rehoming!', 'success');
  //     rehomeForm.reset();
  //     // phoneInput.value = '+998'; // Reset phone to +998
  //     photoPreview.innerHTML = '';
  //   } else {
  //     showNotification(result.message || 'Failed to submit form.', 'error');
  //   }
  // } catch (error) {
  //   console.error('Error submitting form:', error);
  //   showNotification('An error occurred. Please try again.', 'error');
  // }
});
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// ScrollReveal animations
const scrollRevealOption = {
  distance: '50px',
  origin: 'top',
  duration: 1000,
};

ScrollReveal().reveal('.rehome__header', {
  ...scrollRevealOption,
  delay: 300,
});

ScrollReveal().reveal('.rehome__form', {
  ...scrollRevealOption,
  delay: 500,
});
