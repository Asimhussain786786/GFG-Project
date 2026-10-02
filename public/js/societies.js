import { initNavbar, initFooter, getSocieties, escapeHtml } from './api.js';

let currentCategory = 'All';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', async () => {
  await initNavbar('societies');
  initFooter();

  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const categoryPills = document.querySelectorAll('.category-pill');

  async function loadSocieties() {
    const grid = document.getElementById('societies-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
        Loading societies...
      </div>
    `;

    try {
      const data = await getSocieties({
        category: currentCategory,
        search: currentSearch
      });
      const societies = data.societies || [];

      if (societies.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div class="empty-state-title">No societies found</div>
            <p class="empty-state-text">No societies match your current filters. Try changing your search query or selecting "All Categories".</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = societies.map(soc => `
        <div class="card society-card">
          <div class="society-card-header">
            <img src="${escapeHtml(soc.logo)}" alt="${escapeHtml(soc.name)} logo" class="society-card-logo" onerror="this.src='/images/logos/default.svg'">
            <div>
              <span class="badge badge-society" style="margin-bottom: 6px;">${escapeHtml(soc.category)}</span>
              <h2 class="society-card-title">${escapeHtml(soc.name)}</h2>
            </div>
          </div>
          <p class="society-card-desc">${escapeHtml(soc.shortDescription)}</p>
          <div class="society-card-footer">
            <span style="font-size: 13px; font-weight: 600; color: var(--text-muted);">
              ${soc.upcomingEventsCount || 0} upcoming event${soc.upcomingEventsCount === 1 ? '' : 's'}
            </span>
            <a href="/society.html?id=${encodeURIComponent(soc.id)}" class="btn btn-secondary btn-sm">
              View more details
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </div>
      `).join('');
    } catch (err) {
      grid.innerHTML = `
        <div class="alert alert-danger" style="grid-column: 1 / -1;">
          Failed to load societies. Please check your connection and refresh.
        </div>
      `;
    }
  }

  // Search input handler with debounce
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        loadSocieties();
      }, 250);
    });
  }

  // Category select handler
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      updateActivePill(currentCategory);
      loadSocieties();
    });
  }

  // Category pills handler
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-category');
      currentCategory = cat;
      if (categorySelect) categorySelect.value = cat;
      updateActivePill(cat);
      loadSocieties();
    });
  });

  function updateActivePill(cat) {
    categoryPills.forEach(p => {
      if (p.getAttribute('data-category') === cat) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  loadSocieties();
});
