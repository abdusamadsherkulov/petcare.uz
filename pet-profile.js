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
  if (!languages[lang]) return;
  localStorage.setItem('lang', lang);
  // Add translations if needed
}

loadTranslations();

// Fetch pet data
async function fetchPetData() {
  const urlParams = new URLSearchParams(window.location.search);
  const petId = urlParams.get('petId');
  const token = localStorage.getItem('token');

  if (!token || !petId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(
      'https://petcare-backend-h0cq.onrender.com/api/pets/my-pets',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pet data');
    }

    const pets = await response.json();
    const pet = pets.find(p => p._id === petId);
    if (!pet) {
      alert('Pet not found');
      window.location.href = 'profile.html';
      return;
    }

    const photos =
      pet.photos && pet.photos.length > 0
        ? pet.photos.map(
            photo =>
              `https://petcare-backend-h0cq.onrender.com/proxy-image?url=${encodeURIComponent(
                photo + '&export=view'
              )}`
          )
        : [];
    console.log('Pet:', pet.name, 'Photo URLs:', photos); // Log all URLs

    // Populate pet details
    document.getElementById('petName').textContent = pet.name;
    document.getElementById('petSpecies').textContent = pet.species;
    document.getElementById('petBreed').textContent = pet.breed;
    document.getElementById('petAge').textContent = pet.age;
    document.getElementById('petHealth').textContent = pet.health;
    document.getElementById('petCost').textContent = pet.cost;
    document.getElementById('petReason').textContent = pet.reason;
    document.getElementById('petLocation').textContent = pet.location;
    document.getElementById('petPhone').textContent = pet.phone;
    document.getElementById('petOwnerEmail').textContent = JSON.parse(
      localStorage.getItem('currentUser')
    ).email;
    document.getElementById('petStatus').textContent = pet.status;

    // Setup carousel
    const carouselImages = document.getElementById('carouselImages');
    carouselImages.innerHTML = ''; // Clear existing images
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
  } catch (error) {
    console.error('Error fetching pet data:', error);
    alert('Unable to load pet data. Please try again later.');
  }
}

// Carousel functionality
function setupCarousel(photoCount) {
  const carouselImages = document.getElementById('carouselImages');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  // Disable buttons if no photos or only one photo
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

  // Swipe functionality for mobile
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

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

// Initial setup
fetchPetData();
