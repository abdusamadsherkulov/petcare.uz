// Menu toggle functionality
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn?.querySelector('i');
const authSection = document.getElementById('authSection');
const profileLi = document.getElementById('profileLi');
const shoppingCartLi = document.getElementById('basketLi');
const token = localStorage.getItem('token');

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

  // Modal handling
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

  // Auth section
  // if (authSection && profileLi && shoppingCartLi) {
  //   if (token) {
  //     authSection.innerHTML = `<a href="index.html" id="logoutBtn" class="logout-btn" style="color:#fff">Log out</a>`;
  //     shoppingCartLi.style.display = 'block';
  //     profileLi.style.display = 'block';
  //     document.getElementById('logoutBtn')?.addEventListener('click', e => {
  //       e.preventDefault();
  //       localStorage.removeItem('currentUser');
  //       localStorage.removeItem('token');
  //       localStorage.removeItem(`cart_${token}`); // Clear cart on logout
  //       window.location.href = 'index.html';
  //     });
  //   } else {
  //     authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
  //     shoppingCartLi.style.display = 'none';
  //     profileLi.style.display = 'none';
  //   }
  // }

  // Fake pet items
  const petItemsGrid = document.getElementById('petItemsGrid');
  if (petItemsGrid) {
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
        <button class="cartBtn">
          <svg class="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="..."></path></svg>
          ADD TO CART
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" class="product"><path d="..."></path></svg>
        </button>
      `;
      const cartBtn = itemCard.querySelector('.cartBtn');
      cartBtn.addEventListener('click', e => {
        e.stopPropagation(); // Prevent card click from triggering
        addToCart(item);
      });
      itemCard.addEventListener('click', () => {
        alert(`Selected ${item.name} - Price: ${item.price} ${item.currency}`);
      });
      petItemsGrid.appendChild(itemCard);
    });
  }

  // Cart display
  const cartGrid = document.getElementById('cartGrid');
  if (cartGrid) {
    displayCart(cartGrid);
  }
}

// Language translations
let languages = {};
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
    cartTitle: document.getElementById('cartTitle'), // Add for basket.html
    cartDescription: document.getElementById('cartDescription'),
  };
  Object.keys(elements).forEach(key => {
    if (elements[key] && languages[lang][key]) {
      elements[key].textContent = languages[lang][key];
    }
  });
  localStorage.setItem('lang', lang);
}

// Cart functions
function addToCart(item) {
  if (!token) {
    alert('Please log in to add items to your cart!');
    return;
  }
  const cartKey = `cart_${token}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  cart.push(item);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(`${item.name} added to your cart!`);
}

function displayCart(cartGrid) {
  cartGrid.innerHTML = '';
  if (!token) {
    cartGrid.innerHTML = '<p>Please log in to view your cart.</p>';
    return;
  }
  const cartKey = `cart_${token}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (cart.length === 0) {
    cartGrid.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('pet__card');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.nextSibling.style.display='block';this.style.display='none';">
      <p style="display:none;">No photo available</p>
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Price: ${item.price} ${item.currency}</p>
    `;
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
      window.location.href = 'index.html'; // Redirect to login page
    });
  } else {
    authSection.innerHTML = `<a href="login-page.html" id="login">Log in</a>`;
    profileLi.style = 'display: none';
  }
}

updateAuthSection();
