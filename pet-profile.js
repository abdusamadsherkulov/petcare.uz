// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  menuBtnIcon.setAttribute('class', isOpen ? 'ri-close-line' : 'ri-menu-line');
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

overlay.addEventListener('click', () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

// Language translations
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
    logoutBtn: document.getElementById('logoutBtn'),
    cartBtn: document.getElementById('cartBtn'),
    petNameLbl: document.getElementById('petNameLbl'),
    petSpeciesLbl: document.getElementById('petSpeciesLbl'),
    petBreedLbl: document.getElementById('petBreedLbl'),
    petAgeLbl: document.getElementById('petAgeLbl'),
    petHealthLbl: document.getElementById('petHealthLbl'),
    petCostLbl: document.getElementById('petCostLbl'),
    petReasonLbl: document.getElementById('petReasonLbl'),
    petLocationLbl: document.getElementById('petLocationLbl'),
    petPhoneLbl: document.getElementById('petPhoneLbl'),
  };

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

  if (currentPet) updatePetDataUI(currentPet, lang);

  localStorage.setItem('lang', lang);
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

// loadTranslations();

let currentPet = null;

function getTranslatedPetData(data, lang) {
  const elementsMap = {
    Dog: 'dogOption',
    Cat: 'catOption',
    Bird: 'birdOption',
    Other: 'otherOption',
    'Healthy, vaccinated': 'healthyVaccinatedOption',
    'Healthy, not vaccinated': 'healthyNotVaccinatedOption',
    'Not healthy, vaccinated': 'notHealthyVaccinatedOption',
    'Not healthy, not vaccinated': 'notHealthyNotVaccinatedOption',
    Allergies: 'allergiesOption',
    Moving: 'movingOption',
    'Financial reason': 'financialOption',
    'Death of owner': 'deathOfOwnerOption',
    Incompatibility: 'IncompatibilityOption',
    'Lack of time': 'timeOption',
    Tashkent: 'tashkent',
    Andijan: 'andijan',
    Bukhara: 'bukhara',
    Fergana: 'fergana',
    Jizzakh: 'jizzakh',
    Namangan: 'namangan',
    Navoi: 'navoi',
    Kashkadarya: 'kashkadarya',
    Samarkand: 'samarkand',
    Syrdarya: 'syrdarya',
    Surkhandarya: 'surkhandarya',
    'Tashkent region': 'tashkentRegion',
  };
  const translationKey = elementsMap[data];
  return translationKey && languages[lang]?.[translationKey]
    ? languages[lang][translationKey]
    : data;
}

function updatePetDataUI(pet, lang) {
  document.getElementById('petName').textContent = pet.name;
  document.getElementById('petSpecies').textContent = getTranslatedPetData(
    pet.species,
    lang
  );
  document.getElementById('petBreed').textContent = pet.breed;
  document.getElementById('petAge').textContent = pet.age;
  document.getElementById('petHealth').textContent = getTranslatedPetData(
    pet.health,
    lang
  );
  document.getElementById('petCost').textContent = pet.cost;
  document.getElementById('petReason').textContent = getTranslatedPetData(
    pet.reason,
    lang
  );
  document.getElementById('petLocation').textContent = getTranslatedPetData(
    pet.location,
    lang
  );
  document.getElementById('petPhone').textContent = pet.phone;
}

// Fetch pet data
async function fetchPetData() {
  console.log('fetchPetData started');
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get('petId');
  const token = localStorage.getItem('token');

  if (!petId) {
    window.location.href = 'adoption.html';
    return;
  }

  try {
    console.log('Fetching from /api/pets/all-pets');
    const response = await fetch(
      `https://petcare-backend-h0cq.onrender.com/api/pets/${petId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pet data');
    }

    const pet = await response.json();
    currentPet = pet;
    console.log('Fetched pet:', pet);

    const photos =
      pet.photos && pet.photos.length > 0
        ? pet.photos.map(
            photo =>
              `https://petcare-backend-h0cq.onrender.com/proxy-image?url=${encodeURIComponent(
                photo
              )}`
          )
        : [];
    console.log('Pet:', pet.name, 'Photo URLs:', photos);

    const carouselImages = document.getElementById('carouselImages');
    carouselImages.innerHTML = '';
    if (photos.length === 0) {
      carouselImages.innerHTML = '<p>No photos available</p>';
    } else {
      photos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.innerHTML = `
          <img src="${photo}" alt="${pet.name}" loading="lazy" onerror="console.log('Image failed: ${photo}');this.nextSibling.style.display='block';this.style.display='none';">
          <p style="display:none;">No photo available</p>
        `;
        carouselImages.appendChild(imgContainer);
      });
    }

    setupCarousel(photos.length);

    const currentLang = localStorage.getItem('lang');
    updatePetDataUI(pet, currentLang);
  } catch (error) {
    console.error('Error fetching pet data:', error);
    alert('Unable to load pet data: ' + error.message);
    alert('Unable to load pet data. Please try again later.');
  }
}

// fetchPetData();

async function initPage() {
  await loadTranslations();
  fetchPetData();
  updateAuthSection();
}

initPage();

function setupCarousel(photoCount) {
  const carouselImages = document.getElementById('carouselImages');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  if (photoCount <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    return;
  }

  function updateCarousel() {
    const offset = -currentIndex * 100;
    carouselImages.style.transform = `translateX(${offset}%)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + photoCount) % photoCount;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % photoCount;
    updateCarousel();
  });

  let touchStartX = 0;
  let touchEndX = 0;

  carouselImages.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselImages.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      currentIndex = (currentIndex + 1) % photoCount;
    } else if (touchEndX - touchStartX > 50) {
      currentIndex = (currentIndex - 1 + photoCount) % photoCount;
    }
    updateCarousel();
  });
}

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

const cartBtn = petCard.querySelector('.cartBtn');
cartBtn.addEventListener('click', e => {
  e.stopPropagation();
  addToCart(pet._id);
});
