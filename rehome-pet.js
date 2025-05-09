const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
const profileLi = document.getElementById('profileLi');
const savedLang = localStorage.getItem('lang');

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
  if (!languages[lang]) {
    console.error(`Language ${lang} not found in translations`);
    return;
  }

  const elements = {
    login: document.getElementById('login'),
    rehomeAPet: document.getElementById('rehomeAPet'),
    logoutBtn: document.getElementById('logoutBtn'),
    rehomeAPetForm: document.getElementById('rehomeAPetForm'),
    rehomeAPetFormDesc: document.getElementById('rehomeAPetFormDesc'),
    petName: document.getElementById('petName'),
    petSpecies: document.getElementById('petSpecies'),
    selectSpecies: document.getElementById('selectSpecies'),
    dogOption: document.getElementById('dogOption'),
    catOption: document.getElementById('catOption'),
    birdOption: document.getElementById('birdOption'),
    otherOption: document.getElementById('otherOption'),
    petBreed: document.getElementById('petBreed'),
    petAge: document.getElementById('petAge'),
    selectAge: document.getElementById('selectAge'),
    petHealthCondition: document.getElementById('petHealthCondition'),
    selectHealth: document.getElementById('selectHealth'),
    reasonRehoming: document.getElementById('reasonRehoming'),
    healthyVaccinatedOption: document.getElementById('healthyVaccinatedOption'),
    healthyNotVaccinatedOption: document.getElementById(
      'healthyNotVaccinatedOption'
    ),
    notHealthyVaccinatedOption: document.getElementById(
      'notHealthyVaccinatedOption'
    ),
    notHealthyNotVaccinatedOption: document.getElementById(
      'notHealthyNotVaccinatedOption'
    ),
    selectReason: document.getElementById('selectReason'),
    allergiesOption: document.getElementById('allergiesOption'),
    movingOption: document.getElementById('movingOption'),
    financialOption: document.getElementById('financialOption'),
    deathOfOwnerOption: document.getElementById('deathOfOwnerOption'),
    incompatibilityOption: document.getElementById('incompatibilityOption'),
    timeOption: document.getElementById('timeOption'),
    lblCost: document.getElementById('lblCost'),
    lblLocation: document.getElementById('lblLocation'),
    selectRegion: document.getElementById('selectRegion'),
    tashkent: document.getElementById('tashkent'),
    andijan: document.getElementById('andijan'),
    bukhara: document.getElementById('bukhara'),
    fergana: document.getElementById('fergana'),
    jizzakh: document.getElementById('jizzakh'),
    namangan: document.getElementById('namangan'),
    navoi: document.getElementById('navoi'),
    kashkadarya: document.getElementById('kashkadarya'),
    samarkand: document.getElementById('samarkand'),
    syrdarya: document.getElementById('syrdarya'),
    surkhandarya: document.getElementById('surkhandarya'),
    tashkentRegion: document.getElementById('tashkentRegion'),
    khorezm: document.getElementById('khorezm'),
    karakalpakstan: document.getElementById('karakalpakstan'),
    lblPhone: document.getElementById('lblPhone'),
    lblPhotos: document.getElementById('lblPhotos'),
  };

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  const placeholderElements = {
    health: document.getElementById('health'),
    location: document.getElementById('location'),
  };

  Object.keys(placeholderElements).forEach(key => {
    if (placeholderElements[key] && languages[lang][key]?.placeholder) {
      placeholderElements[key].placeholder = languages[lang][key].placeholder;
    }
  });

  localStorage.setItem('lang', lang);
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
const phoneInput = document.getElementById('phone');
const costInput = document.getElementById('cost');
const currencySelect = document.getElementById('currency');

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

  formData.set('cost', `${formData.get('cost')} ${formData.get('currency')}`);
  // formData.delete('cost');
  // formData.delete('currency');

  // Show loading modal
  const loadingModal = document.getElementById('loadingModal');
  const loadingOverlay = document.getElementById('loadingOverlay');

  loadingModal.style.display = 'block';
  loadingOverlay.style.display = 'block';

  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/pets/rehoming',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

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
    loadingModal.style.display = 'none';
    loadingOverlay.style.display = 'none';
    showNotification('An error occurred. Please try again.', 'error');
  }
});
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}
