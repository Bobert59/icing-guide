// Icing solver guide: shared navigation, theme toggle, previous/next links,
// maths (KaTeX) and code highlighting. Every page includes this one file, so
// the page list below is the single source of truth for the site's order.
(function () {
  const PAGES = [
    { group: 'Start here' },
    { href: 'index.html', title: 'Home' },
    { href: 'overview.html', num: '1', title: 'The big picture' },
    { href: 'basics.html', num: '2', title: 'Icing physics in plain words' },
    { group: 'One icing cycle, step by step' },
    { href: 'airflow.html', num: '3', title: 'Airflow with SU2' },
    { href: 'droplets.html', num: '4', title: 'Droplets and collection' },
    { href: 'thermo.html', num: '5', title: 'The freezing energy balance' },
    { href: 'film.html', num: '6', title: 'Water film and runback' },
    { href: 'solid.html', num: '7', title: 'Heat inside the ice' },
    { href: 'growth.html', num: '8', title: 'Growing the ice surface' },
    { href: 'mesh.html', num: '9', title: 'Refining, deforming, remeshing' },
    { group: 'Advanced' },
    { href: 'glaze.html', num: '10', title: 'Glaze: phase-aware ice' },
    { href: 'campaign.html', num: '11', title: 'Running a campaign' },
    { href: 'validation.html', num: '12', title: 'How we know it works' },
    { group: 'Reference' },
    { href: 'code-map.html', num: '13', title: 'Code map' },
    { href: 'glossary.html', num: '14', title: 'Glossary' },
  ];

  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pages = PAGES.filter(p => p.href);

  // Theme: remembered per browser; failures (private mode, file://) are harmless.
  function getTheme() { try { return localStorage.getItem('icing-guide-theme'); } catch (e) { return null; } }
  function setTheme(t) { try { localStorage.setItem('icing-guide-theme', t); } catch (e) {} }
  const saved = getTheme();
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  function buildSidebar() {
    const side = document.querySelector('.sidebar');
    if (!side) return;
    let html = '<a class="brand" href="index.html">' +
      '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M3 15 C 6 7, 14 4, 24 9 L 24 12 C 15 9, 9 11, 6 17 Z" fill="var(--accent)"/>' +
      '<path d="M3 15 C 2 18, 4 20, 7 19 L 24 13 L 24 12 C 15 9, 9 11, 6 17 Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1"/></svg>' +
      'Icing Solver Guide</a><nav class="nav">';
    for (const p of PAGES) {
      if (p.group) { html += `<div class="nav-group">${p.group}</div>`; continue; }
      const active = p.href.toLowerCase() === here ? ' class="active" aria-current="page"' : '';
      html += `<a href="${p.href}"${active}><span class="num">${p.num || ''}</span><span>${p.title}</span></a>`;
    }
    html += '</nav><button class="theme-toggle" type="button">Switch light / dark</button>';
    side.innerHTML = html;
    side.querySelector('.theme-toggle').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
    });
  }

  function buildPager() {
    const content = document.querySelector('.content');
    if (!content || content.querySelector('.pager')) return;
    const i = pages.findIndex(p => p.href.toLowerCase() === here);
    if (i < 0) return;
    const prev = pages[i - 1], next = pages[i + 1];
    let html = '<div class="pager">';
    html += prev ? `<a class="prev" href="${prev.href}"><small>&larr; Previous</small>${prev.title}</a>` : '<span></span>';
    html += next ? `<a class="next" href="${next.href}"><small>Next &rarr;</small>${next.title}</a>` : '<span></span>';
    content.insertAdjacentHTML('beforeend', html + '</div>');
  }

  function buildMobileBar() {
    const main = document.querySelector('main');
    if (!main) return;
    main.insertAdjacentHTML('afterbegin',
      '<div class="mobile-bar"><strong>Icing Solver Guide</strong><button type="button" aria-label="Menu">Menu</button></div>');
    main.querySelector('.mobile-bar button').addEventListener('click', e => {
      e.stopPropagation(); document.body.classList.toggle('nav-open');
    });
    document.addEventListener('click', e => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.sidebar')) document.body.classList.remove('nav-open');
    });
  }

  function renderMath() {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }],
        throwOnError: false,
      });
    }
  }
  function highlight() {
    if (window.hljs) document.querySelectorAll('pre code').forEach(el => window.hljs.highlightElement(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildSidebar(); buildMobileBar(); buildPager(); highlight();
  });
  window.addEventListener('load', renderMath);
})();
