const BACKEND_URL = 'https://petcare-backend-h0cq.onrender.com/api';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

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

function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

function logout(reason = 'Session expired or inactive') {
  console.log('Logging out:', reason);
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  const notification = document.getElementById('notification1');
  if (notification) {
    const currentLang = localStorage.getItem('lang') || 'en';
    const message =
      window.languages?.[currentLang]?.sessionExpired ||
      'Your session has expired. Please log in again.';
    notification.textContent = message;
    notification.className = 'notification error';
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  } else {
    alert('Your session has expired. Please log in again.');
  }
  setTimeout(() => {
    window.location.href = 'login-page.html';
  }, 3000);
}

function startTokenExpirationCheck() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const checkInterval = setInterval(() => {
    if (isTokenExpired(token)) {
      clearInterval(checkInterval);
      logout('Token expired');
    }
  }, 60000);
}

function startInactivityMonitor() {
  let inactivityTimer;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logout('User inactive');
    }, INACTIVITY_TIMEOUT);
  }

  ['mousemove', 'click', 'keypress', 'scroll'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, {passive: true});
  });

  resetInactivityTimer();

  window.addEventListener('unload', () => {
    ['mousemove', 'click', 'keypress', 'scroll'].forEach(event => {
      window.removeEventListener(event, resetInactivityTimer);
    });
  });
}

function initializeAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    startTokenExpirationCheck();
    startInactivityMonitor();
    if (isTokenExpired(token)) {
      logout('Token expired on page load');
    }
  }
}

export {initializeAuth, isTokenExpired, logout};
