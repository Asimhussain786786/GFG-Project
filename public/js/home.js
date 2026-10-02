import { initNavbar, initFooter, getFeaturedEvents, formatDate, escapeHtml } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initNavbar('home');
  initFooter();

  const grid = document.getElementById('featured-events-grid');
  if (!grid) return;

  try {
    const data = await getFeaturedEvents();
    const events = data.events || [];

    if (events.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div class="empty-state-title">No events yet</div>
          <p class="empty-state-text">Check back soon for new recruitments and campus workshops.</p>
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
            <h3 class="event-card-title">${escapeHtml(evt.title)}</h3>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${escapeHtml(evt.venue)}</span>
              </div>
            </div>
            <div class="event-card-footer">
              <a href="/event.html?id=${encodeURIComponent(evt.id)}" class="btn btn-secondary btn-sm btn-block">
                View details
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
        Failed to load featured events. Please refresh the page.
      </div>
    `;
  }
});
