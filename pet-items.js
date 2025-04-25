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
  if (!languages[lang]) {
    console.error(`Language ${lang} not found in translations`);
    return;
  }

  const elements = {
    login: document.getElementById('login'),
    chooselang: document.getElementById('chooselang'),
    logoutBtn: document.getElementById('logoutBtn'),
    petShopTitle: document.getElementById('petShopTitle'),
    petShopDescription: document.getElementById('petShopDescription'),
  };

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  // Update all cartBtn elements
  const cartButtons = document.getElementsByClassName('cartBtn');
  Array.from(cartButtons).forEach(button => {
    // Update the text while preserving the SVG
    const svg = button.querySelector('svg');
    button.innerHTML = ''; // Clear existing content
    if (svg) button.appendChild(svg); // Re-append the SVG
    button.appendChild(
      document.createTextNode(languages[lang].cartBtn || 'Add to Cart')
    );
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

  const currentLang = localStorage.getItem('lang');

  fakePetItems.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.classList.add('pet__card');
    itemCard.innerHTML = `
      <img src="${item.image}" alt="${
      item.name
    }" loading="lazy" onerror="this.nextSibling.style.display='block';this.style.display='none';">
      <p style="display:none;">No photo available</p>
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Price: ${item.price} ${item.currency}</p>
      <button class="cartBtn">
  <svg class="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
  ${languages[currentLang]?.cartBtn || 'Add to Cart'}
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
    shoppingCartLi.style = 'display: block';
    profileLi.style = 'display: block';

    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    shoppingCartLi.style = 'display: none';
    profileLi.style = 'display: none';
  }
}

updateAuthSection();
