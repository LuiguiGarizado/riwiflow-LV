import { router } from './main.js';

export async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
        const users = await response.json();

        if (users.length > 0) {
            // Guardamos sesión del usuario completo
            localStorage.setItem('currentUser', JSON.stringify(users[0]));
            errorDiv.classList.add('hidden');
            window.location.hash = '#/dashboard';
            router();
        } else {
            errorDiv.textContent = "Credenciales incorrectas. Inténtalo de nuevo.";
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = "Error al conectar con el servidor.";
        errorDiv.classList.remove('hidden');
    }
}