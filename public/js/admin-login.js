import { initNavbar, initFooter, loginAdmin } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar();
  initFooter();

  if (auth?.admin) {
    window.location.href = '/admin-dashboard.html';
    return;
  }

  const form = document.getElementById('admin-login-form');
  const alertContainer = document.getElementById('alert-container');
  const submitBtn = document.getElementById('submit-btn');
  const codeInput = document.getElementById('adminCode');

  // Allow clicking testing codes to auto-fill
  document.querySelectorAll('strong').forEach(el => {
    if (el.textContent.startsWith('KIIT-')) {
      el.style.cursor = 'pointer';
      el.title = 'Click to paste';
      el.addEventListener('click', () => {
        codeInput.value = el.textContent;
        document.getElementById('password').value = 'kiitadmin2026';
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const adminCode = codeInput.value.trim().toUpperCase();
    const password = document.getElementById('password').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating...';

    try {
      await loginAdmin(adminCode, password);
      window.location.href = '/admin-dashboard.html';
    } catch (err) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">
          ${err.message || 'Invalid Society Admin Code or password.'}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Access Society Dashboard';
    }
  });
});
