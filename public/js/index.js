import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

const logoutButton = document.querySelector('.nav__el--logout');
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form--login');

// Map rendering
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations || '[]');
  const mapboxToken = mapElement.dataset.mapboxToken || '';
  displayMap(mapElement, locations, mapboxToken);
}

// Login form handling
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Logout button handling
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();
  });
}
