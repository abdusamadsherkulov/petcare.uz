const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', e => {
  navLinks.classList.toggle('open');

  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
});

//Language preferences
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
