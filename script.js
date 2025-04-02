// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');

// Function to close the menu
function closeMenu() {
  navLinks.classList.remove('open');
  menuBtnIcon.setAttribute('class', 'ri-menu-line');
  overlay.classList.add('hidden');
}

menuBtn.addEventListener('click', e => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
  // overlay.classList.toggle('hidden', !isOpen);
});

document.querySelectorAll('.nav__links a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // Prevent default anchor behavior
    const sectionId = link.getAttribute('href').substring(1); // Get section ID (e.g., "services")
    const section = document.getElementById(sectionId);

    if (section) {
      const navHeight = document.querySelector('nav').offsetHeight; // Get navbar height
      const sectionTop =
        section.getBoundingClientRect().top + window.pageYOffset; // Section position
      window.scrollTo({
        top: sectionTop - navHeight, // Offset by navbar height
        behavior: 'smooth',
      });

      // Close menu on phone view (width <= 768px)
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('open');
        overlay.classList.add('hidden');
        menuBtnIcon.setAttribute('class', 'ri-menu-line');
      }
    }
  });
});

//this helps when navbar interrupts the view of section and for navigation
document.querySelector('[href="#home"]').addEventListener('click', e => {
  e.preventDefault();
  const aboutSection = document.getElementById('home');
  if (aboutSection) {
    const navHeight = document.querySelector('nav').offsetHeight; // Get navbar height
    const sectionTop =
      aboutSection.getBoundingClientRect().top + window.pageYOffset; // Section position relative to document
    window.scrollTo({
      top: sectionTop - navHeight, // Offset by navbar height
      behavior: 'smooth',
    });
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('open');
      overlay.classList.add('hidden');
      menuBtnIcon.setAttribute('class', 'ri-menu-line');
    }
  }
});

document.querySelector('[href="#about"]').addEventListener('click', e => {
  e.preventDefault();
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const navHeight = document.querySelector('nav').offsetHeight; // Get navbar height
    const sectionTop =
      aboutSection.getBoundingClientRect().top + window.pageYOffset; // Section position relative to document
    window.scrollTo({
      top: sectionTop - navHeight, // Offset by navbar height
      behavior: 'smooth',
    });
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('open');
      overlay.classList.add('hidden');
      menuBtnIcon.setAttribute('class', 'ri-menu-line');
    }
  }
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

overlay.addEventListener('click', e => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

// Variable to store translations
let languages = {};

// Function to fetch translations from languages.json
async function loadTranslations() {
  try {
    const response = await fetch('languages.json'); // Adjust path if needed (e.g., 'scripts/languages.json')
    if (!response.ok) throw new Error('Failed to load languages.json');
    languages = await response.json();
    // Load the saved language or default to 'en' after fetching
    const savedLang = localStorage.getItem('lang') || 'en';
    changeLanguage(savedLang);
  } catch (error) {
    console.error('Error fetching translations:', error);
  }
}

// Function to change language
function changeLanguage(lang) {
  if (!languages[lang]) {
    console.error(`Language ${lang} not found in translations`);
    return;
  }

  // Map of elements to update
  const elements = {
    home: document.getElementById('homeBtn'),
    about: document.getElementById('aboutBtn'),
    services: document.getElementById('servicesBtn'),
    contact: document.getElementById('contactBtn'),
    login: document.getElementById('login'),
    signup: document.getElementById('signup'),
    chooselang: document.getElementById('chooselang'),
    welcome: document.getElementById('welcome'),
    description: document.getElementById('description'),
    about_headline: document.getElementById('about_headline'),
    about_description: document.getElementById('about_description'),
    whoWeAre: document.getElementById('whoWeAre'),
    whoWeAreDsc: document.getElementById('whoWeAreDsc'),
    whatWeDo: document.getElementById('whatWeDo'),
    whatWeDoDsc: document.getElementById('whatWeDoDsc'),
    howWeHelp: document.getElementById('howWeHelp'),
    howWeHelpDsc: document.getElementById('howWeHelpDsc'),
    whyChooseUs: document.getElementById('whyChooseUs'),
    whyChooseUsDsc: document.getElementById('whyChooseUsDsc'),
    services_headline: document.getElementById('services_headline'),
    services_description: document.getElementById('services_description'),
    adoptAPet: document.getElementById('adoptAPet'),
    adoptAPetBody: document.getElementById('adoptAPetBody'),
    btnMeetYourPet: document.getElementById('btnMeetYourPet'),
    rehomeAPet: document.getElementById('rehomeAPet'),
    rehomeAPetBody: document.getElementById('rehomeAPetBody'),
    btnStartRehoming: document.getElementById('btnStartRehoming'),
    petShop: document.getElementById('petShop'),
    petShopBody: document.getElementById('petShopBody'),
    btnBrowseProducts: document.getElementById('btnBrowseProducts'),
    vetService: document.getElementById('vetService'),
    vetServiceBody: document.getElementById('vetServiceBody'),
    btnBookAVisit: document.getElementById('btnBookAVisit'),
    footerLogoText: document.getElementById('footerLogoText'),
    supportWord: document.getElementById('supportWord'),
    followUsAt: document.getElementById('followUsAt'),
    // formTitle: document.getElementById('formTitle'),
  };

  // Update all elements with the selected language
  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  // Save the language preference
  localStorage.setItem('lang', lang);
}

// Load translations when the page loads
loadTranslations();

// Lazy reveal (unchanged)
const scrollRevealOption = {
  distance: '50px',
  origin: 'bottom',
  duration: 1000,
};

ScrollReveal().reveal('.header__image img', {
  ...scrollRevealOption,
  origin: 'right',
  delay: 300,
});

ScrollReveal().reveal('.header__content div', {
  duration: 1000,
  delay: 500,
});

ScrollReveal().reveal('.header__content h1', {
  ...scrollRevealOption,
  delay: 800,
});

ScrollReveal().reveal('.header__content p', {
  ...scrollRevealOption,
  delay: 1300,
});

ScrollReveal().reveal('#about_headline', {
  ...scrollRevealOption,
  origin: 'left',
  delay: 400,
});

ScrollReveal().reveal('.about__header p', {
  ...scrollRevealOption,
  origin: 'left',
  delay: 500,
});

ScrollReveal().reveal('.about__image img', {
  ...scrollRevealOption,
  origin: 'right',
  delay: 300,
});

ScrollReveal().reveal('.about__card', {
  duration: 1000,
  interval: 500,
  delay: 500,
});

ScrollReveal().reveal('#services_headline', {
  ...scrollRevealOption,
  origin: 'left',
  delay: 400,
});

ScrollReveal().reveal('.services__header p', {
  ...scrollRevealOption,
  origin: 'left',
  delay: 500,
});

ScrollReveal().reveal('.services__card', {
  duration: 1000,
  interval: 500,
  delay: 500,
});

ScrollReveal().reveal('.footer__container', {
  ...scrollRevealOption,
  origin: 'left',
  delay: 400,
});

//client id 877691268840-mfe9nuk08dt5br15sdga7ffb62thvqk9.apps.googleusercontent.com
