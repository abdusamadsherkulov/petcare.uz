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

const fakePetItems = [
  {
    id: 1,
    name: 'Premium Dog Food',
    category: 'Food',
    price: 25,
    currency: 'USD',
    image: 'pics/premium-dog-food.jpg',
  },
  {
    id: 2,
    name: 'Catnip Toy Mouse',
    category: 'Toy',
    price: 5,
    currency: 'USD',
    image: 'pics/catnip-toy-mouse.jpg',
  },
  {
    id: 3,
    name: 'Pet Bed',
    category: 'Accessory',
    price: 35,
    currency: 'USD',
    image: 'pics/pet-bed.jpg',
  },
  {
    id: 4,
    name: 'Fish Tank Filter',
    category: 'Accessory',
    price: 15,
    currency: 'USD',
    image: 'pics/fish-tank-filter.jpg',
  },
  {
    id: 5,
    name: 'Bird Seed Mix',
    category: 'Food',
    price: 10,
    currency: 'USD',
    image: 'pics/bird-seed-mix.jpg',
  },
];

function displayPetItems() {
  const petItemsGrid = document.getElementById('petItemsGrid');
  petItemsGrid.innerHTML = '';

  fakePetItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.classList.add('pet__card');
    itemCard.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.nextSibling.style.display='block';this.style.display='none';">
      <p style="display:none;">No photo available</p>
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Price: ${item.price} ${item.currency}</p>
      <!-- From Uiverse.io by vinodjangid07 --> 
<button class="cartBtn">
  <svg class="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
  ADD TO CART
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" class="product"><path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path></svg>
</button>
    `;
    itemCard.addEventListener('click', () => {
      alert(`Selected ${item.name} - Price: ${item.price} ${item.currency}`);
    });
    petItemsGrid.appendChild(itemCard);
  });
}

document.addEventListener('DOMContentLoaded', displayPetItems);

function updateAuthSection() {
  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');
  if (currentUser && token) {
    authSection.innerHTML = `
      <a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>
    `;
    shoppingCartLi.style.display = 'block';
    profileLi.style = 'display: block';

    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    shoppingCartLi.style.display = 'block';
    profileLi.style = 'display: none';
  }
}

updateAuthSection();
