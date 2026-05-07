/* ====================================================================
   AviGes — shared.js · UI helpers y inicialización
==================================================================== */

// ─── Helpers de formato ───
function mxn(n) {
  return '$' + Number(n||0).toLocaleString('es-MX', {minimumFractionDigits:0, maximumFractionDigits:0});
}
function mxnDec(n) {
  return '$' + Number(n||0).toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function num(n) { return Number(n||0).toLocaleString('es-MX'); }
function pct(n) { return Number(n||0).toFixed(1) + '%'; }

function fmtFecha(iso, opts={}) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  if (opts.short) return d.toLocaleDateString('es-MX', {day:'2-digit', month:'short'});
  if (opts.full) return d.toLocaleDateString('es-MX', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  if (opts.dateTime) return d.toLocaleDateString('es-MX', {day:'2-digit',month:'short'}) + ' · ' + d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString('es-MX', {day:'2-digit', month:'2-digit', year:'numeric'});
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff/60000);
  if (min < 1) return 'Hace un momento';
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min/60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h/24);
  if (d < 7) return `Hace ${d} días`;
  return fmtFecha(iso);
}

function escapeHTML(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── UI: sidebar / nav ───
function setActiveNav() {
  const path = location.pathname.split('/').pop().replace('.html','') || 'dashboard';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    const href = (el.getAttribute('href') || '').replace('.html','');
    if (href && (path === href || (path === 'index' && href === 'dashboard'))) {
      el.classList.add('active');
    }
  });
}

function toggleSB() {
  document.getElementById('sb')?.classList.toggle('open');
  document.getElementById('ov')?.classList.toggle('show');
}
function closeSB() {
  document.getElementById('sb')?.classList.remove('open');
  document.getElementById('ov')?.classList.remove('show');
}

function openModal(id) { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

// Toast notifications
function toast(msg, type='success') {
  const t = document.createElement('div');
  const colors = { success:'#1F6B47', danger:'#B83838', warn:'#C97D14', info:'#3D5C8C' };
  const icons  = { success:'ti-check', danger:'ti-alert-circle', warn:'ti-alert-triangle', info:'ti-info-circle' };
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px;
    background:#fff; color:${colors[type]||colors.success};
    border:1px solid ${colors[type]||colors.success}33;
    border-left: 4px solid ${colors[type]||colors.success};
    padding:14px 18px; border-radius:12px; font-family:'Inter Tight',sans-serif;
    font-size:13.5px; font-weight:600; z-index:9999;
    box-shadow:0 12px 32px rgba(0,0,0,.15); max-width:340px; line-height:1.4;
    display:flex; align-items:center; gap:10px;
    animation: slideIn .3s cubic-bezier(.2,.8,.4,1);
  `;
  t.innerHTML = `<i class="ti ${icons[type]||icons.success}" style="font-size:18px;"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='.25s'; }, 2900);
  setTimeout(() => t.remove(), 3300);
}

// ─── Sidebar HTML ───
function buildSidebar() {
  const session = (typeof auth !== 'undefined') ? auth.current() : null;
  const userName = session?.nombre || 'Invitado';
  const userIni = session?.iniciales || '??';
  const granjaNom = (typeof store !== 'undefined') ? (store.getDoc('granja').nombre || 'Granja') : 'Granja';

  // Calcular badges dinámicos
  let lotesActivos = 0, vacunasPendientes = 0;
  try {
    lotesActivos = store.list('lotes', l => l.estado === 'activo').length;
    vacunasPendientes = store.list('vacunas', { estado: 'pendiente' }).length;
  } catch (e) {}

  const lotesBadge = lotesActivos ? `<span class="nav-badge info">${lotesActivos}</span>` : '';
  const vacunasBadge = vacunasPendientes ? `<span class="nav-badge">${vacunasPendientes}</span>` : '';

  return `
<aside class="sidebar" id="sb">
  <div class="logo-area">
    <div class="logo-icon"><i class="ti ti-feather"></i></div>
    <div>
      <div class="logo-name">Avi<em>Ges</em></div>
      <div class="logo-tag">Software Avícola</div>
    </div>
  </div>
  <nav class="nav">
    <div class="nav-group-label">Principal</div>
    <a href="dashboard.html" class="nav-item"><i class="ti ti-layout-dashboard nav-icon"></i> Dashboard</a>
    <a href="lotes.html" class="nav-item"><i class="ti ti-paw nav-icon"></i> Mis Lotes ${lotesBadge}</a>
    <a href="produccion.html" class="nav-item"><i class="ti ti-trending-up nav-icon"></i> Producción</a>

    <div class="nav-group-label">Control diario</div>
    <a href="registro.html" class="nav-item"><i class="ti ti-edit nav-icon"></i> Registro diario</a>
    <a href="sanidad.html" class="nav-item"><i class="ti ti-vaccine nav-icon"></i> Sanidad ${vacunasBadge}</a>
    <a href="alimento.html" class="nav-item"><i class="ti ti-grain nav-icon"></i> Alimento</a>
    <a href="huevo.html" class="nav-item"><i class="ti ti-egg nav-icon"></i> Producción huevo</a>
    <a href="clima.html" class="nav-item"><i class="ti ti-temperature nav-icon"></i> Clima Galpón</a>

    <div class="nav-group-label">Finanzas</div>
    <a href="costos.html" class="nav-item"><i class="ti ti-coin nav-icon"></i> Costos</a>
    <a href="ventas.html" class="nav-item"><i class="ti ti-receipt nav-icon"></i> Ventas</a>
    <a href="reportes.html" class="nav-item"><i class="ti ti-file-text nav-icon"></i> Reportes PDF</a>

    <div class="nav-group-label">Más</div>
    <a href="bioseguridad.html" class="nav-item"><i class="ti ti-shield-check nav-icon"></i> Bioseguridad</a>
    <a href="configuracion.html" class="nav-item"><i class="ti ti-settings nav-icon"></i> Configuración</a>
  </nav>
  <div class="sidebar-bottom">
    <div class="user-card" onclick="userMenu(event)">
      <div class="user-av">${userIni}</div>
      <div style="flex:1;min-width:0;">
        <div class="user-name">${escapeHTML(userName)}</div>
        <div class="user-role">${escapeHTML(granjaNom)}</div>
      </div>
      <i class="ti ti-chevron-right" style="color:var(--text-3);font-size:16px;"></i>
    </div>
  </div>
</aside>
<div class="overlay" id="ov" onclick="closeSB()"></div>
`;
}

// Menu de usuario (logout)
function userMenu(e) {
  e?.stopPropagation();
  if (confirm('¿Cerrar sesión?')) {
    auth.logout();
    window.location.href = 'index.html';
  }
}

// ─── Inicialización ───
// Espera que db.js, standards.js, calc.js, auth.js, seed.js estén cargados
function avigesInit() {
  // 1. Inicializar DB con seed si está vacío
  if (typeof dbInit === 'function' && typeof seedDemo === 'function') {
    dbInit(seedDemo);
  }

  // 2. Si no hay sesión activa y no estamos en login, mandar a login
  if (typeof auth !== 'undefined' && !auth.isAuthed()) {
    if (!location.pathname.includes('index.html') && location.pathname !== '/' && !location.pathname.endsWith('/aviges/') && !location.pathname.endsWith('/aviges')) {
      // Auto-login con demo si no hay sesión - simplifica testing
      const r = auth.login('demo@aviges.mx', 'demo123');
      if (!r.ok) { window.location.href = 'index.html'; return; }
    }
  }

  // 3. Montar sidebar si hay punto de montaje
  const target = document.getElementById('sidebar-mount');
  if (target) { target.innerHTML = buildSidebar(); setActiveNav(); }
}

// Auto-init al DOMContentLoaded
document.addEventListener('DOMContentLoaded', avigesInit);
