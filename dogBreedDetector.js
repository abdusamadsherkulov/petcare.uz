// import {Client as GradioClient} from 'https://cdn.jsdelivr.net/npm/@gradio/client@0.10.1/dist/index.min.js';

const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');
const overlay = document.querySelector('.overlay');
const authSection = document.getElementById('authSection');
const profileLi = document.getElementById('profileLi');
const shoppingCartLi = document.getElementById('shoppingCartLi');

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
    breedDetectorHeader: document.getElementById('breedDetectorHeader'),
    dragAndDrop: document.getElementById('dragAndDrop'),
    predictBtn: document.getElementById('predictBtn'),
    clearBtn: document.getElementById('clearBtn'),
    output: document.getElementById('output'),
  };

  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });

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

const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');
const predictBtn = document.getElementById('predictBtn');
const clearBtn = document.getElementById('clearBtn');
const output = document.getElementById('output');
const loader = document.querySelector('.loader');

// Handle click to open file picker
dropArea.addEventListener('click', () => fileInput.click());

// Handle drag-and-drop
dropArea.addEventListener('dragover', e => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', e => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFile(file);
  } else {
    output.textContent = 'Please drop an image file';
  }
});

// Handle file input change
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
});

// Process selected file
function handleFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    dropArea.style.display = 'none';
    preview.style.display = 'block';
    if (localStorage.getItem('lang') == 'en') {
      output.textContent = 'Ready to predict';
    } else if (localStorage.getItem('lang') == 'ru') {
      output.textContent = 'Готов к определению';
    } else {
      output.textContent = 'Aniqlashga tayyor';
    }
  };
  reader.readAsDataURL(file);
}

import {client} from 'https://cdn.jsdelivr.net/npm/@gradio/client/+esm';

predictBtn.addEventListener('click', async () => {
  const lang = localStorage.getItem('lang') || 'en';
  console.log('Predict button clicked, language:', lang);
  if (!preview.src) {
    console.log('No image uploaded');
    output.textContent =
      languages[lang].uploadImageError || 'Please upload an image first';
    return;
  }

  console.log('Showing loader');
  loader.classList.remove('hidden');
  output.textContent = '';

  try {
    console.log('Connecting to Gradio client...');
    const app = await client('abdusamadsherkulov/DogBreedDetect');
    console.log('Gradio client connected:', app);
    const res = await fetch(preview.src);
    const blob = await res.blob();
    console.log('Image blob created');
    const result = await app.predict('/predict', [blob]);
    console.log('Prediction result:', result);

    const predictionText = result.data[0];
    const breedMatch = predictionText.match(/Predicted Breed: ([^,]+)/);
    const confidenceMatch = predictionText.match(/Confidence: ([\d.]+)/);

    if (breedMatch && confidenceMatch) {
      const breed = breedMatch[1];
      const confidence = confidenceMatch[1];
      output.textContent = `${languages[lang].predictedBreed}: ${breed}, ${languages[lang].confidence}: ${confidence}`;
    } else {
      output.textContent = predictionText;
    }
  } catch (error) {
    console.error('Prediction error:', error);
    output.textContent = `Error: ${error.message}`;
  } finally {
    console.log('Hiding loader');
    loader.classList.add('hidden');
  }
});

// Clear button click
clearBtn.addEventListener('click', () => {
  preview.src = '';
  preview.style.display = 'none';
  dropArea.style.display = 'block';
  fileInput.value = '';
  output.textContent = 'Prediction will appear here';
});

document.addEventListener('DOMContentLoaded', function () {
  loadTranslations();
  updateAuthSection();
});
