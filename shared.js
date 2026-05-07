// ── AviGes shared.js v2 ────────────────────────────
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

function toast(msg, type='success') {
  const t = document.createElement('div');
  const colors = { success:'#0B8B5E', danger:'#DC2D40', warn:'#E8870E', info:'#2D6FE8' };
  const icons  = { success:'ti-check', danger:'ti-alert-circle', warn:'ti-alert-triangle', info:'ti-info-circle' };
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px;
    background:#fff; color:${colors[type]||colors.success};
    border:1px solid ${colors[type]||colors.success}33;
    border-left: 4px solid ${colors[type]||colors.success};
    padding:14px 18px; border-radius:12px; font-family:'DM Sans',sans-serif;
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

function mxn(n) { return '$' + Number(n).toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function num(n) { return Number(n).toLocaleString('es-MX'); }

const SIDEBAR_HTML = `
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
    <a href="lotes.html" class="nav-item"><i class="ti ti-paw nav-icon"></i> Mis Lotes <span class="nav-badge info">4</span></a>
    <a href="produccion.html" class="nav-item"><i class="ti ti-trending-up nav-icon"></i> Producción</a>

    <div class="nav-group-label">Control diario</div>
    <a href="registro.html" class="nav-item"><i class="ti ti-edit nav-icon"></i> Registro diario</a>
    <a href="sanidad.html" class="nav-item"><i class="ti ti-vaccine nav-icon"></i> Sanidad <span class="nav-badge">2</span></a>
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
    <div class="user-card">
      <div class="user-av">JR</div>
      <div style="flex:1;min-width:0;">
        <div class="user-name">Jorge Ramírez</div>
        <div class="user-role">Granja El Progreso</div>
      </div>
      <i class="ti ti-chevron-right" style="color:var(--text-3);font-size:16px;"></i>
    </div>
  </div>
</aside>
<div class="overlay" id="ov" onclick="closeSB()"></div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('sidebar-mount');
  if (target) { target.innerHTML = SIDEBAR_HTML; setActiveNav(); }
});
