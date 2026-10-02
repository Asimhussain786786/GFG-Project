import { initNavbar, initFooter, getEvents, getSocieties, formatDate, escapeHtml } from './api.js';

let currentCategory = 'All';
let currentSocietyId = '';
let currentSearch = '';
let currentSort = 'date-asc';

document.addEventListener('DOMContentLoaded', async () => {
  await initNavbar('events');
  initFooter();

  const searchInput = document.getElementById('event-search-input');
  const categorySelect = document.getElementById('event-category-select');
  const societySelect = document.getElementById('event-society-select');
  const sortSelect = document.getElementById('event-sort-select');

  // Load Societies for dropdown
  try {
    const socData = await getSocieties();
    const societies = socData.societies || [];
    societies.forEach(soc => {
      const opt = document.createElement('option');
      opt.value = soc.id;
      opt.textContent = soc.name;
      societySelect.appendChild(opt);
    });
  } catch (e) {
    console.error('Failed to populate societies filter', e);
  }

  async function loadEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
        Loading events...
      </div>
    `;

    try {
      const data = await getEvents({
        category: currentCategory,
        societyId: currentSocietyId,
        search: currentSearch,
        sort: currentSort
      });
      const events = data.events || [];

      if (events.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <div class="empty-state-title">No events found</div>
            <p class="empty-state-text">No upcoming events match your filter criteria. Try resetting filters or choosing another category.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = events.map(evt => {
        const catClass = `badge-${evt.category.toLowerCase()}`;
        return `
          <div class="card event-card">
            <img src="${escapeHtml(evt.bannerImage)}" alt="${escapeHtml(evt.title)}" class="event-card-banner" onerror="this.src='/images/banners/default.svg'">
            <div class="event-card-body">
              <div class="event-card-meta">
                <span class="badge ${catClass}">${escapeHtml(evt.category)}</span>
                ${evt.externalLink ? '<span class="badge badge-external">External Portal</span>' : '<span class="badge badge-society">On-site</span>'}
              </div>
              <h2 class="event-card-title">${escapeHtml(evt.title)}</h2>
              <div class="event-card-society">
                <img src="${escapeHtml(evt.societyLogo || '/images/logos/default.svg')}" alt="" class="event-card-society-logo" onerror="this.src='/images/logos/default.svg'">
                <span>${escapeHtml(evt.societyName || 'KIIT Society')}</span>
              </div>
              <div class="event-details-strip">
                <div class="event-details-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>${formatDate(evt.date)}</span>
                </div>
                <div class="event-details-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>${escapeHtml(evt.time)}</span>
                </div>
                <div class="event-details-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${escapeHtml(evt.venue)}</span>
                </div>
              </div>
              <div class="event-card-footer">
                <a href="/event.html?id=${encodeURIComponent(evt.id)}" class="btn btn-secondary btn-sm btn-block">
                  View details &amp; register
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      grid.innerHTML = `
        <div class="alert alert-danger" style="grid-column: 1 / -1;">
          Failed to load events. Please refresh the page.
        </div>
      `;
    }
  }

  // Filter events
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        loadEvents();
      }, 250);
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      loadEvents();
    });
  }

  if (societySelect) {
    societySelect.addEventListener('change', (e) => {
      currentSocietyId = e.target.value;
      loadEvents();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      loadEvents();
    });
  }

  loadEvents();
});
