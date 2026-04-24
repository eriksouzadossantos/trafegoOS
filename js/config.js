/* ═══════════════════════════════════════════
   reports.js — Gerador de relatórios
   ════════════════════════════════════════ */

function renderRelatorios() { updateReportSelect(); }

function updateReportSelect() {
  const sel = document.getElementById('report-client-select');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">Selecionar cliente...</option>'
    + DB.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  if (cur) sel.value = cur;
}

function previewReport() {
  const id     = Number(document.getElementById('report-client-select').value);
  const period = document.getElementById('report-period').value;
  if (!id) { document.getElementById('report-preview').innerHTML = ''; return; }

  const c = DB.clients.find(x => x.id === id);
  if (!c) return;

  const agency      = DB.config.agencyName || 'Minha Agência';
  const color       = DB.config.color || '#4f7cff';
  const roas        = c.roas || 0;
  const invest      = Number(c.invest || 0);
  const leads       = Number(c.leads || 0);
  const conversions = Number(c.conversions || 0);
  const revenue     = Number(c.revenue || 0);
  const cpl         = c.cpl || (leads > 0 ? (invest / leads).toFixed(2) : 0);

  document.getElementById('report-preview').innerHTML = `
    <div id="printable-report" style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden">
      <div class="report-header" style="background:linear-gradient(135deg,${color},${color}aa)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div>
            <div style="font-size:11px;opacity:.7;margin-bottom:4px;letter-spacing:1px;text-transform:uppercase">Relatório de Performance</div>
            <div class="report-logo-text">${c.name}</div>
            <div class="report-period">${period} · Gestão por ${agency}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;opacity:.7;margin-bottom:4px">Status</div>
            <div style="font-size:16px;font-weight:700">${c.status === 'ativo' ? '✅ Ativo' : '⏸ Pausado'}</div>
          </div>
        </div>
      </div>
      <div style="padding:20px">
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat-val" style="color:${color}">${leads}</div><div class="report-stat-lbl">Leads Gerados</div></div>
          <div class="report-stat"><div class="report-stat-val" style="color:var(--green)">R$${invest.toLocaleString('pt-BR')}</div><div class="report-stat-lbl">Investido em Ads</div></div>
          <div class="report-stat"><div class="report-stat-val" style="color:var(--gold)">${roas}x</div><div class="report-stat-lbl">ROAS</div></div>
          <div class="report-stat"><div class="report-stat-val">${conversions}</div><div class="report-stat-lbl">Conversões</div></div>
          <div class="report-stat"><div class="report-stat-val">R$${Number(cpl).toLocaleString('pt-BR')}</div><div class="report-stat-lbl">CPL (Custo/Lead)</div></div>
          <div class="report-stat"><div class="report-stat-val" style="color:var(--green)">R$${revenue.toLocaleString('pt-BR')}</div><div class="report-stat-lbl">Faturamento Gerado</div></div>
        </div>
        <div class="report-section">
          <div class="report-section-title">Análise de Performance</div>
          <div class="grid-2">
            <div>
              <div class="metric-row"><div class="metric-name">Plataforma</div><div class="metric-val">Meta Ads</div></div>
              <div class="metric-row"><div class="metric-name">Nicho</div><div class="metric-val">${c.niche}</div></div>
              <div class="metric-row"><div class="metric-name">Verba Mensal</div><div class="metric-val">R$${Number(c.adspend || 0).toLocaleString('pt-BR')}</div></div>
              <div class="metric-row"><div class="metric-name">Período</div><div class="metric-val">${period}</div></div>
            </div>
            <div>
              <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span class="text-muted">Meta de Leads</span><span>${leads}/50</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, leads * 2)}%;background:${color}"></div></div>
              </div>
              <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span class="text-muted">Meta de ROAS</span><span>${roas}x / 3x</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, roas / 3 * 100)}%;background:var(--green)"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span class="text-muted">Taxa de Conversão</span><span>${leads > 0 ? ((conversions / leads) * 100).toFixed(1) : 0}%</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width:${leads > 0 ? Math.min(100, (conversions / leads) * 100) : 0}%;background:var(--gold)"></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-section">
          <div class="report-section-title">Próximos Passos</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border-radius:10px;padding:10px 14px">
              <div style="color:${color};font-size:16px">→</div>
              <div style="font-size:13px">Otimizar criativos com maior CTR para reduzir CPL e escalar volume de leads</div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border-radius:10px;padding:10px 14px">
              <div style="color:var(--green);font-size:16px">→</div>
              <div style="font-size:13px">Testar novos públicos lookalike para expandir alcance qualificado</div>
            </div>
            <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border-radius:10px;padding:10px 14px">
              <div style="color:var(--gold);font-size:16px">→</div>
              <div style="font-size:13px">Ativar remarketing para leads que visitaram o site mas não converteram</div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:11px;color:var(--muted)">Relatório gerado por ${agency} · ${new Date().toLocaleDateString('pt-BR')}</div>
          <div style="font-size:11px;color:var(--muted)">${DB.config.whatsapp || DB.config.email || ''}</div>
        </div>
      </div>
    </div>
  `;
}

function printReport() {
  const el = document.getElementById('printable-report');
  if (!el) { toast('Selecione um cliente primeiro', 'error'); return; }
  window.print();
}

function copyReportLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => toast('Link copiado!'))
    .catch(() => toast('Erro ao copiar', 'error'));
}


/* ═══════════════════════════════════════════
   meta.js — Integração Meta Ads BM
   ════════════════════════════════════════ */

function renderMeta() {
  if (DB.meta.connected) {
    document.getElementById('meta-status-badge').className = 'meta-status connected';
    document.getElementById('meta-status-text').textContent = 'Conectado';
    document.getElementById('meta-connect-area').style.display  = 'none';
    document.getElementById('meta-connected-area').style.display = 'block';
    document.getElementById('meta-bm-info').textContent = 'BM ID: ' + DB.meta.bmId;

    document.getElementById('meta-accounts-list').innerHTML = `
      <div class="account-item">
        <div class="account-info">
          <div class="account-fb-icon">f</div>
          <div>
            <div style="font-size:13px;font-weight:500">Conta Principal</div>
            <div style="font-size:11px;color:var(--muted)">act_${DB.meta.bmId}</div>
          </div>
        </div>
        <span class="badge badge-green">Ativa</span>
      </div>`;

    document.getElementById('mm-invest').textContent =
      'R$' + DB.clients.reduce((s, c) => s + Number(c.invest || 0), 0).toLocaleString('pt-BR');
    ['reach','impressions','clicks','ctr','cpc'].forEach(m => {
      document.getElementById('mm-' + m).textContent = '—';
    });
  } else {
    document.getElementById('meta-status-badge').className = 'meta-status disconnected';
    document.getElementById('meta-status-text').textContent = 'Desconectado';
    document.getElementById('meta-connect-area').style.display  = 'block';
    document.getElementById('meta-connected-area').style.display = 'none';
  }
}

function connectMeta() {
  const token = document.getElementById('meta-token-input').value.trim();
  const bmId  = document.getElementById('meta-bm-id').value.trim();
  if (!token || !bmId) { toast('Preencha o Token e o BM ID', 'error'); return; }
  DB.meta = { connected: true, token, bmId, bmName: 'Minha Business Manager' };
  saveDB();
  toast('Meta Ads conectado com sucesso!');
  renderMeta();
}

function disconnectMeta() {
  DB.meta = { connected: false, token: '', bmId: '', bmName: '' };
  saveDB();
  toast('Meta Ads desconectado', 'error');
  renderMeta();
}

function syncMeta() {
  toast('Sincronizando... (requer backend para dados reais da API)');
}


/* ═══════════════════════════════════════════
   config.js — Configurações da agência
   ════════════════════════════════════════ */

function renderConfig() {
  document.getElementById('cfg-agency-name').value = DB.config.agencyName || '';
  document.getElementById('cfg-email').value       = DB.config.email       || '';
  document.getElementById('cfg-whatsapp').value    = DB.config.whatsapp    || '';
  document.getElementById('cfg-site').value        = DB.config.site        || '';
  document.getElementById('cfg-color').value       = DB.config.color       || '#4f7cff';
  document.getElementById('cfg-color-hex').value   = DB.config.color       || '#4f7cff';
  document.getElementById('cfg-slogan').value      = DB.config.slogan      || '';

  const ua = document.getElementById('user-avatar-sidebar');
  const un = document.getElementById('user-name-sidebar');
  if (ua) ua.textContent = (DB.config.agencyName || 'G')[0].toUpperCase();
  if (un) un.textContent = DB.config.agencyName || 'Gestor';

  document.getElementById('cfg-color').oninput = function () {
    document.getElementById('cfg-color-hex').value = this.value;
  };
}

function saveConfig() {
  DB.config = {
    agencyName: document.getElementById('cfg-agency-name').value,
    email:      document.getElementById('cfg-email').value,
    whatsapp:   document.getElementById('cfg-whatsapp').value,
    site:       document.getElementById('cfg-site').value,
    color:      document.getElementById('cfg-color').value,
    slogan:     document.getElementById('cfg-slogan').value
  };
  saveDB();
  renderConfig();
  toast('Configurações salvas!');
}

function clearAllData() {
  if (!confirm('⚠️ ATENÇÃO: Isso vai apagar TODOS os dados. Tem certeza?')) return;
  DB.clients  = [];
  DB.payments = [];
  saveDB();
  toast('Dados limpos', 'error');
  renderPage('dashboard');
}
