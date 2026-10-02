import { initNavbar, initFooter, getEvent, registerForEvent, formatDate, showToast, escapeHtml } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const auth = await initNavbar('events');
  initFooter();

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  const container = document.getElementById('event-container');
  const breadcrumbTitle = document.getElementById('breadcrumb-event-title');

  if (!eventId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-title">Event Not Found</div>
        <p class="empty-state-text">Please select a valid event from the events catalog.</p>
        <div style="margin-top: 16px;">
          <a href="/events.html" class="btn btn-primary">Browse All Events</a>
        </div>
      </div>
    `;
    return;
  }

  async function renderEvent() {
    try {
      const data = await getEvent(eventId);
      const { event, isRegistered, registeredAt } = data;
      const society = event.society;

      if (breadcrumbTitle) breadcrumbTitle.textContent = event.title;
      document.title = `${event.title} — KIIT Society Hub`;

      // Determine Registration Action UI
      let registrationActionHtml = '';

      if (event.externalLink) {
        registrationActionHtml = `
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 600; color: var(--accent); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              External Registration Portal
            </div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
              This event is hosted in partnership with an external competition or hackathon portal.
            </p>
            <a href="${escapeHtml(event.externalLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
              Register on External Portal
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        `;
      } else if (!auth.user && !auth.admin) {
        registrationActionHtml = `
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
              You must be logged in with your verified KIIT student account to register for this event.
            </p>
            <a href="/login.html?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}" class="btn btn-primary btn-block">
              Log in to Register
            </a>
          </div>
        `;
      } else if (auth.admin) {
        registrationActionHtml = `
          <div class="alert alert-info">
            Logged in as Society Administrator. Registration is only open to student accounts.
          </div>
        `;
      } else if (isRegistered) {
        registrationActionHtml = `
          <div style="background: var(--success-bg); border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--success); margin-bottom: 6px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              You are registered!
            </div>
            <p style="font-size: 13px; color: var(--text-main); margin-bottom: 10px;">
              Your seat is confirmed. Registered on ${formatDate(registeredAt)}.
            </p>
            <a href="/profile.html" class="btn btn-secondary btn-sm btn-block">
              View in My Registrations
            </a>
          </div>
        `;
      } else {
        registrationActionHtml = `
          <div style="margin-bottom: 20px;">
            <button id="register-btn" class="btn btn-primary btn-block" style="padding: 12px 20px; font-size: 15px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              Register for this Event (Free)
            </button>
            <div style="text-align: center; font-size: 12px; color: var(--text-light); margin-top: 8px;">
              Instant on-site registration for verified KIIT students
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="event-detail-grid">
          <!-- Main Content -->
          <div>
            <img src="${escapeHtml(event.bannerImage)}" alt="${escapeHtml(event.title)}" class="event-banner-large" onerror="this.src='/images/banners/default.svg'">
            
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <span class="badge badge-${event.category.toLowerCase()}" style="font-size: 13px; padding: 4px 10px;">
                ${escapeHtml(event.category)}
              </span>
              ${event.externalLink ? '<span class="badge badge-external">External Portal</span>' : '<span class="badge badge-society">On-site Registration</span>'}
            </div>

            <h1 style="font-size: 32px; font-weight: 800; line-height: 1.25; margin-bottom: 24px;">
              ${escapeHtml(event.title)}
            </h1>

            <!-- Host Society Banner -->
            ${society ? `
              <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${escapeHtml(society.logo)}" alt="${escapeHtml(society.name)}" style="width: 44px; height: 44px; border-radius: 6px; border: 1px solid var(--border); object-fit: cover;" onerror="this.src='/images/logos/default.svg'">
                  <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-light); text-transform: uppercase;">Organized by</div>
                    <div style="font-size: 16px; font-weight: 700; color: var(--dark);">${escapeHtml(society.name)}</div>
                  </div>
                </div>
                <a href="/society.html?id=${encodeURIComponent(society.id)}" class="btn btn-secondary btn-sm">
                  View Society Page
                </a>
              </div>
            ` : ''}

            <!-- Description -->
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-sm);">
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border);">
                About this Event
              </h2>
              <div class="prose">
                <p>${escapeHtml(event.fullDescription).replace(/\n\n/g, '</p><p>')}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar Info & Registration -->
          <div class="info-sidebar-card">
            <h3 class="info-sidebar-title">Date &amp; Venue Details</h3>

            <div class="info-list">
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <div>
                  <div class="info-item-label">Date</div>
                  <div class="info-item-value">${formatDate(event.date)}</div>
                </div>
              </div>

              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <div>
                  <div class="info-item-label">Time</div>
                  <div class="info-item-value">${escapeHtml(event.time)}</div>
                </div>
              </div>

              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <div>
                  <div class="info-item-label">Campus Venue</div>
                  <div class="info-item-value">${escapeHtml(event.venue)}</div>
                </div>
              </div>

              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div>
                  <div class="info-item-label">Eligibility</div>
                  <div class="info-item-value">All KIIT Students</div>
                </div>
              </div>
            </div>

            <!-- Registration Action Box -->
            ${registrationActionHtml}
          </div>
        </div>
      `;

      // Attach Registration Listener
      const regBtn = document.getElementById('register-btn');
      if (regBtn) {
        regBtn.addEventListener('click', async () => {
          regBtn.disabled = true;
          regBtn.innerHTML = 'Registering...';
          try {
            await registerForEvent(event.id);
            showToast('Registration successful! You are enrolled.', 'success');
            // Refresh event view
            await renderEvent();
          } catch (err) {
            showToast(err.message || 'Failed to complete registration.', 'danger');
            regBtn.disabled = false;
            regBtn.innerHTML = 'Register for this Event (Free)';
          }
        });
      }
    } catch (err) {
      container.innerHTML = `
        <div class="alert alert-danger">
          Failed to load event details. Please verify the link.
        </div>
      `;
    }
  }

  renderEvent();
});
