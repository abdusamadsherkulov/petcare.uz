const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', e => {
  navLinks.classList.toggle('open');

  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
});

//Language preferences
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnShowModal = document.querySelector('.show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnShowModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Language data
const languages = {
  en: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact us',
    login: 'Log in',
    signup: 'Sign in',
    chooselang: 'Choose a language',
    welcome: 'Welcome to petcare.uz',
    description:
      'Your trusted partner in pet adoption, rehoming, shopping, and vet care—bringing love, joy, and wellness to every pet and their family.',
    about_headline: 'About petcare.uz',
    about_description:
      'At petcare.uz, we’re a team of pet lovers dedicated to making life better for animals and the people who adore them. From finding forever homes to delivering top-notch supplies and vet care, we’re here to create a world where every pet thrives—and every pet parent smiles.',
  },
  ru: {
    home: 'Главная',
    about: 'О нас',
    services: 'Наши сервисы',
    contact: 'Контакты',
    login: 'Войти',
    signup: 'Зарегистрироваться',
    chooselang: 'Выберите язык',
    welcome: 'Добро пожаловать в petcare.uz',
    description:
      'Ваш надежный партнер в вопросах усыновления домашних животных, поиска новых хозяев, покупок и ветеринарной помощи, приносящий любовь, радость и благополучие каждому питомцу и его семье.',
    about_headline: 'О petcare.uz',
    about_description:
      'На сайте petcare.uz мы — команда любителей животных, стремящихся улучшить жизнь питомцев и людей, которые их обожают. От поиска постоянного дома до поставки высококачественных товаров и ветеринарной помощи — мы здесь, чтобы создать мир, где каждый питомец процветает, а каждый хозяин улыбается.',
  },
  uz: {
    home: 'Asosiy',
    about: 'Biz haqimizda',
    services: 'Bizning xizmatlar',
    contact: 'Kontaktlar',
    login: 'Akkauntga kirish',
    signup: `Ro'yxatdan o'tish`,
    chooselang: 'Tilni tanlang',
    welcome: 'petcare.uzga xush kelibsiz',
    description: `Uy hayvonlarini boqib olish, uy hayvonlari uchun yangi uy topish, uy hayvonlari maxsulorlarini xarid qilish va veterinar xizmatlari bo'yicha ishonchli hamkoringiz.`,
    about_headline: 'petcare.uz haqida',
    about_description:
      'Petcare.uz uy hayvonlarini sevuvchilarga yordam beradi. Uy hayvonlari uchun doimiy uy topishdan boshlab, uy hayvonlari uchun yuqori sifatli mahsulotlar va veterinariya xizmatlarini taklif qiladi',
  },
};

// Function to change language
function changeLanguage(lang) {
  // Update content based on selected language
  document.getElementById('home').textContent = languages[lang].home;
  document.getElementById('about').textContent = languages[lang].about;
  document.getElementById('services').textContent = languages[lang].services;
  document.getElementById('contact').textContent = languages[lang].contact;
  document.getElementById('login').textContent = languages[lang].login;
  document.getElementById('signup').textContent = languages[lang].signup;
  document.getElementById('chooselang').textContent =
    languages[lang].chooselang;
  document.getElementById('welcome').textContent = languages[lang].welcome;
  document.getElementById('description').textContent =
    languages[lang].description;
  document.getElementById('about_headline').textContent =
    languages[lang].about_headline;
  document.getElementById('about_description').textContent =
    languages[lang].about_description;

  // Save the language preference
  localStorage.setItem('lang', lang);
}

const savedLang = localStorage.getItem('lang') || 'en';
changeLanguage(savedLang);

// Lazy reveal
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
