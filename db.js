/* ====================================================================
   AviGes — db.js · Capa de datos
   ──────────────────────────────────────────────────────────────────
   Por ahora usa localStorage. Para migrar a Firebase Firestore sólo
   reemplaza el cuerpo de las funciones store.* por llamadas al SDK.
   La firma se mantiene igual.
==================================================================== */

const DB_KEY = 'aviges_db_v1';
const DB_VERSION = 1;

// Esquema completo - colecciones disponibles
const COLLECTIONS = [
  'granja', 'galpones', 'usuarios', 'lineas', 'clientes', 'proveedores',
  'lotes', 'registros', 'vacunas', 'tratamientos',
  'inventarioSanidad', 'inventarioAlimento', 'entradasAlimento',
  'huevos', 'ventas', 'gastos', 'clima', 'bioseguridad',
  'visitas', 'tareas', 'actividad', 'config'
];

// Generador de IDs
function uid(prefix='id') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

// Núcleo: lectura / escritura del store
function _read() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { console.error('DB read error:', e); return null; }
}
function _write(data) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(data)); return true; }
  catch (e) { console.error('DB write error:', e); return false; }
}

// Inicializa el DB con la semilla si no existe
function dbInit(seedFn) {
  let db = _read();
  if (!db || db._version !== DB_VERSION) {
    db = { _version: DB_VERSION, _createdAt: new Date().toISOString() };
    COLLECTIONS.forEach(c => { db[c] = []; });
    db.granja = {};
    db.config = {};
    if (typeof seedFn === 'function') seedFn(db);
    _write(db);
  }
  return db;
}

// API pública del store
const store = {
  // Listar todos los items de una colección, opcionalmente filtrar
  list(coll, filter) {
    const db = _read() || {};
    let items = (db[coll] || []).slice();
    if (filter && typeof filter === 'object') {
      items = items.filter(i =>
        Object.entries(filter).every(([k,v]) => i[k] === v)
      );
    } else if (typeof filter === 'function') {
      items = items.filter(filter);
    }
    return items;
  },

  // Obtener un item por id
  get(coll, id) {
    const db = _read() || {};
    return (db[coll] || []).find(i => i.id === id) || null;
  },

  // Crear un nuevo item
  create(coll, data) {
    const db = _read() || {};
    if (!db[coll]) db[coll] = [];
    const item = {
      id: data.id || uid(coll.slice(0,3)),
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      ...data
    };
    db[coll].push(item);
    _write(db);
    return item;
  },

  // Actualizar un item por id
  update(coll, id, patch) {
    const db = _read() || {};
    const idx = (db[coll] || []).findIndex(i => i.id === id);
    if (idx === -1) return null;
    db[coll][idx] = {
      ...db[coll][idx],
      ...patch,
      id: db[coll][idx].id, // preservar id
      _updatedAt: new Date().toISOString()
    };
    _write(db);
    return db[coll][idx];
  },

  // Borrar item por id
  delete(coll, id) {
    const db = _read() || {};
    if (!db[coll]) return false;
    const before = db[coll].length;
    db[coll] = db[coll].filter(i => i.id !== id);
    _write(db);
    return db[coll].length < before;
  },

  // Documento singular (granja, config) - get / set
  getDoc(coll) {
    const db = _read() || {};
    return db[coll] || {};
  },
  setDoc(coll, data) {
    const db = _read() || {};
    db[coll] = { ...(db[coll]||{}), ...data, _updatedAt: new Date().toISOString() };
    _write(db);
    return db[coll];
  },

  // Reset completo del DB - útil para devs y tests
  reset() { localStorage.removeItem(DB_KEY); },

  // Export como JSON (para respaldo)
  exportJSON() {
    const db = _read() || {};
    return JSON.stringify(db, null, 2);
  },

  importJSON(json) {
    try { const data = JSON.parse(json); _write(data); return true; }
    catch (e) { return false; }
  },

  // Helpers
  uid
};

// Helper para registrar actividad
function logActivity({ texto, tipo='info', usuario='Sistema' }) {
  store.create('actividad', {
    fecha: new Date().toISOString(),
    texto,
    tipo,
    usuario
  });
}

// Hacer disponible globalmente
window.store = store;
window.dbInit = dbInit;
window.logActivity = logActivity;
window.uid = uid;
