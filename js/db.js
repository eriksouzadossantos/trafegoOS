/* ═══════════════════════════════════════════
   db.js — Camada de dados (LocalStorage)
   ════════════════════════════════════════ */

const DB_KEY = 'trafegoOS_v1';

let DB = {
  clients:  [],
  payments: [],
  config: {
    agencyName: 'Minha Agência',
    email: '', whatsapp: '', site: '',
    color: '#4f7cff',
    slogan: 'Resultados que transformam negócios'
  },
  meta: { connected: false, token: '', bmId: '', bmName: '' }
};

function loadDB() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) DB = JSON.parse(saved);
  } catch (e) {
    console.warn('Erro ao carregar dados:', e);
  }
}

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
  } catch (e) {
    console.warn('Erro ao salvar dados:', e);
  }
}

/* Seed de dados de exemplo */
function seedDemoData() {
  if (DB.clients.length > 0) return;

  DB.clients = [
    { id:1, name:'Clínica Sorrir', contact:'Dr. Paulo Melo', email:'paulo@sorrir.com', phone:'(11) 99876-5432', niche:'Odontologia', status:'ativo', fee:2000, adspend:5000, dueday:10, startdate:'2025-01-10', invest:4800, revenue:28000, leads:87, conversions:23, cpl:55, roas:5.8, createdAt:'2025-01-10T10:00:00Z' },
    { id:2, name:'Studio Beauty Ana', contact:'Ana Lima', email:'ana@studio.com', phone:'(11) 97654-3210', niche:'Estética', status:'ativo', fee:1500, adspend:3000, dueday:15, startdate:'2025-02-01', invest:2900, revenue:12000, leads:54, conversions:18, cpl:54, roas:4.1, createdAt:'2025-02-01T10:00:00Z' },
    { id:3, name:'Academia FitPlus', contact:'Carlos Gomes', email:'carlos@fitplus.com', phone:'(11) 96543-2109', niche:'Academia / Personal', status:'ativo', fee:1200, adspend:2000, dueday:5, startdate:'2025-03-01', invest:1950, revenue:9500, leads:33, conversions:12, cpl:59, roas:4.9, createdAt:'2025-03-01T10:00:00Z' },
    { id:4, name:'Dr. Roberto Advocacia', contact:'Dr. Roberto', email:'roberto@adv.com', phone:'(11) 95432-1098', niche:'Advocacia', status:'pausado', fee:1800, adspend:2500, dueday:20, startdate:'2025-01-15', invest:0, revenue:0, leads:0, conversions:0, cpl:0, roas:0, createdAt:'2025-01-15T10:00:00Z' }
  ];

  DB.payments = [
    { id:100, clientId:1, amount:2000, date:'2025-05-10', ref:'Maio/2025', method:'PIX', note:'' },
    { id:101, clientId:2, amount:1500, date:'2025-05-15', ref:'Maio/2025', method:'PIX', note:'' },
    { id:102, clientId:3, amount:1200, date:'2025-05-05', ref:'Maio/2025', method:'Transferência', note:'' },
    { id:103, clientId:1, amount:2000, date:'2025-04-10', ref:'Abril/2025', method:'PIX', note:'' },
    { id:104, clientId:2, amount:1500, date:'2025-04-15', ref:'Abril/2025', method:'PIX', note:'' }
  ];

  saveDB();
}

/* Helpers */
const COLORS = ['#4f7cff','#7c3aed','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16'];
function clientColor(id) { return COLORS[id % COLORS.length]; }
function initials(name) { return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase(); }
function formatDate(d) { if (!d) return '—'; return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR'); }
function statusBadge(s) {
  if (s === 'ativo')     return '<span class="badge badge-green">Ativo</span>';
  if (s === 'pausado')   return '<span class="badge badge-gold">Pausado</span>';
  return '<span class="badge badge-gray">Encerrado</span>';
}

loadDB();
seedDemoData();
