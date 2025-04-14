const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const profileLi = document.getElementById('profileLi');
const shoppingCartLi = document.getElementById('shoppingCartLi');
const token = localStorage.getItem('token');
const BACKEND_URL = 'https://petcare-backend-h0cq.onrender.com/api';

function closeMenu() {
  navLinks.classList.remove('open');
  menuBtnIcon.setAttribute('class', 'ri-menu-line');
  overlay.classList.add('hidden');
}

menuBtn.addEventListener('click', e => {
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
    const savedLang = localStorage.getItem('lang') || 'en';
    updatePetCardLabels(savedLang);
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
  if (!languages[lang]) {
    console.error(`Language ${lang} not found in translations`);
    return;
  }

  const elements = {
    login: document.getElementById('login'),
    logoutBtn: document.getElementById('logoutBtn'),
    chooselang: document.getElementById('chooselang'),
    cartBtn: document.getElementsByClassName('cartBtn'),
    adoptionTitle: document.getElementById('adoptionTitle'),
  };

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  localStorage.setItem('lang', lang);
  fetchAndDisplayAllPets();
}

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

async function addToCart(petId) {
  if (!token) {
    alert('Please log in to add pets to your cart!');
    return;
  }
  console.log('Token:', token);
  try {
    const response = await fetch(`${BACKEND_URL}/cart/add`, {
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
        `Failed to add pet to cart: ${response.status} - ${errorText}`
      );
    }
    const data = await response.json();
    alert('Pet added to your cart!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add pet to cart.');
  }
}

async function fetchAndDisplayAllPets() {
  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/pets/all-pets',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pets');
    }

    const pets = await response.json();
    const adoptionGrid = document.getElementById('adoptionGrid');
    adoptionGrid.innerHTML = '';

    const currentLang = localStorage.getItem('lang');

    pets.forEach(pet => {
      const firstPhoto =
        pet.photos && pet.photos.length > 0
          ? `https://petcare-backend-h0cq.onrender.com/proxy-image?url=${encodeURIComponent(
              pet.photos[0]
            )}`
          : '';
      console.log('Pet:', pet.name, 'Photo URL:', firstPhoto);
      const petCard = document.createElement('div');
      petCard.classList.add('pet__card');
      petCard.innerHTML = `
        ${
          firstPhoto
            ? `<img src="${firstPhoto}" alt="${pet.name}" onerror="this.nextSibling.style.display='block';this.style.display='none';"><p style="display:none;">No photo available</p>`
            : '<p>No photo available</p>'
        }
        <h3>${pet.name}</h3>
        <p>${getTranslatedSpecies(pet.species, currentLang)}</p>
        <p>${pet.cost}</p>
        <button class="cartBtn">
  <svg class="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
  ${languages[currentLang]?.cartBtn || 'Add to Cart'}
</button>
      `;

      const cartBtn = petCard.querySelector('.cartBtn');
      cartBtn.addEventListener('click', e => {
        e.stopPropagation();
        addToCart(pet._id);
      });
      petCard.addEventListener('click', () => {
        console.log(`Navigating to pet profile for pet ID: ${pet._id}`);
        window.location.href = `pet-profile.html?petId=${pet._id}`;
      });
      adoptionGrid.appendChild(petCard);
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    alert('Unable to load pets for adoption. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayAllPets();
  updateAuthSection();
  loadTranslations();
});
