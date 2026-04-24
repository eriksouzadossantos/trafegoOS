/* ═══════════════════════════════════════════
   clients.js — Gestão de clientes
   ════════════════════════════════════════ */

let clientFilter = 'todos';

function renderClients() {
  const filtered = clientFilter === 'todos'
    ? DB.clients
    : DB.clients.filter(c => c.status === clientFilter);

  document.getElementById('clients-table').innerHTML = filtered.length
    ? filtered.map(c => `
        <tr onclick="viewClient(${c.id})">
          <td>
            <div class="client-cell">
              <div class="client-av" style="background:${clientColor(c.id)}20;color:${clientColor(c.id)}">${initials(c.name)}</div>
              <div>
                <div style="font-weight:500">${c.name}</div>
                <div class="text-muted" style="font-size:12px">${c.email || c.phone || ''}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-blue">${c.niche}</span></td>
          <td class="text-green font-bold">R$${Number(c.fee || 0).toLocaleString('pt-BR')}</td>
          <td class="text-muted">R$${Number(c.adspend || 0).toLocaleString('pt-BR')}</td>
          <td>${statusBadge(c.status)}</td>
          <td class="text-muted text-sm">Dia ${c.dueday || '—'}</td>
          <td>
            <div style="display:flex;gap:6px" onclick="event.stopPropagation()">
              <button class="btn btn-secondary" style="padding:6px 10px;font-size:12px" onclick="editClient(${c.id})">Editar</button>
              <button class="btn btn-danger"    style="padding:6px 10px;font-size:12px" onclick="deleteClient(${c.id})">Excluir</button>
            </div>
          </td>
        </tr>`).join('')
    : `<tr><td colspan="7">
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <div class="empty-title">Nenhum cliente encontrado</div>
          <div class="empty-sub">Clique em "Novo Cliente" para começar</div>
        </div>
      </td></tr>`;
}

function filterClients(f, el) {
  clientFilter = f;
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderClients();
}

/* ─── ABRIR MODAL ─────────────────────────── */
function openAddClientModal() {
  document.getElementById('client-modal-title').textContent = 'Novo Cliente';
  document.getElementById('edit-client-id').value = '';
  const fields = ['name','contact','email','phone','fee','adspend','dueday','notes','invest','revenue','leads','conversions','cpl','roas'];
  fields.forEach(f => { const el = document.getElementById('f-' + f); if (el) el.value = ''; });
  document.getElementById('f-niche').value    = 'Odontologia';
  document.getElementById('f-status').value   = 'ativo';
  document.getElementById('f-startdate').value = new Date().toISOString().split('T')[0];
  openModal('client-modal');
}

function editClient(id) {
  const c = DB.clients.find(x => x.id === id);
  if (!c) return;
  closeModal('view-client-modal');
  document.getElementById('client-modal-title').textContent = 'Editar Cliente';
  document.getElementById('edit-client-id').value = id;
  const map = {
    name: c.name, contact: c.contact, email: c.email, phone: c.phone,
    fee: c.fee, adspend: c.adspend, dueday: c.dueday, startdate: c.startdate,
    notes: c.notes, invest: c.invest, revenue: c.revenue, leads: c.leads,
    conversions: c.conversions, cpl: c.cpl, roas: c.roas
  };
  Object.entries(map).forEach(([k, v]) => {
    const el = document.getElementById('f-' + k);
    if (el) el.value = v || '';
  });
  document.getElementById('f-niche').value  = c.niche  || 'Odontologia';
  document.getElementById('f-status').value = c.status || 'ativo';
  openModal('client-modal');
}

function saveClient() {
  const name = document.getElementById('f-name').value.trim();
  const fee  = document.getElementById('f-fee').value;
  if (!name) { toast('Preencha o nome do cliente', 'error'); return; }
  if (!fee)  { toast('Preencha a mensalidade', 'error'); return; }

  const editId = document.getElementById('edit-client-id').value;
  const data = {
    name, fee: Number(fee),
    contact:     document.getElementById('f-contact').value,
    email:       document.getElementById('f-email').value,
    phone:       document.getElementById('f-phone').value,
    niche:       document.getElementById('f-niche').value,
    status:      document.getElementById('f-status').value,
    adspend:     Number(document.getElementById('f-adspend').value || 0),
    dueday:      document.getElementById('f-dueday').value,
    startdate:   document.getElementById('f-startdate').value,
    notes:       document.getElementById('f-notes').value,
    invest:      Number(document.getElementById('f-invest').value || 0),
    revenue:     Number(document.getElementById('f-revenue').value || 0),
    leads:       Number(document.getElementById('f-leads').value || 0),
    conversions: Number(document.getElementById('f-conversions').value || 0),
    cpl:         Number(document.getElementById('f-cpl').value || 0),
    roas:        Number(document.getElementById('f-roas').value || 0),
    updatedAt:   new Date().toISOString()
  };

  if (editId) {
    const idx = DB.clients.findIndex(c => c.id === Number(editId));
    if (idx >= 0) DB.clients[idx] = { ...DB.clients[idx], ...data };
  } else {
    data.id        = Date.now();
    data.createdAt = new Date().toISOString();
    DB.clients.push(data);
  }

  saveDB();
  closeModal('client-modal');
  toast(editId ? 'Cliente atualizado!' : 'Cliente adicionado!');
  renderPage(document.querySelector('.page.active')?.id?.replace('page-', ''));
  updateReportSelect();
}

function deleteClient(id) {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
  DB.clients  = DB.clients.filter(c => c.id !== id);
  DB.payments = DB.payments.filter(p => p.clientId !== id);
  saveDB();
  toast('Cliente removido', 'error');
  renderPage(document.querySelector('.page.active')?.id?.replace('page-', ''));
}

function viewClient(id) {
  const c = DB.clients.find(x => x.id === id);
  if (!c) return;
  document.getElementById('vc-title').textContent = c.name;

  const payments  = DB.payments.filter(p => p.clientId === id);
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);

  document.getElementById('vc-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div class="client-av" style="width:56px;height:56px;border-radius:14px;font-size:20px;background:${clientColor(c.id)}20;color:${clientColor(c.id)};display:flex;align-items:center;justify-content:center;font-weight:700">
        ${initials(c.name)}
      </div>
      <div>
        <div style="font-size:18px;font-weight:700">${c.name}</div>
        <div style="display:flex;gap:8px;margin-top:4px">${statusBadge(c.status)}<span class="badge badge-blue">${c.niche}</span></div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div class="text-muted text-sm">Mensalidade</div>
        <div style="font-size:22px;font-weight:800;color:var(--green)">R$${Number(c.fee).toLocaleString('pt-BR')}</div>
      </div>
    </div>
    <div class="report-grid" style="margin-bottom:16px">
      <div class="report-stat"><div class="report-stat-val text-gold">${c.leads || 0}</div><div class="report-stat-lbl">Leads</div></div>
      <div class="report-stat"><div class="report-stat-val text-accent">${c.roas || 0}x</div><div class="report-stat-lbl">ROAS</div></div>
      <div class="report-stat"><div class="report-stat-val text-green">R$${Number(totalPaid).toLocaleString('pt-BR')}</div><div class="report-stat-lbl">Total Pago</div></div>
    </div>
    <div class="divider"></div>
    <div class="grid-2">
      <div>
        <div class="metric-row"><div class="metric-name">Contato</div><div class="metric-val">${c.contact || '—'}</div></div>
        <div class="metric-row"><div class="metric-name">Email</div><div class="metric-val">${c.email || '—'}</div></div>
        <div class="metric-row"><div class="metric-name">WhatsApp</div><div class="metric-val">${c.phone || '—'}</div></div>
        <div class="metric-row"><div class="metric-name">Vencimento</div><div class="metric-val">Dia ${c.dueday || '—'}</div></div>
      </div>
      <div>
        <div class="metric-row"><div class="metric-name">Verba Ads</div><div class="metric-val">R$${Number(c.adspend || 0).toLocaleString('pt-BR')}</div></div>
        <div class="metric-row"><div class="metric-name">Investimento</div><div class="metric-val">R$${Number(c.invest || 0).toLocaleString('pt-BR')}</div></div>
        <div class="metric-row"><div class="metric-name">Conversões</div><div class="metric-val">${c.conversions || 0}</div></div>
        <div class="metric-row"><div class="metric-name">CPL</div><div class="metric-val">R$${c.cpl || 0}</div></div>
      </div>
    </div>
    ${c.notes ? `<div class="divider"></div><div class="text-muted text-sm"><strong>Obs:</strong> ${c.notes}</div>` : ''}
  `;

  document.getElementById('vc-edit-btn').onclick   = () => editClient(id);
  document.getElementById('vc-report-btn').onclick = () => {
    closeModal('view-client-modal');
    goTo('relatorios');
    setTimeout(() => {
      document.getElementById('report-client-select').value = id;
      previewReport();
    }, 100);
  };

  openModal('view-client-modal');
}
