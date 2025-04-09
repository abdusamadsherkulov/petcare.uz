// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn?.querySelector('i');
const authSection = document.getElementById('authSection');
const profileLi = document.getElementById('profileLi');
const shoppingCartLi = document.getElementById('basketLi');
const token = localStorage.getItem('token');
const BACKEND_URL = 'https://petcare-backend-h0cq.onrender.com/api';

function closeMenu() {
  if (navLinks && menuBtnIcon) {
    navLinks.classList.remove('open');
    menuBtnIcon.setAttribute('class', 'ri-menu-line');
    document.querySelector('.overlay')?.classList.add('hidden');
  }
}

function initializePage() {
  if (menuBtn && navLinks && menuBtnIcon) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuBtnIcon.setAttribute(
        'class',
        isOpen ? 'ri-close-line' : 'ri-menu-line'
      );
    });
  }

  const modal = document.querySelector('.modal');
  const btnCloseModal = document.querySelector('.close-modal');
  const btnShowModal = document.querySelector('.show-modal');
  const overlay = document.querySelector('.overlay');

  if (btnShowModal && modal && btnCloseModal && overlay) {
    btnShowModal.addEventListener('click', () => {
      console.log('Language button clicked');
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
    });

    overlay.addEventListener('click', () => {
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
    });
  }

  const cartGrid = document.getElementById('cartGrid');
  if (cartGrid) {
    displayCart(cartGrid);
  }
}

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
    petShopTitle: document.getElementById('petShopTitle'),
    petShopDescription: document.getElementById('petShopDescription'),
    cartTitle: document.getElementById('cartTitle'),
    cartDescription: document.getElementById('cartDescription'),
  };
  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });
  localStorage.setItem('lang', lang);
}

async function fetchCart() {
  if (!token) return [];
  try {
    const response = await fetch(`${BACKEND_URL}/cart`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.cart.items.map(item => item.pet) || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

async function removeFromCart(petId, cartGrid) {
  if (!token) {
    alert('Please log in to remove pets from your cart!');
    return;
  }
  try {
    const response = await fetch(`${BACKEND_URL}/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({petId}),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to remove pet: ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    console.log('Pet removed:', data);
    displayCart(cartGrid);
  } catch (error) {
    console.error('Error removing from cart:', error);
    alert(`Failed to remove pet: ${error.message}`);
  }
}

async function displayCart(cartGrid) {
  cartGrid.innerHTML = '';
  if (!token) {
    cartGrid.innerHTML = '<p>Please log in to view your cart.</p>';
    return;
  }
  const cartItems = await fetchCart();
  if (cartItems.length === 0) {
    cartGrid.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cartItems.forEach(pet => {
    const firstPhoto =
      pet.photos && pet.photos.length > 0
        ? `https://petcare-backend-h0cq.onrender.com/proxy-image?url=${encodeURIComponent(
            pet.photos[0]
          )}`
        : '';
    const cartItem = document.createElement('div');
    cartItem.classList.add('pet__card');
    cartItem.innerHTML = `
    ${
      firstPhoto
        ? `<img src="${firstPhoto}" alt="${pet.name}" loading="lazy" onerror="this.nextSibling.style.display='block';this.style.display='none';"><p style="display:none;">No photo available</p>`
        : '<p>No photo available</p>'
    }
      <h3>${pet.name}</h3>
      <p>Species: ${pet.species}</p>
      <p>Age: ${pet.age}</p>
      <p>Cost: ${pet.cost}</p>
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
    `;
    const binButton = cartItem.querySelector('.bin-button');
    binButton.addEventListener('click', () =>
      removeFromCart(pet._id, cartGrid)
    );
    cartGrid.appendChild(cartItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  initializePage();
  loadTranslations();
});

function updateAuthSection() {
  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');
  if (currentUser && token) {
    authSection.innerHTML = `
      <a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>
    `;
    profileLi.style = 'display: block';

    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    profileLi.style = 'display: none';
  }
}

updateAuthSection();
