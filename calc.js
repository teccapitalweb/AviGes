/* ====================================================================
   AviGes — calc.js · Cálculos zootécnicos y económicos
==================================================================== */

const calc = {
  // Días desde fecha de inicio del lote hasta hoy (o hasta fechaCierre si está cerrado)
  diasLote(lote) {
    const inicio = new Date(lote.fechaInicio);
    const fin = lote.fechaCierre ? new Date(lote.fechaCierre) : new Date();
    return Math.max(0, Math.floor((fin - inicio) / (1000*60*60*24)));
  },

  semanasLote(lote) {
    return Math.floor(this.diasLote(lote) / 7) + 1;
  },

  // Mortalidad acumulada total del lote
  mortalidadTotal(loteId) {
    return store.list('registros', { loteId })
      .reduce((sum, r) => sum + (Number(r.mortalidad)||0), 0);
  },

  // Aves vivas actuales = iniciales - mortalidad acumulada
  avesVivas(lote) {
    const muertas = this.mortalidadTotal(lote.id);
    return Math.max(0, lote.avesIniciales - muertas);
  },

  // % mortalidad acumulada
  pctMortalidad(lote) {
    const muertas = this.mortalidadTotal(lote.id);
    if (!lote.avesIniciales) return 0;
    return Number((muertas / lote.avesIniciales * 100).toFixed(2));
  },

  // % viabilidad (1 - mortalidad)
  viabilidad(lote) {
    return Number((100 - this.pctMortalidad(lote)).toFixed(2));
  },

  // Consumo total alimento del lote en kg
  consumoTotal(loteId) {
    return store.list('registros', { loteId })
      .reduce((sum, r) => sum + (Number(r.alimentoKg)||0), 0);
  },

  // Consumo total agua en litros
  aguaTotal(loteId) {
    return store.list('registros', { loteId })
      .reduce((sum, r) => sum + (Number(r.agua)||0), 0);
  },

  // Último peso registrado del lote (g)
  ultimoPeso(loteId) {
    const regs = store.list('registros', { loteId })
      .filter(r => r.peso > 0)
      .sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    return regs[0]?.peso || 0;
  },

  // Conversión Alimenticia (CA) = kg alimento consumido / kg producidos
  ca(lote) {
    const totalAlim = this.consumoTotal(lote.id);
    const pesoG = this.ultimoPeso(lote.id);
    const aves = this.avesVivas(lote);
    if (!pesoG || !aves) return 0;
    const kgProducidos = (pesoG / 1000) * aves;
    if (!kgProducidos) return 0;
    return Number((totalAlim / kgProducidos).toFixed(2));
  },

  // IEP (Índice de Eficiencia Productiva) — la fórmula avícola estándar
  // IEP = (Peso en kg × Viabilidad %) / (CA × Edad días) × 100
  iep(lote) {
    const pesoKg = this.ultimoPeso(lote.id) / 1000;
    const viabilidad = this.viabilidad(lote);
    const ca = this.ca(lote);
    const dias = this.diasLote(lote);
    if (!pesoKg || !ca || !dias) return 0;
    return Math.round((pesoKg * viabilidad) / (ca * dias) * 100);
  },

  // ─── Producción huevo ───
  // Total huevos producidos por lote
  huevosTotales(loteId) {
    return store.list('huevos', { loteId })
      .reduce((sum, h) => sum + (Number(h.total)||0), 0);
  },

  huevosHoy(loteId) {
    const hoy = new Date().toISOString().slice(0,10);
    return store.list('huevos', { loteId })
      .filter(h => h.fecha?.slice(0,10) === hoy)
      .reduce((sum, h) => sum + (Number(h.total)||0), 0);
  },

  // % postura hoy
  pctPosturaHoy(lote) {
    const aves = this.avesVivas(lote);
    if (!aves) return 0;
    const huevosHoy = this.huevosHoy(lote.id);
    return Number((huevosHoy / aves * 100).toFixed(1));
  },

  // ─── Económico ───
  // Costos totales del lote
  costoTotal(loteId) {
    return store.list('gastos', { loteId })
      .reduce((sum, g) => sum + (Number(g.monto)||0), 0);
  },

  // Ingresos totales del lote
  ingresoTotal(loteId) {
    return store.list('ventas', { loteId })
      .reduce((sum, v) => sum + (Number(v.total)||0), 0);
  },

  // Margen estimado
  margenLote(loteId) {
    return this.ingresoTotal(loteId) - this.costoTotal(loteId);
  },

  // Costo por kg producido
  costoPorKg(lote) {
    const costo = this.costoTotal(lote.id);
    const aves = this.avesVivas(lote);
    const pesoKg = this.ultimoPeso(lote.id) / 1000;
    if (!aves || !pesoKg) return 0;
    return Number((costo / (aves * pesoKg)).toFixed(2));
  },

  // ─── Stock alimento por galpón (días restantes) ───
  // Stock actual = entradas - consumido en ese galpón
  stockAlimentoGalpon(galponId) {
    const entradas = store.list('entradasAlimento', { galponId })
      .reduce((sum, e) => sum + (Number(e.kgTotal)||0), 0);
    // Consumido = consumo total de los lotes activos en ese galpón
    const lotesActivos = store.list('lotes', l => l.galponId === galponId && l.estado === 'activo');
    const consumido = lotesActivos
      .reduce((sum, l) => sum + this.consumoTotal(l.id), 0);
    return Math.max(0, entradas - consumido);
  },

  // Días restantes de stock = stock / consumo diario promedio
  diasStockGalpon(galponId) {
    const stock = this.stockAlimentoGalpon(galponId);
    const lotesActivos = store.list('lotes', l => l.galponId === galponId && l.estado === 'activo');
    if (!lotesActivos.length) return null;
    // Consumo diario estimado: último día de cada lote activo
    let consumoDiario = 0;
    lotesActivos.forEach(l => {
      const regs = store.list('registros', { loteId: l.id })
        .sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
      if (regs.length) consumoDiario += Number(regs[0].alimentoKg)||0;
    });
    if (!consumoDiario) return null;
    return Math.floor(stock / consumoDiario);
  },

  // ─── Resumen lote completo ───
  resumenLote(lote) {
    return {
      ...lote,
      dias: this.diasLote(lote),
      avesVivas: this.avesVivas(lote),
      pctMortalidad: this.pctMortalidad(lote),
      viabilidad: this.viabilidad(lote),
      ultimoPeso: this.ultimoPeso(lote.id),
      ca: this.ca(lote),
      iep: this.iep(lote),
      consumoTotal: this.consumoTotal(lote.id),
      pctPostura: lote.tipo === 'ponedora' ? this.pctPosturaHoy(lote) : null,
      huevosTotales: lote.tipo === 'ponedora' ? this.huevosTotales(lote.id) : null,
      costoTotal: this.costoTotal(lote.id),
      ingresoTotal: this.ingresoTotal(lote.id),
      margen: this.margenLote(lote.id)
    };
  }
};

window.calc = calc;
