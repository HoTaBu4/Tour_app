import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateData } from './updateSettings.js';

const logoutButton = document.querySelector('.nav__el--logout');
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const settingsForm = document.querySelector('.form-user-data');

if (settingsForm) {
  settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}

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
