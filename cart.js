// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn?.querySelector('i');
const authSection = document.getElementById('authSection');
const profileLi = document.getElementById('profileLi');
const shoppingCartLi = document.getElementById('basketLi');
const token = localStorage.getItem('token');
const BACKEND_URL = 'https://petcare-backend-h0cq.onrender.com/api';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

function showNotification(translationKey, type) {
  const notification = document.getElementById('notification1');
  if (!notification) {
    console.error('Notification element (#notification1) not found in DOM');
    return;
  }

  const currentLang = localStorage.getItem('lang') || 'en';
  let message = languages[currentLang]?.[translationKey];

  console.log('Displaying notification:', {message, type, currentLang});
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3500);
}

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Function to check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return payload.exp < currentTime;
}

// Logout function
function logout(reason = 'Session expired or inactive') {
  console.log('Logging out:', reason);
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  showNotification('sessionExpired', 'error');
  setTimeout(() => {
    window.location.href = 'login-page.html';
  }, 3000);
}

// Function to start token expiration check
function startTokenExpirationCheck() {
  if (!token) return;
  const checkInterval = setInterval(() => {
    if (isTokenExpired(token)) {
      clearInterval(checkInterval);
      logout('Token expired');
    }
  }, 60000); // Check every minute
}

// Function to monitor inactivity
function startInactivityMonitor() {
  let inactivityTimer;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logout('User inactive');
    }, INACTIVITY_TIMEOUT);
  }

  // Reset timer on user interactions
  ['mousemove', 'click', 'keypress', 'scroll'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, {passive: true});
  });

  // Start the timer
  resetInactivityTimer();

  // Cleanup on page unload
  window.addEventListener('unload', () => {
    ['mousemove', 'click', 'keypress', 'scroll'].forEach(event => {
      window.removeEventListener(event, resetInactivityTimer);
    });
  });
}

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

function getTranslatedSpecies(species, lang) {
  const speciesMap = {
    Dog: 'dogOption',
    Cat: 'catOption',
    Bird: 'birdOption',
    Other: 'otherOption',
  };
  const translationKey = speciesMap[species];
  return translationKey && languages[lang]?.[translationKey]
    ? languages[lang][translationKey]
    : species;
}

function changeLanguage(lang) {
  if (!languages[lang]) return;
  const elements = {
    chooselang: document.getElementById('chooselang'),
    logoutBtn: document.getElementById('logoutBtn'),
    cartTitle: document.getElementById('cartTitle'),
  };
  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });
  localStorage.setItem('lang', lang);
}

async function fetchCart() {
  if (!token || isTokenExpired(token)) {
    console.log('No valid token available for fetching cart');
    logout('Invalid or expired token');
    return [];
  }
  try {
    console.log('Fetching cart from:', `${BACKEND_URL}/cart`);
    const response = await fetch(`${BACKEND_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch cart: ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    console.log('Cart data received:', data);
    return (
      data.cart?.items?.map(item => item.pet).filter(pet => pet !== null) || []
    );
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    showNotification('failedToFetchCart', 'error');
    return [];
  }
}

async function removeFromCart(petId) {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    logout();
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/cart/remove`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({petId}),
    });

    if (response.ok) {
      const cartGrid = document.getElementById('cartGrid');
      if (cartGrid) {
        await displayCart(cartGrid); // правильно вызываем с DOM-элементом
      }
      showNotification('petRemovedSuccess', 'success');
    } else {
      showNotification('failedToRemovePet', 'error');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    showNotification('failedToRemovePet', 'error');
  }
}

async function displayCart(cartGrid) {
  console.log('Starting displayCart, token:', token);
  cartGrid.innerHTML = '';
  if (!token || isTokenExpired(token)) {
    console.log('No valid token, showing login message');
    cartGrid.innerHTML = '<p>Please log in to view your cart.</p>';
    showNotification('loginToViewCart', 'error');
    logout('Invalid or expired token');
    return;
  }
  const cartItems = await fetchCart();
  console.log('Cart items:', cartItems);
  if (cartItems.length === 0) {
    console.log('Cart is empty or no valid items');
    cartGrid.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  const uniqueItems = Array.from(
    new Map(cartItems.map(item => [item._id, item])).values()
  );
  console.log('Unique cart items:', uniqueItems);

  const currentLang = localStorage.getItem('lang');

  uniqueItems.forEach(pet => {
    console.log('Rendering pet:', pet.name, pet);
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
          ? `<img src="${firstPhoto}" alt="${
              pet.name || 'Pet'
            }" loading="lazy" onerror="this.nextSibling.style.display='block';this.style.display='none';"><p style="display:none;">No photo available</p>`
          : '<p>No photo available</p>'
      }
      <h3>${pet.name}</h3>
      <p>${getTranslatedSpecies(pet.species, currentLang)}</p>
      <p>${pet.cost}</p>
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

    binButton.addEventListener('click', event => {
      event.stopPropagation();
      console.log('Removing pet with ID:', pet._id);
      removeFromCart(pet._id, cartGrid);
    });

    cartItem.addEventListener('click', () => {
      console.log(`Navigating to pet profile for pet ID: ${pet._id}`);
      window.location.href = `pet-profile.html?petId=${pet._id}`;
    });

    cartGrid.appendChild(cartItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  initializePage();
  loadTranslations();
  if (token) {
    startInactivityMonitor();
    startTokenExpirationCheck();
  }
});

function updateAuthSection() {
  const currentUser = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');
  if (currentUser && token && !isTokenExpired(token)) {
    authSection.innerHTML = `
      <a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>
    `;
    profileLi.style = 'display: block';
    document.getElementById('logoutBtn').addEventListener('click', e => {
      e.preventDefault();
      logout('User initiated logout');
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    profileLi.style = 'display: none';
    if (token && isTokenExpired(token)) {
      logout('Token expired on page load');
    }
  }
}

updateAuthSection();
