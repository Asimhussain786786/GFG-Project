import { initNavbar, initFooter, signupStudent } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initNavbar();
  initFooter();

  const form = document.getElementById('signup-form');
  const alertContainer = document.getElementById('alert-container');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const name = document.getElementById('name').value.trim();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const year = document.getElementById('year').value;
    const email = document.getElementById('email').value.trim();
    const branch = document.getElementById('branch').value;
    const password = document.getElementById('password').value;

    if (!email.toLowerCase().endsWith('@kiit.ac.in')) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">
          Only official @kiit.ac.in student emails are accepted.
        </div>
      `;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      await signupStudent({
        name,
        rollNumber,
        year,
        email,
        branch,
        password
      });

      window.location.href = '/profile.html';
    } catch (err) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">
          ${err.message || 'Registration failed. Please check your details.'}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Student Account';
    }
  });
});
