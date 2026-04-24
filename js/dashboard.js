/* ═══════════════════════════════════════════
   dashboard.js — Dashboard e gráfico
   ════════════════════════════════════════ */

let revenueChartInst = null;

function renderDashboard() {
  const active   = DB.clients.filter(c => c.status === 'ativo');
  const totalMR  = active.reduce((s, c) => s + Number(c.fee || 0), 0);
  const totalLeads = DB.clients.reduce((s, c) => s + Number(c.leads || 0), 0);
  const totalAds   = DB.clients.reduce((s, c) => s + Number(c.invest || 0), 0);
  const avgROAS    = DB.clients.length
    ? (DB.clients.reduce((s, c) => s + Number(c.roas || 0), 0) / DB.clients.length).toFixed(1)
    : '0.0';

  document.getElementById('dash-stats').innerHTML = `
    <div class="card stat-card">
      <div class="stat-icon blue">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="stat-label">Clientes Ativos</div>
      <div class="stat-value">${active.length}</div>
      <div class="stat-change up">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        Total: ${DB.clients.length}
      </div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon green">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="stat-label">Receita Recorrente</div>
      <div class="stat-value">R$${totalMR.toLocaleString('pt-BR')}</div>
      <div class="stat-change up">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        Mensal
      </div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon gold">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div class="stat-label">Leads Gerados</div>
      <div class="stat-value">${totalLeads.toLocaleString('pt-BR')}</div>
      <div class="stat-change up">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        Este mês
      </div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon purple">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
      </div>
      <div class="stat-label">ROAS Médio</div>
      <div class="stat-value">${avgROAS}x</div>
      <div class="stat-change up">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        Ads: R$${totalAds.toLocaleString('pt-BR')}
      </div>
    </div>
  `;

  renderRevenueChart(6);

  /* Atividade recente */
  const activity = [...DB.payments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  document.getElementById('recent-activity').innerHTML = activity.length
    ? activity.map(p => {
        const cl = DB.clients.find(c => c.id === p.clientId);
        return `
          <div class="payment-row">
            <div class="payment-info">
              <div class="payment-icon">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <div class="payment-name" style="font-size:13px">${cl ? cl.name : 'Cliente'}</div>
                <div class="payment-date">${formatDate(p.date)}</div>
              </div>
            </div>
            <div class="payment-amount" style="font-size:13px">+R$${Number(p.amount).toLocaleString('pt-BR')}</div>
          </div>`;
      }).join('')
    : '<div class="text-muted text-sm" style="padding:12px 0">Nenhum pagamento registrado</div>';

  /* Tabela clientes ativos */
  const rows = DB.clients.filter(c => c.status === 'ativo').slice(0, 5);
  document.getElementById('dash-clients-table').innerHTML = rows.length
    ? rows.map(c => `
        <tr onclick="viewClient(${c.id})">
          <td>
            <div class="client-cell">
              <div class="client-av" style="background:${clientColor(c.id)}20;color:${clientColor(c.id)}">${initials(c.name)}</div>
              ${c.name}
            </div>
          </td>
          <td><span class="badge badge-blue">${c.niche}</span></td>
          <td class="text-green font-bold">R$${Number(c.fee).toLocaleString('pt-BR')}</td>
          <td>${statusBadge(c.status)}</td>
          <td>${c.roas ? c.roas + 'x' : '—'}</td>
          <td class="text-muted text-sm">Dia ${c.dueday || '—'}</td>
        </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted)">Nenhum cliente ativo. Adicione seu primeiro cliente!</td></tr>';
}

function renderRevenueChart(months) {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  if (revenueChartInst) revenueChartInst.destroy();

  const labels = [];
  const data   = [];
  const now    = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));

    const monthPayments = DB.payments.filter(p => {
      const pd = new Date(p.date);
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    });

    const base = DB.clients.filter(c => c.status === 'ativo').reduce((s, c) => s + Number(c.fee || 0), 0);
    data.push(monthPayments.length
      ? monthPayments.reduce((s, p) => s + Number(p.amount), 0)
      : Math.floor(base * (.7 + Math.random() * .5))
    );
  }

  revenueChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Faturamento',
        data,
        borderColor: '#4f7cff',
        backgroundColor: 'rgba(79,124,255,.1)',
        fill: true,
        tension: .4,
        pointBackgroundColor: '#4f7cff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#6b7a9f', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#6b7a9f', font: { size: 11 }, callback: v => 'R$' + v.toLocaleString('pt-BR') } }
      }
    }
  });
}

function updateChart(v) { renderRevenueChart(parseInt(v)); }
