import { initNavbar, initFooter, loginStudent, getMe } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar();
  initFooter();

  // If already logged in as student, redirect
  if (auth?.user) {
    window.location.href = '/profile.html';
    return;
  }
  if (auth?.admin) {
    window.location.href = '/admin-dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');
  const alertContainer = document.getElementById('alert-container');
  const submitBtn = document.getElementById('submit-btn');

  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl') || '/profile.html';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email.toLowerCase().endsWith('@kiit.ac.in')) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">
          Only official @kiit.ac.in email addresses are permitted.
        </div>
      `;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
      await loginStudent(email, password);
      window.location.href = returnUrl;
    } catch (err) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">
          ${err.message || 'Invalid email or password.'}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log In';
    }
  });
});
