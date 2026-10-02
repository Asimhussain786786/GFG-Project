import { initNavbar, initFooter, getSociety, formatDate, escapeHtml } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar('societies');
  initFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const societyId = urlParams.get('id');
  const container = document.getElementById('society-container');
  const breadcrumbName = document.getElementById('breadcrumb-society-name');

  if (!societyId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Society Not Specified</div>
        <p class="empty-state-text">Please select a valid society from the directory.</p>
        <div style="margin-top: 16px;">
          <a href="/societies.html" class="btn btn-primary">Browse All Societies</a>
        </div>
      </div>
    `;
    return;
  }

  try {
    const data = await getSociety(societyId);
    const { society, upcomingEvents, pastEvents } = data;

    if (breadcrumbName) breadcrumbName.textContent = society.name;
    document.title = `${society.name} — KIIT Society Hub`;

    const isOwnAdmin = auth?.admin && auth.admin.societyId === society.id;

    // Social Links
    const socialLinks = [];
    if (society.website) {
      socialLinks.push(`
        <a href="${escapeHtml(society.website)}" target="_blank" rel="noopener noreferrer" class="social-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Official Website
        </a>
      `);
    }
    if (society.instagram) {
      socialLinks.push(`
        <a href="${escapeHtml(society.instagram)}" target="_blank" rel="noopener noreferrer" class="social-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          Instagram
        </a>
      `);
    }
    if (society.linkedin) {
      socialLinks.push(`
        <a href="${escapeHtml(society.linkedin)}" target="_blank" rel="noopener noreferrer" class="social-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          LinkedIn
        </a>
      `);
    }

    // Render Upcoming Events
    let upcomingHtml = '';
    if (!upcomingEvents || upcomingEvents.length === 0) {
      upcomingHtml = `
        <div class="empty-state" style="margin-top: 16px;">
          <div class="empty-state-title">No upcoming events yet</div>
          <p class="empty-state-text">This society hasn't scheduled new events yet. Check back soon!</p>
        </div>
      `;
    } else {
      upcomingHtml = `
        <div class="grid-3" style="margin-top: 20px;">
          ${upcomingEvents.map(evt => `
            <div class="card event-card">
              <img src="${escapeHtml(evt.bannerImage)}" alt="${escapeHtml(evt.title)}" class="event-card-banner" onerror="this.src='/images/banners/default.svg'">
              <div class="event-card-body">
                <div class="event-card-meta">
                  <span class="badge badge-${evt.category.toLowerCase()}">${escapeHtml(evt.category)}</span>
                  ${evt.externalLink ? '<span class="badge badge-external">External</span>' : '<span class="badge badge-society">On-site</span>'}
                </div>
                <h3 class="event-card-title">${escapeHtml(evt.title)}</h3>
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
                    View details &amp; register
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Past Events & Galleries
    let pastHtml = '';
    if (!pastEvents || pastEvents.length === 0) {
      pastHtml = `
        <div class="empty-state" style="margin-top: 16px;">
          <div class="empty-state-title">No past events recorded</div>
          <p class="empty-state-text">Past activities and achievements will appear here.</p>
        </div>
      `;
    } else {
      pastHtml = `
        <div class="gallery-grid">
          ${pastEvents.map(past => {
            const firstImg = past.images?.[0] || '/images/gallery/default_past.svg';
            return `
              <div class="gallery-card">
                <img src="${escapeHtml(firstImg)}" alt="${escapeHtml(past.title)}" onerror="this.src='/images/gallery/default_past.svg'">
                <div class="gallery-card-body">
                  <div class="gallery-card-date">${formatDate(past.date)}</div>
                  <h4 class="gallery-card-title">${escapeHtml(past.title)}</h4>
                  <p class="gallery-card-desc">${escapeHtml(past.shortDescription)}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Society Header Card -->
      <div class="detail-header-card">
        <div class="society-detail-hero">
          <img src="${escapeHtml(society.logo)}" alt="${escapeHtml(society.name)} logo" class="society-detail-logo" onerror="this.src='/images/logos/default.svg'">
          <div style="flex-grow: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 6px;">
              <span class="badge badge-society">${escapeHtml(society.category)}</span>
              ${isOwnAdmin ? `
                <a href="/admin-dashboard.html" class="btn btn-outline btn-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Manage in Dashboard
                </a>
              ` : ''}
            </div>
            <h1 style="font-size: 28px; margin-bottom: 8px;">${escapeHtml(society.name)}</h1>
            <p style="font-size: 16px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
              ${escapeHtml(society.shortDescription)}
            </p>
            <div class="society-social-links">
              ${socialLinks.join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <section style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 40px; box-shadow: var(--shadow-sm);">
        <h2 style="font-size: 20px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">
          About the Society
        </h2>
        <div class="prose">
          <p>${escapeHtml(society.fullDescription).replace(/\n\n/g, '</p><p>')}</p>
        </div>
      </section>

      <!-- Upcoming Events Section -->
      <section style="margin-bottom: 48px;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Upcoming Events &amp; Recruitments</h2>
            <p class="section-subtitle">Official sessions, bootcamps, and application deadlines.</p>
          </div>
        </div>
        ${upcomingHtml}
      </section>

      <!-- Past Events Archive -->
      <section style="margin-bottom: 48px;">
        <div class="section-header">
          <div>
            <h2 class="section-title">Past Events &amp; Achievements</h2>
            <p class="section-subtitle">Highlights from previous editions, hackathons, and competitions.</p>
          </div>
        </div>
        ${pastHtml}
      </section>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Failed to load society details. Please refresh or verify the society ID.
      </div>
    `;
  }
});
