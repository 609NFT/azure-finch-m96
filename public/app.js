const state = {
  sort: 'createdAt',
  dir: 'desc',
  page: 1,
  perPage: 10,
  filter: '',
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return res.json();
}

let lastBtcPrice = null;

function renderBtcCard() {
  const grid = document.getElementById('stat-grid');
  if (!grid) return;
  let card = document.getElementById('btc-price-card');
  if (!card) {
    card = document.createElement('div');
    card.id = 'btc-price-card';
    card.className = 'stat-card btc-price';
  }
  if (card !== grid.firstChild) {
    grid.insertBefore(card, grid.firstChild);
  }
  const value = lastBtcPrice != null ? ('$' + lastBtcPrice.toLocaleString()) : 'Loading...';
  card.innerHTML =
    '<div class="stat-label">B Bitcoin</div>' +
    '<div class="stat-value">' + value + '</div>' +
    '<div class="stat-delta muted">Live from DexScreener</div>';
}

async function loadBitcoinPrice() {
  renderBtcCard();
  try {
    const { price } = await fetchJSON('/api/bitcoin');
    lastBtcPrice = price;
  } catch (err) {
    console.error('Failed to load Bitcoin price:', err);
  }
  renderBtcCard();
}

async function loadStats() {
  const grid = document.getElementById('stat-grid');
  let stats;
  try {
    ({ stats } = await fetchJSON('/api/stats'));
  } catch (err) {
    grid.innerHTML = '<div class="load-error">Couldn\'t load stats.</div>';
    return;
  }
  grid.innerHTML = stats.map((s) => {
    const positive = s.invert ? s.delta < 0 : s.delta > 0;
    const arrow = (s.invert ? s.delta < 0 : s.delta > 0) ? '▲' : '▼';
    const cls = positive ? 'pos' : 'neg';
    return `
      <div class="stat-card">
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-delta ${cls}">${arrow} ${Math.abs(s.delta)}%</div>
      </div>`;
  }).join('');
  renderBtcCard();
}

let chart = null;
async function loadChart() {
  if (typeof Chart === 'undefined') return;
  let series;
  try {
    ({ series } = await fetchJSON('/api/activity'));
  } catch (err) {
    return;
  }
  const labels = series.map((p) => p.date.slice(5));
  const revenue = series.map((p) => p.revenue);
  const signups = series.map((p) => p.signups);
  const ctx = document.getElementById('chart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenue,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          fill: true,
          tension: 0.35,
          yAxisID: 'y',
        },
        {
          label: 'Signups',
          data: signups,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        y: { position: 'left', grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a91a3' } },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#8a91a3' } },
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a91a3' } },
      },
    },
  });
}

async function loadUsers() {
  const body = document.getElementById('users-body');
  const params = new URLSearchParams({
    page: state.page,
    perPage: state.perPage,
    sort: state.sort,
    dir: state.dir,
    filter: state.filter,
  });
  let rows, total, page, perPage;
  try {
    ({ rows, total, page, perPage } = await fetchJSON(`/api/users?${params}`));
  } catch (err) {
    body.innerHTML = '<tr><td colspan="6" class="load-error">Couldn\'t load users.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((r) => `
    <tr>
      <td>${escape(r.name)}</td>
      <td class="muted">${escape(r.email)}</td>
      <td><span class="pill">${escape(r.plan)}</span></td>
      <td><span class="status status-${r.status}">${escape(r.status)}</span></td>
      <td>$${r.mrr}</td>
      <td class="muted">${new Date(r.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');

  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(total / perPage);
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(`<button class="${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`);
  }
  pagination.innerHTML = buttons.join('');
  pagination.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.page = parseInt(btn.dataset.page, 10);
      loadUsers();
    });
  });

  const arrows = { asc: ' ▲', desc: ' ▼' };
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    const key = th.dataset.sort;
    if (!th.dataset.label) th.dataset.label = th.textContent;
    const active = state.sort === key;
    th.textContent = th.dataset.label + (active ? arrows[state.dir] : '');
    th.setAttribute('aria-sort', active ? (state.dir === 'asc' ? 'ascending' : 'descending') : 'none');
    const activate = () => {
      if (state.sort === key) {
        state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = key;
        state.dir = 'asc';
      }
      state.page = 1;
      loadUsers();
    };
    th.onclick = activate;
    th.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    };
  });
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.getElementById('user-search').addEventListener('input', (e) => {
  state.filter = e.target.value;
  state.page = 1;
  loadUsers();
});

const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebar-backdrop');
if (hamburger && sidebar) {
  const setOpen = (open) => {
    sidebar.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (backdrop) {
      backdrop.classList.toggle('show', open);
      backdrop.hidden = !open;
    }
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  hamburger.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
  if (backdrop) backdrop.addEventListener('click', () => setOpen(false));
  sidebar.querySelectorAll('.nav-item').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) setOpen(false);
  });
}

loadStats();
loadBitcoinPrice();
loadChart();
loadUsers();

// Refresh Bitcoin price every 30 seconds
setInterval(loadBitcoinPrice, 30000);
