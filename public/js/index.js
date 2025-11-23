import { login } from './login.js';
import { displayMap } from './mapbox.js';

// Map rendering
const mapElement = document.getElementById('map');
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations || '[]');
  const mapboxToken = mapElement.dataset.mapboxToken || '';
  displayMap(mapElement, locations, mapboxToken);
}

// Login form handling
const loginForm = document.querySelector('.form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
