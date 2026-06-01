const THEMES = {
  indigo: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(180,220,255,0.45) 0%, rgba(56,189,248,0.25) 20%, rgba(99,102,241,0.08) 50%, transparent 75%)',
    badgeColor: '#a5b4fc',
    accentClass: 'indigo',
    accentHex: '#6366f1',
    statFirstBg: '#4338CA',
    statFirstText: '#ffffff',
    statOtherBg: '#000000',
    statAccentColor: '#818cf8',
    barColor: '#6366f1',
    impactAccent: '#818cf8'
  },
  emerald: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(180,255,220,0.45) 0%, rgba(52,211,153,0.25) 20%, rgba(16,185,129,0.08) 50%, transparent 75%)',
    badgeColor: '#6ee7b7',
    accentClass: 'emerald',
    accentHex: '#10b981',
    statFirstBg: '#059669',
    statFirstText: '#ffffff',
    statOtherBg: '#000000',
    statAccentColor: '#34d399',
    barColor: '#10b981',
    impactAccent: '#34d399'
  },
  amber: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(255,237,180,0.45) 0%, rgba(251,191,36,0.25) 20%, rgba(245,158,11,0.08) 50%, transparent 75%)',
    badgeColor: '#fcd34d',
    accentClass: 'amber',
    accentHex: '#f59e0b',
    statFirstBg: '#d97706',
    statFirstText: '#ffffff',
    statOtherBg: '#000000',
    statAccentColor: '#fbbf24',
    barColor: '#f59e0b',
    impactAccent: '#fbbf24'
  },
  violet: {
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(210,180,255,0.45) 0%, rgba(167,139,250,0.25) 20%, rgba(139,92,246,0.08) 50%, transparent 75%)',
    badgeColor: '#c4b5fd',
    accentClass: 'violet',
    accentHex: '#8b5cf6',
    statFirstBg: '#7c3aed',
    statFirstText: '#ffffff',
    statOtherBg: '#000000',
    statAccentColor: '#a78bfa',
    barColor: '#8b5cf6',
    impactAccent: '#a78bfa'
  }
};

async function loadHero() {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();

    const page = new URLSearchParams(window.location.search).get('page') || 'banking';
    const content = data[page];
    if (!content) return;

    const theme = THEMES[content.variant] || THEMES.indigo;

    /* ---- APPLY VARIANT THEME ---- */
    const glowEl = document.getElementById('hero-glow');
    if (glowEl) glowEl.style.background = theme.glow;

    const badgeEl = document.getElementById('hero-badge');
    if (badgeEl) badgeEl.style.color = theme.badgeColor;

    /* ---- HERO ---- */
    const hero = content.hero;
    if (hero) {
      if (badgeEl) badgeEl.textContent = hero.badge;
      document.getElementById('hero-title').textContent = hero.title;
      document.getElementById('hero-description').textContent = hero.description;
      document.getElementById('hero-img').src = hero.image;
    }

    /* ---- USE CASES ---- */
    const useCases = content.useCases;
    if (useCases) {
      document.getElementById('usecase-title').innerHTML = useCases.title;
      document.getElementById('usecase-subtitle').textContent = useCases.subtitle;

      const grid = document.getElementById('usecase-grid');
      grid.innerHTML = '';
      useCases.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300';
        card.innerHTML = `
          <i class="${item.icon} text-3xl mb-6" style="color:${theme.accentHex}"></i>
          <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
          <p class="text-gray-600 text-sm">${item.description}</p>
        `;
        grid.appendChild(card);
      });
    }

    /* ---- STATS ---- */
    const stats = content.stats;
    if (stats) {
      const statsGrid = document.getElementById('stats-grid');
      statsGrid.innerHTML = '';
      stats.forEach((item, index) => {
        const div = document.createElement('div');
        if (index === 0) {
          div.style.cssText = `background:${theme.statFirstBg}; padding:2.5rem 2rem; text-align:center;`;
          div.innerHTML = `
            <p style="font-weight:900; font-size:2.25rem; color:${theme.statFirstText}; margin:0">${item.value}</p>
            <p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:${theme.statFirstText}; opacity:0.75; margin-top:0.25rem">${item.label}</p>
          `;
        } else {
          const borderRight = index < stats.length - 1 ? 'border-right:1px solid rgba(255,255,255,0.12);' : '';
          div.style.cssText = `background:#000; padding:2.5rem 2rem; text-align:center; ${borderRight}`;
          div.innerHTML = `
            <p style="font-weight:700; font-size:2.25rem; color:${theme.statAccentColor}; margin:0">${item.value}</p>
            <p style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:${theme.statAccentColor}; opacity:0.8; margin-top:0.25rem">${item.label}</p>
          `;
        }
        statsGrid.appendChild(div);
      });
    }

    /* ---- SERVICES ---- */
    const services = content.services;
    if (services) {
      document.getElementById('services-title').textContent = services.title;
      const grid = document.getElementById('services-grid');
      grid.innerHTML = '';
      services.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300';
        card.innerHTML = `
          <i class="fas ${item.icon} text-3xl mb-6" style="color:${theme.accentHex}"></i>
          <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
          <p class="text-gray-600 text-sm">${item.desc}</p>
        `;
        grid.appendChild(card);
      });
    }

    /* ---- WHY SECTION ---- */
    const why = content.why;
    if (why) {
      document.getElementById('why-title').innerHTML = why.title.replace(
        'ThunderGits',
        `<span style="color:${theme.accentHex}">ThunderGits</span>`
      );
      document.getElementById('why-description').textContent = why.description;

      const featuresContainer = document.getElementById('why-features');
      featuresContainer.innerHTML = '';
      why.features.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex items-start gap-4';
        div.innerHTML = `
          <div class="w-10 h-10 flex items-center justify-center rounded-xl" style="background:${theme.accentHex}22">
            <i class="fas ${item.icon}" style="color:${theme.accentHex}"></i>
          </div>
          <div>
            <h3 class="font-semibold">${item.title}</h3>
            <p class="text-gray-400 text-sm">${item.desc}</p>
          </div>
        `;
        featuresContainer.appendChild(div);
      });

      const impactContainer = document.getElementById('why-impact');
      impactContainer.innerHTML = '';
      why.impact.forEach(item => {
        const percent = parseInt(item.value);
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="text-gray-300 text-sm">${item.label}</span>
            <span style="color:${theme.impactAccent}" class="font-bold">+${percent}%</span>
          </div>
          <div class="w-full bg-white/10 h-2 rounded-full mt-2">
            <div class="h-2 rounded-full" style="width:${percent}%; background:${theme.barColor}"></div>
          </div>
        `;
        impactContainer.appendChild(div);
      });
    }

  } catch (error) {
    console.error('Error loading page data:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadHero);
