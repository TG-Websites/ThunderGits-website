const THEMES = {
  indigo: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(180,220,255,0.45) 0%, rgba(56,189,248,0.25) 20%, rgba(99,102,241,0.08) 50%, transparent 75%)',
    badgeColor: '#a5b4fc', accentHex: '#6366f1',
    statFirstBg: '#4338CA', statAccentColor: '#818cf8', barColor: '#6366f1',
    ctaBg: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)', ctaTextColor: '#6366f1',
    whyGlow: '#6366f1'
  },
  emerald: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(180,255,220,0.45) 0%, rgba(52,211,153,0.25) 20%, rgba(16,185,129,0.08) 50%, transparent 75%)',
    badgeColor: '#6ee7b7', accentHex: '#10b981',
    statFirstBg: '#059669', statAccentColor: '#34d399', barColor: '#10b981',
    ctaBg: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', ctaTextColor: '#10b981',
    whyGlow: '#10b981'
  },
  amber: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(255,237,180,0.45) 0%, rgba(251,191,36,0.25) 20%, rgba(245,158,11,0.08) 50%, transparent 75%)',
    badgeColor: '#fcd34d', accentHex: '#f59e0b',
    statFirstBg: '#d97706', statAccentColor: '#fbbf24', barColor: '#f59e0b',
    ctaBg: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)', ctaTextColor: '#f59e0b',
    whyGlow: '#f59e0b'
  },
  violet: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(210,180,255,0.45) 0%, rgba(167,139,250,0.25) 20%, rgba(139,92,246,0.08) 50%, transparent 75%)',
    badgeColor: '#c4b5fd', accentHex: '#8b5cf6',
    statFirstBg: '#7c3aed', statAccentColor: '#a78bfa', barColor: '#8b5cf6',
    ctaBg: 'linear-gradient(135deg, #2e1065 0%, #3b0764 100%)', ctaTextColor: '#8b5cf6',
    whyGlow: '#8b5cf6'
  }
};

/* ─── show a section ─── */
function showSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // for elements using style="display:none" (flex sections)
  if (el.style.display === 'none') { el.style.display = ''; return; }
  // for elements using class="hidden …"
  el.classList.remove('hidden');
}

/* ─── HERO ─── */
function populateHero(content, theme) {
  const h = content.hero;
  const glow = document.getElementById('hero-glow');
  if (glow) glow.style.background = theme.glow;

  const badge = document.getElementById('hero-badge');
  if (badge) { badge.textContent = h.badge; badge.style.color = theme.badgeColor; }

  document.getElementById('hero-title').textContent = h.title;
  document.getElementById('hero-description').textContent = h.description;
  document.getElementById('hero-img').src = h.image;

  const cta = document.getElementById('hero-cta-primary');
  if (cta) cta.style.background = theme.accentHex;
}

/* ─── USE CASES ─── */
function populateUseCases(content, theme) {
  const u = content.useCases;
  document.getElementById('usecase-title').innerHTML = u.title;
  document.getElementById('usecase-subtitle').textContent = u.subtitle;
  const grid = document.getElementById('usecase-grid');
  grid.innerHTML = '';
  u.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300';
    card.innerHTML = `
      <i class="${item.icon} text-3xl mb-6" style="color:${theme.accentHex}"></i>
      <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
      <p class="text-gray-600 text-sm leading-relaxed">${item.description}</p>`;
    grid.appendChild(card);
  });
}

/* ─── FEATURES LIST (alternating rows) ─── */
function populateFeatures(content, theme) {
  const f = content.features;
  document.getElementById('features-title').innerHTML = f.title;
  document.getElementById('features-subtitle').textContent = f.subtitle || '';
  const list = document.getElementById('features-list');
  list.innerHTML = '';
  f.items.forEach((item, i) => {
    const isEven = i % 2 === 0;
    const row = document.createElement('div');
    row.className = `flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center bg-white rounded-3xl p-10 shadow-sm border border-gray-100`;
    row.innerHTML = `
      <div class="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-3xl" style="background:${theme.accentHex}18">
        <i class="${item.icon}" style="color:${theme.accentHex}"></i>
      </div>
      <div class="flex-1">
        <h3 class="text-2xl font-bold mb-3">${item.title}</h3>
        <p class="text-gray-600 leading-relaxed">${item.description}</p>
      </div>`;
    list.appendChild(row);
  });
}

/* ─── HIGHLIGHT ─── */
function populateHighlight(content, theme) {
  const h = content.highlight;
  const bg = document.getElementById('highlight-bg');
  if (bg) bg.style.backgroundImage = `url('${h.image}')`;

  document.getElementById('highlight-badge').textContent = h.badge;
  document.getElementById('highlight-title').textContent = h.title;
  document.getElementById('highlight-description').textContent = h.description;

  const cta = document.getElementById('highlight-cta');
  if (cta) { cta.style.background = theme.accentHex; }

  const statsEl = document.getElementById('highlight-stats');
  if (statsEl && h.stats) {
    statsEl.innerHTML = '';
    h.stats.forEach(s => {
      const div = document.createElement('div');
      div.className = 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center text-white';
      div.innerHTML = `<p class="text-3xl font-black mb-1" style="color:${theme.badgeColor}">${s.value}</p><p class="text-xs font-bold uppercase tracking-widest opacity-70">${s.label}</p>`;
      statsEl.appendChild(div);
    });
  }
}

/* ─── STATS ─── */
function populateStats(content, theme) {
  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = '';
  content.stats.forEach((item, i) => {
    const div = document.createElement('div');
    if (i === 0) {
      div.style.cssText = `background:${theme.statFirstBg};padding:2.5rem 2rem;text-align:center;`;
      div.innerHTML = `<p style="font-weight:900;font-size:2.25rem;color:#fff;margin:0">${item.value}</p><p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#fff;opacity:.75;margin-top:.25rem">${item.label}</p>`;
    } else {
      const border = i < content.stats.length - 1 ? `border-right:1px solid rgba(255,255,255,0.12);` : '';
      div.style.cssText = `background:#000;padding:2.5rem 2rem;text-align:center;${border}`;
      div.innerHTML = `<p style="font-weight:700;font-size:2.25rem;color:${theme.statAccentColor};margin:0">${item.value}</p><p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:${theme.statAccentColor};opacity:.8;margin-top:.25rem">${item.label}</p>`;
    }
    statsGrid.appendChild(div);
  });
}

/* ─── PROCESS ─── */
function populateProcess(content, theme) {
  const p = content.process;
  document.getElementById('process-title').innerHTML = p.title;
  document.getElementById('process-subtitle').textContent = p.subtitle || '';
  const steps = document.getElementById('process-steps');
  steps.innerHTML = '';
  p.steps.forEach((step, i) => {
    const div = document.createElement('div');
    div.className = 'relative p-8 rounded-2xl border-2 border-gray-100 hover:border-opacity-100 transition duration-300';
    div.style.borderColor = `${theme.accentHex}30`;
    div.innerHTML = `
      <div class="text-5xl font-black mb-4 leading-none" style="color:${theme.accentHex}18">${String(i + 1).padStart(2, '0')}</div>
      <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background:${theme.accentHex}">
        <i class="fas ${step.icon} text-white text-sm"></i>
      </div>
      <h3 class="text-lg font-bold mb-2">${step.title}</h3>
      <p class="text-gray-500 text-sm leading-relaxed">${step.desc}</p>`;
    steps.appendChild(div);
  });
}

/* ─── SERVICES ─── */
function populateServices(content, theme) {
  const s = content.services;
  document.getElementById('services-title').textContent = s.title;
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '';
  s.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300';
    card.innerHTML = `
      <i class="fas ${item.icon} text-3xl mb-6" style="color:${theme.accentHex}"></i>
      <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
      <p class="text-gray-600 text-sm leading-relaxed">${item.desc}</p>`;
    grid.appendChild(card);
  });
}

/* ─── WHY ─── */
function populateWhy(content, theme) {
  const w = content.why;
  document.getElementById('why-title').innerHTML = w.title.replace('ThunderGits', `<span style="color:${theme.accentHex}">ThunderGits</span>`);
  document.getElementById('why-description').textContent = w.description;

  const glowEl = document.getElementById('why-glow');
  if (glowEl) glowEl.style.background = `${theme.whyGlow}33`;

  const featuresEl = document.getElementById('why-features');
  featuresEl.innerHTML = '';
  w.features.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-4';
    div.innerHTML = `
      <div class="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl" style="background:${theme.accentHex}22">
        <i class="fas ${item.icon}" style="color:${theme.accentHex}"></i>
      </div>
      <div><h3 class="font-semibold">${item.title}</h3><p class="text-gray-400 text-sm">${item.desc}</p></div>`;
    featuresEl.appendChild(div);
  });

  const impactEl = document.getElementById('why-impact');
  impactEl.innerHTML = '';
  w.impact.forEach(item => {
    const pct = parseInt(item.value);
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="text-gray-300 text-sm">${item.label}</span>
        <span style="color:${theme.statAccentColor}" class="font-bold">+${pct}%</span>
      </div>
      <div class="w-full bg-white/10 h-2 rounded-full mt-2">
        <div class="h-2 rounded-full" style="width:${pct}%;background:${theme.barColor}"></div>
      </div>`;
    impactEl.appendChild(div);
  });
}

/* ─── CTA BANNER ─── */
function populateCta(content, theme) {
  const c = content.cta;
  const section = document.getElementById('section-cta');
  if (section) section.style.background = theme.ctaBg;

  document.getElementById('cta-badge').textContent = c.badge || content.hero.badge;
  document.getElementById('cta-title').textContent = c.title;
  document.getElementById('cta-subtitle').textContent = c.subtitle;

  const btn = document.getElementById('cta-btn');
  if (btn) btn.style.color = theme.ctaTextColor;
}

/* ─── POPULATE MAP ─── */
const POPULATORS = {
  'hero':       populateHero,
  'use-cases':  populateUseCases,
  'features':   populateFeatures,
  'highlight':  populateHighlight,
  'stats':      populateStats,
  'process':    populateProcess,
  'services':   populateServices,
  'why':        populateWhy,
  'cta':        populateCta
};

/* ─── MAIN ─── */
async function loadPage() {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();

    const page = new URLSearchParams(window.location.search).get('page') || 'banking';
    const content = data[page];
    if (!content) return;

    const theme = THEMES[content.variant] || THEMES.indigo;
    const sections = content.sections || ['hero', 'use-cases', 'stats', 'services', 'why'];

    sections.forEach(key => {
      const populate = POPULATORS[key];
      if (populate) populate(content, theme);
      showSection('section-' + key);
    });

  } catch (err) {
    console.error('Error loading page data:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadPage);
