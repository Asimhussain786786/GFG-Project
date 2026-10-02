import {
  initNavbar,
  initFooter,
  getMe,
  getSociety,
  updateSociety,
  uploadLogo,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadBanner,
  getEventRegistrations,
  createPastEvent,
  deletePastEvent,
  formatDate,
  showToast,
  escapeHtml
} from './api.js';

let currentAdmin = null;
let currentSociety = null;
let societyUpcomingEvents = [];
let societyPastEvents = [];

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar('admin-dashboard');
  initFooter();

  if (!auth?.admin) {
    window.location.href = '/admin-login.html';
    return;
  }

  currentAdmin = auth.admin;

  // Tabs Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // Load Dashboard Data
  await loadDashboardData();

  // Modals logic
  initEventModal();
  initPastModal();
  initRegistrationsModal();
  initDetailsForm();
});

async function loadDashboardData() {
  try {
    const data = await getSociety(currentAdmin.societyId);
    currentSociety = data.society;
    societyUpcomingEvents = data.upcomingEvents || [];
    societyPastEvents = data.pastEvents || [];

    // Header info
    document.getElementById('dash-society-name').textContent = currentSociety.name;
    document.getElementById('dash-society-category').textContent = currentSociety.category;
    document.getElementById('dash-society-code').textContent = currentSociety.adminCode;
    document.getElementById('dash-admin-email').textContent = `Logged in as: ${currentAdmin.email}`;
    document.getElementById('dash-society-logo').src = currentSociety.logo || '/images/logos/default.svg';
    document.getElementById('view-public-page-btn').href = `/society.html?id=${encodeURIComponent(currentSociety.id)}`;

    renderUpcomingEvents();
    renderPastEvents();
    populateDetailsForm();
  } catch (err) {
    showToast('Failed to load society data. Please refresh.', 'danger');
  }
}

// -------------------------------------------------------------
// TAB 1: UPCOMING EVENTS
// -------------------------------------------------------------
function renderUpcomingEvents() {
  const container = document.getElementById('admin-events-list');
  if (!container) return;

  if (societyUpcomingEvents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <div class="empty-state-title">No events published yet</div>
        <p class="empty-state-text">Click "Add Upcoming Event" above to post a recruitment drive or workshop.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${societyUpcomingEvents.map(evt => `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 16px; flex: 1; min-width: 280px;">
            <img src="${escapeHtml(evt.bannerImage)}" alt="" style="width: 80px; height: 50px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border);" onerror="this.src='/images/banners/default.svg'">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge badge-${evt.category.toLowerCase()}">${escapeHtml(evt.category)}</span>
                ${evt.externalLink ? '<span class="badge badge-external">External Portal</span>' : '<span class="badge badge-society">On-site Registration</span>'}
              </div>
              <h3 style="font-size: 16px; font-weight: 700; color: var(--dark);">${escapeHtml(evt.title)}</h3>
              <div style="font-size: 13px; color: var(--text-muted); display: flex; gap: 14px; margin-top: 4px;">
                <span>📅 ${formatDate(evt.date)}</span>
                <span>⏰ ${escapeHtml(evt.time)}</span>
                <span>📍 ${escapeHtml(evt.venue)}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${!evt.externalLink ? `
              <button class="btn btn-secondary btn-sm view-regs-btn" data-id="${escapeHtml(evt.id)}" data-title="${escapeHtml(evt.title)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Registrations
              </button>
            ` : ''}
            <button class="btn btn-secondary btn-sm edit-evt-btn" data-id="${escapeHtml(evt.id)}">
              Edit
            </button>
            <button class="btn btn-outline btn-sm delete-evt-btn" style="color: var(--danger) !important; border-color: #FECACA;" data-id="${escapeHtml(evt.id)}">
              Delete
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach listeners
  document.querySelectorAll('.edit-evt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const evt = societyUpcomingEvents.find(e => e.id === id);
      if (evt) openEditEventModal(evt);
    });
  });

  document.querySelectorAll('.delete-evt-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        try {
          await deleteEvent(id);
          showToast('Event deleted successfully.', 'success');
          await loadDashboardData();
        } catch (err) {
          showToast(err.message || 'Failed to delete event.', 'danger');
        }
      }
    });
  });

  document.querySelectorAll('.view-regs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      openRegistrationsModal(id, title);
    });
  });
}

// -------------------------------------------------------------
// EVENT MODAL (ADD / EDIT)
// -------------------------------------------------------------
function initEventModal() {
  const modal = document.getElementById('event-modal');
  const addBtn = document.getElementById('add-event-btn');
  const closeBtn = document.getElementById('event-modal-close');
  const cancelBtn = document.getElementById('event-modal-cancel');
  const form = document.getElementById('event-modal-form');
  const fileInput = document.getElementById('modal-event-banner-file');

  addBtn?.addEventListener('click', () => {
    form.reset();
    document.getElementById('modal-event-id').value = '';
    document.getElementById('event-modal-title').textContent = 'Add Upcoming Event';
    document.getElementById('modal-event-banner').value = '/images/banners/default.svg';
    modal.classList.add('open');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  cancelBtn?.addEventListener('click', () => modal.classList.remove('open'));

  // File upload for banner
  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading banner...', 'info');
      const res = await uploadBanner(file);
      document.getElementById('modal-event-banner').value = res.url;
      showToast('Banner uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload banner.', 'danger');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('modal-event-id').value;
    const title = document.getElementById('modal-event-title').value.trim();
    const bannerImage = document.getElementById('modal-event-banner').value.trim();
    const date = document.getElementById('modal-event-date').value;
    const time = document.getElementById('modal-event-time').value.trim();
    const venue = document.getElementById('modal-event-venue').value.trim();
    const category = document.getElementById('modal-event-category').value;
    const fullDescription = document.getElementById('modal-event-desc').value.trim();
    const externalLink = document.getElementById('modal-event-external').value.trim();

    const payload = {
      title,
      bannerImage: bannerImage || '/images/banners/default.svg',
      date,
      time,
      venue,
      category,
      fullDescription,
      externalLink: externalLink || undefined
    };

    const submitBtn = document.getElementById('event-modal-submit');
    submitBtn.disabled = true;

    try {
      if (id) {
        await updateEvent(id, payload);
        showToast('Event updated successfully!', 'success');
      } else {
        await createEvent(payload);
        showToast('New event published successfully!', 'success');
      }
      modal.classList.remove('open');
      await loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to save event.', 'danger');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function openEditEventModal(evt) {
  const modal = document.getElementById('event-modal');
  document.getElementById('event-modal-title').textContent = 'Edit Upcoming Event';
  document.getElementById('modal-event-id').value = evt.id;
  document.getElementById('modal-event-title').value = evt.title;
  document.getElementById('modal-event-banner').value = evt.bannerImage;
  document.getElementById('modal-event-date').value = evt.date;
  document.getElementById('modal-event-time').value = evt.time;
  document.getElementById('modal-event-venue').value = evt.venue;
  document.getElementById('modal-event-category').value = evt.category;
  document.getElementById('modal-event-desc').value = evt.fullDescription;
  document.getElementById('modal-event-external').value = evt.externalLink || '';

  modal.classList.add('open');
}

// -------------------------------------------------------------
// TAB 2: PAST EVENTS
// -------------------------------------------------------------
function renderPastEvents() {
  const container = document.getElementById('admin-past-list');
  if (!container) return;

  if (societyPastEvents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="empty-state-title">No past events recorded</div>
        <p class="empty-state-text">Archive your society's flagship hackathon editions, cultural trophies, and guest lectures.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="gallery-grid">
      ${societyPastEvents.map(past => `
        <div class="gallery-card">
          <img src="${escapeHtml(past.images?.[0] || '/images/gallery/default_past.svg')}" alt="" onerror="this.src='/images/gallery/default_past.svg'">
          <div class="gallery-card-body">
            <div class="gallery-card-date">${formatDate(past.date)}</div>
            <h4 class="gallery-card-title">${escapeHtml(past.title)}</h4>
            <p class="gallery-card-desc" style="margin-bottom: 12px;">${escapeHtml(past.shortDescription)}</p>
            <button class="btn btn-outline btn-sm delete-past-btn" style="color: var(--danger) !important; border-color: #FECACA; width: 100%;" data-id="${escapeHtml(past.id)}">
              Remove from Archive
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.delete-past-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this past event milestone?')) {
        try {
          await deletePastEvent(id);
          showToast('Past event removed.', 'success');
          await loadDashboardData();
        } catch (err) {
          showToast(err.message || 'Failed to delete past event.', 'danger');
        }
      }
    });
  });
}

function initPastModal() {
  const modal = document.getElementById('past-modal');
  const addBtn = document.getElementById('add-past-btn');
  const closeBtn = document.getElementById('past-modal-close');
  const cancelBtn = document.getElementById('past-modal-cancel');
  const form = document.getElementById('past-modal-form');

  addBtn?.addEventListener('click', () => {
    form.reset();
    document.getElementById('modal-past-image').value = '/images/gallery/default_past.svg';
    modal.classList.add('open');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  cancelBtn?.addEventListener('click', () => modal.classList.remove('open'));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('modal-past-title').value.trim();
    const date = document.getElementById('modal-past-date').value;
    const shortDescription = document.getElementById('modal-past-desc').value.trim();
    const img = document.getElementById('modal-past-image').value.trim() || '/images/gallery/default_past.svg';

    try {
      await createPastEvent({
        title,
        date,
        shortDescription,
        images: [img]
      });
      showToast('Past event archived successfully!', 'success');
      modal.classList.remove('open');
      await loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to archive past event.', 'danger');
    }
  });
}

// -------------------------------------------------------------
// TAB 3: EDIT SOCIETY DETAILS
// -------------------------------------------------------------
function populateDetailsForm() {
  if (!currentSociety) return;
  document.getElementById('soc-name').value = currentSociety.name || '';
  document.getElementById('soc-category').value = currentSociety.category || 'Technical & Coding';
  document.getElementById('soc-logo-url').value = currentSociety.logo || '';
  document.getElementById('soc-short-desc').value = currentSociety.shortDescription || '';
  document.getElementById('soc-full-desc').value = currentSociety.fullDescription || '';
  document.getElementById('soc-website').value = currentSociety.website || '';
  document.getElementById('soc-instagram').value = currentSociety.instagram || '';
  document.getElementById('soc-linkedin').value = currentSociety.linkedin || '';
}

function initDetailsForm() {
  const form = document.getElementById('society-details-form');
  const logoFile = document.getElementById('soc-logo-file');

  logoFile?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading logo...', 'info');
      const res = await uploadLogo(file);
      document.getElementById('soc-logo-url').value = res.url;
      document.getElementById('dash-society-logo').src = res.url;
      showToast('Logo uploaded!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload logo.', 'danger');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('details-alert');
    alertBox.innerHTML = '';

    const payload = {
      name: document.getElementById('soc-name').value.trim(),
      category: document.getElementById('soc-category').value,
      logo: document.getElementById('soc-logo-url').value.trim(),
      shortDescription: document.getElementById('soc-short-desc').value.trim(),
      fullDescription: document.getElementById('soc-full-desc').value.trim(),
      website: document.getElementById('soc-website').value.trim(),
      instagram: document.getElementById('soc-instagram').value.trim(),
      linkedin: document.getElementById('soc-linkedin').value.trim()
    };

    const saveBtn = document.getElementById('save-details-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const res = await updateSociety(currentAdmin.societyId, payload);
      currentSociety = res.society;
      showToast('Society details saved successfully!', 'success');
      alertBox.innerHTML = `
        <div class="alert alert-success">
          Profile updated successfully. Changes are now live on public pages.
        </div>
      `;
      // Update header
      document.getElementById('dash-society-name').textContent = currentSociety.name;
      document.getElementById('dash-society-category').textContent = currentSociety.category;
    } catch (err) {
      alertBox.innerHTML = `
        <div class="alert alert-danger">
          ${err.message || 'Failed to save changes.'}
        </div>
      `;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Society Profile';
    }
  });
}

// -------------------------------------------------------------
// REGISTRATIONS MODAL
// -------------------------------------------------------------
function initRegistrationsModal() {
  const modal = document.getElementById('regs-modal');
  const closeBtn = document.getElementById('regs-modal-close');
  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
}

async function openRegistrationsModal(eventId, eventTitle) {
  const modal = document.getElementById('regs-modal');
  const titleEl = document.getElementById('regs-modal-title');
  const subtitleEl = document.getElementById('regs-modal-subtitle');
  const bodyEl = document.getElementById('regs-modal-body');

  titleEl.textContent = `Registrations: ${eventTitle}`;
  subtitleEl.textContent = 'Fetching student registrations...';
  bodyEl.innerHTML = '<div style="text-align: center; padding: 30px; color: var(--text-muted);">Loading registered students...</div>';
  modal.classList.add('open');

  try {
    const data = await getEventRegistrations(eventId);
    const regs = data.registrations || [];

    subtitleEl.textContent = `Total confirmed student registrations: ${regs.length}`;

    if (regs.length === 0) {
      bodyEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No student registrations yet</div>
          <p class="empty-state-text">When students click "Register" on this event page, their confirmed profiles will appear here.</p>
        </div>
      `;
      return;
    }

    bodyEl.innerHTML = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); color: var(--text-muted);">
              <th style="padding: 10px 8px;">#</th>
              <th style="padding: 10px 8px;">Student Name</th>
              <th style="padding: 10px 8px;">Roll Number</th>
              <th style="padding: 10px 8px;">Email</th>
              <th style="padding: 10px 8px;">Branch</th>
              <th style="padding: 10px 8px;">Year</th>
              <th style="padding: 10px 8px;">Registered At</th>
            </tr>
          </thead>
          <tbody>
            ${regs.map((r, idx) => `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 10px 8px; color: var(--text-muted);">${idx + 1}</td>
                <td style="padding: 10px 8px; font-weight: 600; color: var(--dark);">${escapeHtml(r.userSnapshot?.name || 'Student')}</td>
                <td style="padding: 10px 8px; font-family: monospace;">${escapeHtml(r.userSnapshot?.rollNumber || 'N/A')}</td>
                <td style="padding: 10px 8px;">${escapeHtml(r.userSnapshot?.email || 'N/A')}</td>
                <td style="padding: 10px 8px;">${escapeHtml(r.userSnapshot?.branch || 'N/A')}</td>
                <td style="padding: 10px 8px;"><span class="badge" style="background:#F1F5F9;">${escapeHtml(r.userSnapshot?.year || 'N/A')}</span></td>
                <td style="padding: 10px 8px; color: var(--text-muted);">${formatDate(r.registeredAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    bodyEl.innerHTML = `
      <div class="alert alert-danger">
        ${err.message || 'Failed to retrieve event registrations.'}
      </div>
    `;
  }
}
