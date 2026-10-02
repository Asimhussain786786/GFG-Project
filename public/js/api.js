/**
 * KIIT Society Hub — Shared API Client & UI Helpers
 */
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const res = await fetch(endpoint, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (err) {
    throw err;
  }
}
   

// Auth API
export async function getMe() {
  try {
    return await fetchApi('/api/auth/me');
  } catch {
    return { user: null };
  }
}
export async function loginStudent(email, password) {
  const data = await fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data?.token) {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function loginAdmin(adminCode, password) {
  const data = await fetchApi('/api/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ adminCode, password })
  });
  if (data?.token) {
    localStorage.setItem('auth_token', data.token);
  }
  return data;
}

export async function logout() {
  localStorage.removeItem('auth_token');
  await fetchApi('/api/auth/logout', { method: 'POST' }).catch(() => {});
  window.location.href = '/login.html';
}

export async function signupStudent(userData) {
  return fetchApi('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}


// Societies API
export async function getSocieties(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return fetchApi(`/api/societies${qStr}`);
}

export async function getSociety(id) {
  return fetchApi(`/api/societies/${id}`);
}

export async function updateSociety(id, data) {
  return fetchApi(`/api/societies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function uploadLogo(file) {
  const formData = new FormData();
  formData.append('logo', file);
  return fetchApi('/api/societies/upload-logo', {
    method: 'POST',
    body: formData
  });
}

// Events API
export async function getEvents(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.societyId) query.append('societyId', params.societyId);
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return fetchApi(`/api/events${qStr}`);
}

export async function getFeaturedEvents() {
  return fetchApi('/api/events/featured');
}

export async function getEvent(id) {
  return fetchApi(`/api/events/${id}`);
}

export async function createEvent(eventData) {
  return fetchApi('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
}

export async function updateEvent(id, eventData) {
  return fetchApi(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
}

export async function deleteEvent(id) {
  return fetchApi(`/api/events/${id}`, {
    method: 'DELETE'
  });
}

export async function getEventRegistrations(id) {
  return fetchApi(`/api/events/${id}/registrations`);
}

export async function uploadBanner(file) {
  const formData = new FormData();
  formData.append('banner', file);
  return fetchApi('/api/events/upload-banner', {
    method: 'POST',
    body: formData
  });
}

export async function createPastEvent(data) {
  return fetchApi('/api/events/past', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deletePastEvent(id) {
  return fetchApi(`/api/events/past/${id}`, {
    method: 'DELETE'
  });
}

// Registrations API
export async function registerForEvent(eventId) {
  return fetchApi('/api/registrations', {
    method: 'POST',
    body: JSON.stringify({ eventId })
  });
}

export async function getMyRegistrations() {
  return fetchApi('/api/registrations/my');
}

export async function cancelRegistration(registrationId) {
  return fetchApi(`/api/registrations/${registrationId}`, {
    method: 'DELETE'
  });
}

// User Profile API
export async function getUserProfile() {
  return fetchApi('/api/users/profile');
}

export async function updateUserProfile(data) {
  return fetchApi('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function changePassword(data) {
  return fetchApi('/api/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// UI Utilities
export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', options);
  } catch {
    return dateString;
  }
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#15803D' : type === 'danger' ? '#B91C1C' : '#1E293B';
  toast.style.cssText = `
    background: ${bg};
    color: #FFFFFF;
    padding: 12px 18px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.2s ease forwards;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Shared Navigation Renderer
export async function initNavbar(activePage = '') {
  const navPlaceholder = document.getElementById('navbar-placeholder');
  if (!navPlaceholder) return;

  const authData = await getMe();
  const user = authData.user;
  const admin = authData.admin;

  let actionsHtml = '';
  if (user) {
    actionsHtml = `
      <a href="/profile.html" class="user-nav-pill">
        <span class="user-nav-avatar">${escapeHtml(user.name.charAt(0))}</span>
        <span>${escapeHtml(user.name.split(' ')[0])}</span>
      </a>
      <button id="logout-btn" class="btn btn-secondary btn-sm" title="Log out">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Logout
      </button>
    `;
  } else if (admin) {
    actionsHtml = `
      <a href="/admin-dashboard.html" class="btn btn-primary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        Admin Dashboard
      </a>
      <button id="logout-btn" class="btn btn-secondary btn-sm">
        Logout
      </button>
    `;
  } else {
    actionsHtml = `
      <a href="/login.html" class="btn btn-secondary btn-sm">Student Login</a>
      <a href="/signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }

  navPlaceholder.innerHTML = `
    <header class="site-header">
      <div class="container nav-container">
        <a href="/index.html" class="brand-link">
          <div class="brand-crest">K</div>
          <div class="brand-title">
            KIIT Society Hub
            <span class="brand-subtitle">Campus</span>
          </div>
        </a>

        <button class="menu-toggle" id="menu-toggle-btn" aria-label="Toggle navigation">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <ul class="nav-links" id="nav-links">
          <li><a href="/index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="/societies.html" class="nav-link ${activePage === 'societies' ? 'active' : ''}">Societies</a></li>
          <li><a href="/events.html" class="nav-link ${activePage === 'events' ? 'active' : ''}">Events</a></li>
          ${user ? `<li><a href="/profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">My Profile</a></li>` : ''}
          ${admin ? `<li><a href="/admin-dashboard.html" class="nav-link ${activePage === 'admin-dashboard' ? 'active' : ''}">Dashboard</a></li>` : ''}
        </ul>

        <div class="nav-actions">
          ${actionsHtml}
        </div>
      </div>
    </header>
  `;

  // Event handlers
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => logout());
  }

  const menuToggle = document.getElementById('menu-toggle-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  return { user, admin };
}

// Shared Footer Renderer
export function initFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  footerPlaceholder.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
              <div class="brand-crest">K</div>
              <div style="font-family:var(--font-heading); font-size:18px; font-weight:800; color:var(--dark);">
                KIIT Society Hub
              </div>
            </div>
            <p style="font-size:14px; color:var(--text-muted); max-width:420px; line-height:1.6;">
              The official centralized platform for KIIT University student chapters, technical wings, cultural societies, and annual fests. Discover opportunities, join recruitments, and build impactful projects.
            </p>
          </div>
          <div>
            <div class="footer-col-title">Navigation</div>
            <ul class="footer-links">
              <li><a href="/index.html">Home</a></li>
              <li><a href="/societies.html">Browse Societies</a></li>
              <li><a href="/events.html">Upcoming Events</a></li>
              <li><a href="/signup.html">Student Registration</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">Society Management</div>
            <ul class="footer-links">
              <li><a href="/admin-login.html">Society Admin Portal</a></li>
              <li><a href="https://ksac.kiit.ac.in" target="_blank" rel="noopener">KSAC Official Portal</a></li>
              <li><a href="https://kiit.ac.in" target="_blank" rel="noopener">KIIT Main Website</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>
            &copy; ${new Date().getFullYear()} KIIT Deemed to be University, Bhubaneswar, Odisha.
          </div>
          <div>
            Kalinga Institute of Industrial Technology • KSAC Student Activity Centre
          </div>
        </div>
      </div>
    </footer>
  `;
}
