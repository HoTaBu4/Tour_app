import { login, logout } from './login.js';
import { signup } from './signup';
import { displayMap } from './mapbox.js';
import { updateSettings} from './updateSettings.js';
import { bookTour } from './stripe.js';

const logoutButton = document.querySelector('.nav__el--logout');
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookTourButton = document.getElementById('book-tour');

if (bookTourButton) {
  bookTourButton.addEventListener('click', e => {
    e.preventDefault();

    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const btnSavePassword = document.querySelector('.btn__save-password');
    btnSavePassword.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    btnSavePassword.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
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

// Signup form handling
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

// Logout button handling
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();
  });
}
