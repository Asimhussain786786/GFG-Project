import {
  initNavbar,
  initFooter,
  getUserProfile,
  updateUserProfile,
  cancelRegistration,
  formatDate,
  showToast,
  escapeHtml
} from './api.js';

let currentUser = null;
let currentRegistrations = [];

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar('profile');
  initFooter();

  if (!auth?.user) {
    window.location.href = '/login.html?returnUrl=/profile.html';
    return;
  }

  await loadProfile();
  initProfileForm();
});

async function loadProfile() {
  const regContainer = document.getElementById('my-registrations-list');

  try {
    const data = await getUserProfile();
    currentUser = data.user;
    currentRegistrations = data.registrations || [];

    // Header & Form info
    document.getElementById('profile-display-name').textContent = currentUser.name;
    document.getElementById('profile-display-email').textContent = `${currentUser.email} • Roll: ${currentUser.rollNumber}`;
    document.getElementById('profile-avatar').textContent = currentUser.name.charAt(0).toUpperCase();

    document.getElementById('prof-name').value = currentUser.name;
    document.getElementById('prof-roll').value = currentUser.rollNumber;
    document.getElementById('prof-branch').value = currentUser.branch;
    document.getElementById('prof-year').value = currentUser.year;

    renderRegistrations();
  } catch (err) {
    if (regContainer) {
      regContainer.innerHTML = `
        <div class="alert alert-danger">
          Failed to load profile details. Please try refreshing.
        </div>
      `;
    }
  }
}

function renderRegistrations() {
  const regContainer = document.getElementById('my-registrations-list');
  if (!regContainer) return;

  if (currentRegistrations.length === 0) {
    regContainer.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <div class="empty-state-title">No event registrations yet</div>
        <p class="empty-state-text">You haven't registered for any on-site events. Explore the upcoming hackathons and recruitments to get started!</p>
        <div style="margin-top: 16px;">
          <a href="/events.html" class="btn btn-primary btn-sm">Explore Events Catalog</a>
        </div>
      </div>
    `;
    return;
  }

  regContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${currentRegistrations.map(reg => {
        const evt = reg.event;
        if (!evt) return '';
        return `
          <div class="card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
              <img src="${escapeHtml(evt.bannerImage || '/images/banners/default.svg')}" alt="" style="width: 80px; height: 50px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border);" onerror="this.src='/images/banners/default.svg'">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span class="badge badge-${evt.category.toLowerCase()}">${escapeHtml(evt.category)}</span>
                  <span style="font-size: 12px; color: var(--text-muted);">Registered on ${formatDate(reg.registeredAt)}</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--dark);">${escapeHtml(evt.title)}</h3>
                <div style="font-size: 13px; color: var(--text-muted); display: flex; gap: 14px; margin-top: 4px;">
                  <span>🏢 ${escapeHtml(evt.societyName || 'KIIT Society')}</span>
                  <span>📅 ${formatDate(evt.date)}</span>
                  <span>📍 ${escapeHtml(evt.venue)}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <a href="/event.html?id=${encodeURIComponent(evt.id)}" class="btn btn-secondary btn-sm">
                View Event Page
              </a>
              <button class="btn btn-outline btn-sm cancel-reg-btn" style="color: var(--danger) !important; border-color: #FECACA;" data-id="${escapeHtml(reg.id)}">
                Cancel
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach cancel listeners
  document.querySelectorAll('.cancel-reg-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const regId = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to cancel your registration for this event?')) {
        try {
          await cancelRegistration(regId);
          showToast('Registration cancelled.', 'info');
          await loadProfile();
        } catch (err) {
          showToast(err.message || 'Failed to cancel registration.', 'danger');
        }
      }
    });
  });
}

function initProfileForm() {
  const form = document.getElementById('edit-profile-form');
  const alertBox = document.getElementById('profile-alert');
  const saveBtn = document.getElementById('save-profile-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';

    const name = document.getElementById('prof-name').value.trim();
    const rollNumber = document.getElementById('prof-roll').value.trim();
    const branch = document.getElementById('prof-branch').value;
    const year = document.getElementById('prof-year').value;

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const res = await updateUserProfile({ name, rollNumber, branch, year });
      currentUser = res.user;
      showToast('Profile updated successfully!', 'success');
      alertBox.innerHTML = `
        <div class="alert alert-success">
          Your profile details have been saved.
        </div>
      `;
      document.getElementById('profile-display-name').textContent = currentUser.name;
      document.getElementById('profile-display-email').textContent = `${currentUser.email} • Roll: ${currentUser.rollNumber}`;
    } catch (err) {
      alertBox.innerHTML = `
        <div class="alert alert-danger">
          ${err.message || 'Failed to update profile.'}
        </div>
      `;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Update Profile';
    }
  });
}
