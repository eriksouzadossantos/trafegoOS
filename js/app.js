/* ═══════════════════════════════════════════
   app.js — Navegação, modais e toast
   ════════════════════════════════════════ */

const PAGE_CONFIG = {
  dashboard:     { title: 'Dashboard',     btn: 'Novo Cliente' },
  clientes:      { title: 'Clientes',      btn: 'Novo Cliente' },
  financeiro:    { title: 'Financeiro',    btn: 'Registrar Pagamento' },
  relatorios:    { title: 'Relatórios',    btn: 'Imprimir PDF' },
  meta:          { title: 'Meta Ads BM',   btn: null },
  configuracoes: { title: 'Configurações', btn: 'Salvar' }
};

function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + page + "'")) {
      n.classList.add('active');
    }
  });

  const cfg = PAGE_CONFIG[page];
  document.getElementById('page-title').textContent = cfg.title;

  const pb = document.getElementById('topbar-primary-btn');
  if (cfg.btn) {
    pb.style.display = 'inline-flex';
    document.getElementById('topbar-btn-text').textContent = cfg.btn;
  } else {
    pb.style.display = 'none';
  }

  renderPage(page);
}

function renderPage(page) {
  if (page === 'dashboard')     renderDashboard();
  else if (page === 'clientes') renderClients();
  else if (page === 'financeiro') renderFinanceiro();
  else if (page === 'relatorios') renderRelatorios();
  else if (page === 'meta')     renderMeta();
  else if (page === 'configuracoes') renderConfig();
  updateNavBadge();
}

function topbarAction() {
  const active = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (active === 'dashboard' || active === 'clientes') openAddClientModal();
  else if (active === 'financeiro') openAddPaymentModal();
  else if (active === 'relatorios') printReport();
  else if (active === 'configuracoes') saveConfig();
}

function updateNavBadge() {
  const count = DB.clients.filter(c => c.status === 'ativo').length;
  document.getElementById('nav-badge').textContent = count;
}

/* ─── MODAIS ──────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ─── TOAST ───────────────────────────────── */
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.className = 'toast ' + type;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ─── INIT ────────────────────────────────── */
renderDashboard();
updateNavBadge();
updateReportSelect();
