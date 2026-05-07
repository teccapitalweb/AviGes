/* ====================================================================
   AviGes — standards.js · Curvas zootécnicas estándar
   Ross 308 · Cobb 500 · Hy-Line W-36 · Bovans White
==================================================================== */

// ROSS 308 - peso (g) y CA acumulada por día
const ROSS_308 = {
  nombre: 'Ross 308', tipo: 'broiler',
  // peso (g) por día - fuente: Aviagen Performance Objectives 2022
  peso: { 0:42, 1:56, 7:188, 14:464, 21:925, 28:1551, 35:2283, 42:3024, 49:3727 },
  // consumo acumulado kg/ave por día
  consumoAcum: { 0:0, 1:0.014, 7:0.144, 14:0.486, 21:1.105, 28:2.000, 35:3.080, 42:4.290, 49:5.580 },
  // CA acumulada
  ca: { 7:0.83, 14:1.10, 21:1.21, 28:1.30, 35:1.36, 42:1.45, 49:1.55 },
  // Mortalidad esperada acumulada
  mortalidad: { 7:1.0, 14:1.5, 21:2.0, 28:2.5, 35:3.0, 42:3.5 }
};

// COBB 500 - similar, ligeramente diferente
const COBB_500 = {
  nombre: 'Cobb 500', tipo: 'broiler',
  peso: { 0:42, 1:62, 7:192, 14:475, 21:953, 28:1604, 35:2358, 42:3122, 49:3838 },
  consumoAcum: { 0:0, 1:0.015, 7:0.150, 14:0.510, 21:1.155, 28:2.090, 35:3.220, 42:4.485, 49:5.830 },
  ca: { 7:0.84, 14:1.11, 21:1.22, 28:1.31, 35:1.38, 42:1.47, 49:1.57 },
  mortalidad: { 7:1.0, 14:1.5, 21:2.0, 28:2.5, 35:3.0, 42:3.5 }
};

// HY-LINE W-36 (ponedora liviana, huevo blanco)
// Postura % por semana de vida (semanas 18-80)
const HYLINE_W36 = {
  nombre: 'Hy-Line W-36', tipo: 'ponedora',
  // % postura por semana
  postura: {
    18: 0,   19: 10,  20: 50,  21: 88,  22: 94,  23: 95,  24: 96,
    25: 96,  26: 96,  27: 96,  28: 95,  29: 95,  30: 95,
    35: 94,  40: 92,  45: 91,  50: 89,  55: 87,  60: 84,
    65: 82,  70: 80,  75: 78,  80: 75
  },
  // Peso ave (g) por semana
  pesoAve: { 18: 1280, 25: 1450, 30: 1520, 40: 1600, 50: 1650, 60: 1700, 70: 1730 },
  // Consumo g/ave/día
  consumoDiario: { 18: 92, 25: 100, 30: 102, 40: 105, 50: 105, 60: 105, 70: 105 },
  // Peso huevo (g)
  pesoHuevo: { 22: 50, 30: 58, 40: 62, 50: 64, 60: 65, 70: 66 }
};

// BOVANS WHITE (similar a Hy-Line)
const BOVANS_WHITE = {
  nombre: 'Bovans White', tipo: 'ponedora',
  postura: {
    18: 0,   19: 8,   20: 45,  21: 85,  22: 92,  23: 94,  24: 95,
    25: 95,  26: 96,  27: 96,  28: 95,  29: 95,  30: 95,
    35: 94,  40: 92,  45: 90,  50: 88,  55: 86,  60: 83,
    65: 81,  70: 78,  75: 75,  80: 72
  },
  pesoAve: { 18: 1300, 25: 1480, 30: 1550, 40: 1620, 50: 1680, 60: 1720, 70: 1750 },
  consumoDiario: { 18: 95, 25: 102, 30: 105, 40: 108, 50: 110, 60: 110, 70: 110 },
  pesoHuevo: { 22: 51, 30: 59, 40: 63, 50: 65, 60: 66, 70: 67 }
};

const STANDARDS = {
  'Ross 308': ROSS_308,
  'Cobb 500': COBB_500,
  'Hubbard Flex': ROSS_308, // aproximación
  'Hy-Line W-36': HYLINE_W36,
  'Bovans White': BOVANS_WHITE,
  'Lohmann LSL': HYLINE_W36 // aproximación
};

// Interpolación lineal entre puntos clave para días que no están en la tabla
function interpolate(table, x) {
  const keys = Object.keys(table).map(Number).sort((a,b) => a-b);
  if (x <= keys[0]) return table[keys[0]];
  if (x >= keys[keys.length-1]) return table[keys[keys.length-1]];
  for (let i = 0; i < keys.length-1; i++) {
    if (x >= keys[i] && x <= keys[i+1]) {
      const x1 = keys[i], x2 = keys[i+1];
      const y1 = table[x1], y2 = table[x2];
      return y1 + (y2-y1) * ((x-x1)/(x2-x1));
    }
  }
  return 0;
}

// API pública
const std = {
  get(linea) { return STANDARDS[linea] || ROSS_308; },

  // Peso esperado en gramos al día N para una línea broiler
  pesoEsperado(linea, dia) {
    const s = this.get(linea);
    if (s.tipo !== 'broiler') return 0;
    return Math.round(interpolate(s.peso, dia));
  },

  // Consumo acumulado esperado en kg al día N (broiler)
  consumoEsperado(linea, dia) {
    const s = this.get(linea);
    if (s.tipo !== 'broiler') return 0;
    return Number(interpolate(s.consumoAcum, dia).toFixed(3));
  },

  // CA esperada al día N (broiler)
  caEsperado(linea, dia) {
    const s = this.get(linea);
    if (s.tipo !== 'broiler') return 0;
    return Number(interpolate(s.ca, dia).toFixed(2));
  },

  // % postura esperado en semana N (ponedora)
  posturaEsperado(linea, semana) {
    const s = this.get(linea);
    if (s.tipo !== 'ponedora') return 0;
    return Number(interpolate(s.postura, semana).toFixed(1));
  },

  // Genera una serie de la curva para gráficos
  curvaPeso(linea, diasMax) {
    const arr = [];
    for (let d = 1; d <= diasMax; d++) arr.push(this.pesoEsperado(linea, d));
    return arr;
  },
  curvaPostura(linea, semIni, semFin) {
    const arr = [];
    for (let s = semIni; s <= semFin; s++) arr.push(this.posturaEsperado(linea, s));
    return arr;
  },

  // Lista líneas disponibles por tipo
  lineas(tipo) {
    return Object.entries(STANDARDS)
      .filter(([_,v]) => !tipo || v.tipo === tipo)
      .map(([k]) => k);
  }
};

window.std = std;
