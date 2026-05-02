async function loadHero() {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();

    const page = new URLSearchParams(window.location.search).get("page") || "banking";
    const content = data[page];

    if (!content) return;

    /* ---------------- HERO ---------------- */
    const hero = content.hero;

    if (hero) {
      document.getElementById("hero-badge").textContent = hero.badge;
      document.getElementById("hero-title").textContent = hero.title;
      document.getElementById("hero-description").textContent = hero.description;
    }

    /* ---------------- USE CASES ---------------- */
    const useCases = content.useCases;

    if (useCases) {
      document.getElementById("usecase-title").innerHTML = useCases.title;
      document.getElementById("usecase-subtitle").textContent = useCases.subtitle;

      const grid = document.getElementById("usecase-grid");
      grid.innerHTML = "";

      useCases.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition duration-300";

        card.innerHTML = `
          <i class="${item.icon} text-indigo-500 text-3xl mb-6"></i>
          <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
          <p class="text-gray-600 text-sm">${item.description}</p>
        `;

        grid.appendChild(card);
      });
    }

    /* ---------------- STATS ---------------- */
    const stats = content.stats;

    if (stats) {
      const statsGrid = document.getElementById("stats-grid");
      statsGrid.innerHTML = "";

      stats.forEach((item, index) => {
        const div = document.createElement("div");

        if (index === 0) {
          div.className = "px-8 py-10 text-center bg-primary";
          div.innerHTML = `
            <p class="syne font-black text-4xl text-black">${item.value}</p>
            <p class="text-xs font-bold uppercase tracking-widest text-black/60 mt-1">${item.label}</p>
          `;
        } else {
          div.className = "px-8 py-10 text-center bg-black border-r border-white/90";

          if (index === stats.length - 1) {
            div.classList.remove("border-r");
          }

          div.innerHTML = `
            <p class="syne text-primary font-semibold text-4xl">${item.value}</p>
            <p class="text-xs text-primary font-semibold uppercase tracking-widest mt-1">${item.label}</p>
          `;
        }

        statsGrid.appendChild(div);
      });
    }

    /* ---------------- WHY SECTION ---------------- */
    const why = content.why;

    if (why) {
      document.getElementById("why-title").innerHTML =
        why.title.replace("ThunderGits", `<span class="text-indigo-400">ThunderGits</span>`);

      document.getElementById("why-description").textContent = why.description;

      // Features
      const featuresContainer = document.getElementById("why-features");
      featuresContainer.innerHTML = "";

      why.features.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex items-start gap-4";

        div.innerHTML = `
          <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-500/20">
            <i class="fas ${item.icon} text-indigo-400"></i>
          </div>
          <div>
            <h3 class="font-semibold">${item.title}</h3>
            <p class="text-gray-400 text-sm">${item.desc}</p>
          </div>
        `;

        featuresContainer.appendChild(div);
      });

      // Impact bars
      const impactContainer = document.getElementById("why-impact");
      impactContainer.innerHTML = "";

      why.impact.forEach(item => {
        const percent = parseInt(item.value);

        const div = document.createElement("div");

        div.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="text-gray-300 text-sm">${item.label}</span>
            <span class="text-indigo-400 font-bold">+${percent}%</span>
          </div>

          <div class="w-full bg-white/10 h-2 rounded-full mt-2">
            <div class="bg-indigo-500 h-2 rounded-full" style="width: ${percent}%"></div>
          </div>
        `;

        impactContainer.appendChild(div);
      });
    }

    /* ---------------- SERVICES ---------------- */
const services = content.services;

if (services) {
  document.getElementById("services-title").innerHTML =
    services.title.replace("Neo Banks", `<span class="text-indigo-500">Neo Banks</span>`);

  const grid = document.getElementById("services-grid");
  grid.innerHTML = "";

  services.items.forEach(item => {
    const card = document.createElement("div");

    card.className =
      "p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300";

    card.innerHTML = `
      <i class="fas ${item.icon} text-indigo-500 text-3xl mb-6"></i>
      <h3 class="text-xl font-semibold mb-3">${item.title}</h3>
      <p class="text-gray-600 text-sm">${item.desc}</p>
    `;

    grid.appendChild(card);
  });
}

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadHero);