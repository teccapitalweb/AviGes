/* ====================================================================
   AviGes — auth.js · Autenticación
==================================================================== */

const SESSION_KEY = 'aviges_session';

const auth = {
  // Login: valida email/pass contra usuarios en DB
  login(email, password) {
    const usuarios = store.list('usuarios');
    const user = usuarios.find(u =>
      u.email?.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Correo o contraseña incorrectos' };
    const session = {
      id: user.id, nombre: user.nombre, email: user.email,
      rol: user.rol, iniciales: this._iniciales(user.nombre),
      ts: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Actualizar última conexión
    store.update('usuarios', user.id, { ultimaConexion: new Date().toISOString() });
    return { ok: true, user: session };
  },

  // Logout
  logout() { localStorage.removeItem(SESSION_KEY); },

  // Sesión actual
  current() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  },

  // Está autenticado?
  isAuthed() { return !!this.current(); },

  // Requerir auth - redirige a login si no
  require() {
    if (!this.isAuthed()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  _iniciales(nombre) {
    if (!nombre) return '??';
    return nombre.split(' ').filter(Boolean).slice(0,2)
      .map(p => p[0].toUpperCase()).join('');
  }
};

window.auth = auth;
