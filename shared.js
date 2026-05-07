// ── AviGes shared.js ──────────────────────────────
// Navigation
function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    const href = el.getAttribute('href') || '';
    if (href && path.includes(href.replace('.html',''))) {
      el.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', setActiveNav);

// Mobile sidebar
function toggleSB() {
  document.getElementById('sb')?.classList.toggle('open');
  document.getElementById('ov')?.classList.toggle('show');
}
function closeSB() {
  document.getElementById('sb')?.classList.remove('open');
  document.getElementById('ov')?.classList.remove('show');
}

// Modal helpers
function openModal(id) { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

// Toast notification
function toast(msg, type='success') {
  const t = document.createElement('div');
  const colors = { success:'#0B8B5E', danger:'#E53E3E', warn:'#F59E0B', info:'#3B7DD8' };
  t.style.cssText = `
    position:fixed; bottom:24px; right:24px; background:${colors[type]||colors.success};
    color:#fff; padding:12px 20px; border-radius:10px; font-family:'DM Sans',sans-serif;
    font-size:13.5px; font-weight:500; z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,.2);
    animation: slideIn .3s ease; max-width:320px; line-height:1.4;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// Format number MXN
function mxn(n) { return '$' + Number(n).toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2}); }
function num(n) { return Number(n).toLocaleString('es-MX'); }

// Current date ES
function fechaHoy() {
  return new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// Sidebar HTML (shared across all pages)
const SIDEBAR_HTML = `
<aside class="sidebar" id="sb">
  <div class="logo-area">
    <div class="logo-icon">🐔</div>
    <div>
      <div class="logo-name">AviGes</div>
      <div class="logo-tag">Software Avícola Mexicano</div>
    </div>
  </div>
  <nav class="nav">
    <div class="nav-group-label">Principal</div>
    <a href="dashboard.html" class="nav-item"><span class="nav-icon">⊞</span> Dashboard</a>
    <a href="lotes.html" class="nav-item"><span class="nav-icon">🐣</span> Mis Lotes <span class="nav-badge">4</span></a>
    <a href="produccion.html" class="nav-item"><span class="nav-icon">📈</span> Producción</a>
    <div class="nav-group-label" style="margin-top:6px;">Control diario</div>
    <a href="registro.html" class="nav-item"><span class="nav-icon">✏️</span> Registro diario</a>
    <a href="sanidad.html" class="nav-item"><span class="nav-icon">💉</span> Sanidad <span class="nav-badge">2</span></a>
    <a href="alimento.html" class="nav-item"><span class="nav-icon">🌽</span> Alimento</a>
    <a href="huevo.html" class="nav-item"><span class="nav-icon">🥚</span> Huevo</a>
    <a href="clima.html" class="nav-item"><span class="nav-icon">🌡️</span> Clima Galpón</a>
    <div class="nav-group-label" style="margin-top:6px;">Finanzas</div>
    <a href="costos.html" class="nav-item"><span class="nav-icon">💰</span> Costos</a>
    <a href="ventas.html" class="nav-item"><span class="nav-icon">🧾</span> Ventas</a>
    <a href="reportes.html" class="nav-item"><span class="nav-icon">📄</span> Reportes PDF</a>
    <div class="nav-group-label" style="margin-top:6px;">Más</div>
    <a href="bioseguridad.html" class="nav-item"><span class="nav-icon">🛡️</span> Bioseguridad</a>
    <a href="configuracion.html" class="nav-item"><span class="nav-icon">⚙️</span> Configuración</a>
  </nav>
  <div class="sidebar-bottom">
    <div class="user-card">
      <div class="user-av">JR</div>
      <div>
        <div class="user-name">Jorge Ramírez</div>
        <div class="user-role">Administrador · Granja El Progreso</div>
      </div>
    </div>
  </div>
</aside>
<div class="overlay" id="ov" onclick="closeSB()"></div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('sidebar-mount');
  if (target) { target.innerHTML = SIDEBAR_HTML; setActiveNav(); }
});
