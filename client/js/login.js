import { authApi } from './api.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await authApi.login(username, password);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = 'index.html';
    } catch (err) {
        errorMessage.textContent = err.message;
        errorMessage.style.display = 'block';
    }
};
