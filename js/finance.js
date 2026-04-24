/* ═══════════════════════════════════════════
   finance.js — Módulo financeiro
   ════════════════════════════════════════ */

function renderFinanceiro() {
  const now          = new Date();
  const thisMonth    = now.getMonth();
  const thisYear     = now.getFullYear();
  const totalReceived = DB.payments.reduce((s, p) => s + Number(p.amount), 0);
  const monthPayments = DB.payments.filter(p => {
    const d = new Date(p.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthTotal = monthPayments.reduce((s, p) => s + Number(p.amount), 0);
  const mrr        = DB.clients.filter(c => c.status === 'ativo').reduce((s, c) => s + Number(c.fee || 0), 0);

  document.getElementById('fin-stats').innerHTML = `
    <div class="card stat-card">
      <div class="stat-icon green">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22"/><rect x="2" y="7" width="20" height="5"/><path d="M6 12v10M10 12v10M14 12v10M18 12v10M2 7l10-5 10 5"/></svg>
      </div>
      <div class="stat-label">Total Recebido</div>
      <div class="stat-value">R$${totalReceived.toLocaleString('pt-BR')}</div>
      <div class="stat-change up">${DB.payments.length} pagamentos registrados</div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon blue">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      </div>
      <div class="stat-label">Recebido Este Mês</div>
      <div class="stat-value">R$${monthTotal.toLocaleString('pt-BR')}</div>
      <div class="stat-change up">${monthPayments.length} pagamentos este mês</div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon gold">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
      </div>
      <div class="stat-label">MRR (Recorrência)</div>
      <div class="stat-value">R$${mrr.toLocaleString('pt-BR')}</div>
      <div class="stat-change up">por mês em contratos ativos</div>
    </div>
  `;

  /* Histórico de pagamentos */
  const payments = [...DB.payments].sort((a, b) => new Date(b.date) - new Date(a.date));
  document.getElementById('payment-history').innerHTML = payments.length
    ? payments.map(p => {
        const cl = DB.clients.find(c => c.id === p.clientId);
        return `
          <div class="payment-row">
            <div class="payment-info">
              <div class="payment-icon">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <div class="payment-name">${cl ? cl.name : 'Cliente removido'}</div>
                <div class="payment-date">${formatDate(p.date)} · ${p.ref || ''} · ${p.method || 'PIX'}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="payment-amount">+R$${Number(p.amount).toLocaleString('pt-BR')}</div>
              <button onclick="deletePayment(${p.id})" class="btn btn-danger" style="padding:4px 8px;font-size:11px">×</button>
            </div>
          </div>`;
      }).join('')
    : `<div class="empty-state">
        <div class="empty-title">Nenhum pagamento registrado</div>
        <div class="empty-sub">Clique em "Registrar Pagamento" para começar</div>
      </div>`;

  /* Vencimentos */
  const today    = new Date();
  const upcoming = DB.clients.filter(c => c.status === 'ativo' && c.dueday).sort((a, b) => a.dueday - b.dueday);
  document.getElementById('upcoming-payments').innerHTML = upcoming.length
    ? upcoming.map(c => {
        const due  = new Date(today.getFullYear(), today.getMonth(), Number(c.dueday));
        if (due < today) due.setMonth(due.getMonth() + 1);
        const diff   = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        const urgent = diff <= 3;
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:13px;font-weight:500">${c.name}</div>
              <div style="font-size:11px;color:${urgent ? 'var(--red)' : 'var(--muted)'}">
                ${diff <= 0 ? 'Vencido hoje' : `em ${diff} dia${diff !== 1 ? 's' : ''}`}
              </div>
            </div>
            <div style="font-size:14px;font-weight:700;color:var(--green)">R$${Number(c.fee).toLocaleString('pt-BR')}</div>
          </div>`;
      }).join('')
    : '<div class="text-muted text-sm" style="padding:8px 0">Nenhum vencimento configurado</div>';
}

function openAddPaymentModal() {
  const sel = document.getElementById('pay-client');
  sel.innerHTML = DB.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('pay-date').value   = new Date().toISOString().split('T')[0];
  document.getElementById('pay-amount').value = '';
  document.getElementById('pay-ref').value    = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  openModal('payment-modal');
}

function savePayment() {
  const clientId = Number(document.getElementById('pay-client').value);
  const amount   = document.getElementById('pay-amount').value;
  const date     = document.getElementById('pay-date').value;
  if (!clientId || !amount || !date) { toast('Preencha os campos obrigatórios', 'error'); return; }

  DB.payments.push({
    id:       Date.now(),
    clientId, amount: Number(amount), date,
    ref:    document.getElementById('pay-ref').value,
    method: document.getElementById('pay-method').value,
    note:   document.getElementById('pay-note').value
  });

  saveDB();
  closeModal('payment-modal');
  toast('Pagamento registrado!');
  renderFinanceiro();
}

function deletePayment(id) {
  DB.payments = DB.payments.filter(p => p.id !== id);
  saveDB();
  toast('Pagamento removido', 'error');
  renderFinanceiro();
}
