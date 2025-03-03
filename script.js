const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', e => {
  navLinks.classList.toggle('open');

  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
});

//Language preferences
//Language buttons
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
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

overlay.addEventListener('click', e => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

const languages = {
  en: {
    english: 'English',
  },
  ru: {
    russian: 'Русский',
  },
  uz: {
    uzbek: "O'zbekcha",
  },
};

// Function to change language
function changeLanguage(lang) {
  // Update content based on selected language
  document.getElementById('welcome').textContent = translations[lang].welcome;
  document.getElementById('description').textContent =
    translations[lang].description;

  // Save the language preference
  localStorage.setItem('lang', lang);
}
