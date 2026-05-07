/* ====================================================================
   AviGes — seed.js · Datos demo iniciales
   Se aplica solo la primera vez que se carga el sistema
==================================================================== */

function seedDemo(db) {
  const today = new Date();
  const days = (n) => { const d = new Date(today); d.setDate(d.getDate()-n); return d.toISOString(); };
  const dayAt = (n) => days(n).slice(0,10);

  // ─── GRANJA ───
  db.granja = {
    nombre: 'Granja El Progreso',
    propietario: 'Jorge Ramírez',
    rfc: 'GAEP890512XYZ',
    telefono: '+52 238 147 8840',
    direccion: 'Carretera Tehuacán-Esperanza Km 12, Tehuacán, Puebla',
    folioSenasica: '',
    tipo: 'mixta'
  };

  // ─── USUARIOS ───
  db.usuarios = [
    { id: 'u_admin', nombre: 'Jorge Ramírez', email: 'demo@aviges.mx', password: 'demo123', rol: 'admin', galponesAsignados: 'todos', ultimaConexion: new Date().toISOString() },
    { id: 'u_carlos', nombre: 'Carlos Pérez', email: 'carlos@granjaelprogreso.com', password: 'carlos123', rol: 'encargado', galponesAsignados: 'todos', ultimaConexion: days(0.02) },
    { id: 'u_ana', nombre: 'Ana García', email: 'ana@granjaelprogreso.com', password: 'ana123', rol: 'vendedor', galponesAsignados: 'todos', ultimaConexion: days(0.08) }
  ];

  // ─── GALPONES ───
  db.galpones = [
    { id: 'g1', nombre: 'Galpón 1', capacidad: 22000, tipo: 'broiler', sistema: 'Piso · cama', activo: true },
    { id: 'g2', nombre: 'Galpón 2', capacidad: 22000, tipo: 'broiler', sistema: 'Piso · cama', activo: true },
    { id: 'g3', nombre: 'Galpón 3', capacidad: 14000, tipo: 'ponedora', sistema: 'Jaula automatizada', activo: true },
    { id: 'g4', nombre: 'Galpón 4', capacidad: 12500, tipo: 'ponedora', sistema: 'Jaula automatizada', activo: true }
  ];

  // ─── CLIENTES ───
  db.clientes = [
    { id: 'c1', nombre: 'Distribuidora García', contacto: 'Luis García', telefono: '238-555-0101', email: 'luis@distrigarcia.mx' },
    { id: 'c2', nombre: 'Agrotec América', contacto: 'Roberto Méndez', telefono: '238-555-0202', email: 'americaagrotec7@gmail.com' },
    { id: 'c3', nombre: 'Mercado Central Tehuacán', contacto: 'Patricia Ruiz', telefono: '238-555-0303', email: '' },
    { id: 'c4', nombre: 'Pollería Reyes', contacto: 'Manuel Reyes', telefono: '238-555-0404', email: '' },
    { id: 'c5', nombre: 'Huevería Morales', contacto: 'Carmen Morales', telefono: '238-555-0505', email: '' }
  ];

  // ─── PROVEEDORES ───
  db.proveedores = [
    { id: 'p1', nombre: 'Nutrimentos del Bajío', tipo: 'alimento', contacto: 'ventas@nutrimentos.mx' },
    { id: 'p2', nombre: 'PiSA Agropecuaria', tipo: 'medicamento', contacto: 'pedidos@pisa.mx' },
    { id: 'p3', nombre: 'MSD Salud Animal', tipo: 'vacuna', contacto: '' },
    { id: 'p4', nombre: 'ProAlimentos MX', tipo: 'alimento', contacto: '' }
  ];

  // ─── LOTES (4 activos + 1 cerrado) ───
  db.lotes = [
    { id: 'l_24a', nombre: 'Lote 24-A', galponId: 'g1', linea: 'Ross 308', tipo: 'broiler',
      avesIniciales: 18400, fechaInicio: dayAt(35), duracion: 42, estado: 'activo',
      pesoInicial: 42, costoPollito: 14.5, proveedor: 'Tyson', notas: '' },
    { id: 'l_24b', nombre: 'Lote 24-B', galponId: 'g2', linea: 'Cobb 500', tipo: 'broiler',
      avesIniciales: 20100, fechaInicio: dayAt(18), duracion: 42, estado: 'activo',
      pesoInicial: 42, costoPollito: 14.5, proveedor: 'Pilgrim\'s', notas: '' },
    { id: 'l_24c', nombre: 'Lote 24-C', galponId: 'g3', linea: 'Hy-Line W-36', tipo: 'ponedora',
      avesIniciales: 12800, fechaInicio: dayAt(156), duracion: 360, estado: 'activo',
      pesoInicial: 1280, costoPollito: 65, proveedor: 'Hy-Line MX', notas: '' },
    { id: 'l_24d', nombre: 'Lote 24-D', galponId: 'g4', linea: 'Bovans White', tipo: 'ponedora',
      avesIniciales: 11200, fechaInicio: dayAt(89), duracion: 360, estado: 'activo',
      pesoInicial: 1300, costoPollito: 62, proveedor: 'Bovans MX', notas: '' },
    { id: 'l_24x', nombre: 'Lote 24-X', galponId: 'g1', linea: 'Ross 308', tipo: 'broiler',
      avesIniciales: 17800, fechaInicio: dayAt(80), duracion: 42, estado: 'cerrado',
      fechaCierre: dayAt(38), pesoInicial: 42, costoPollito: 14, notas: 'Cerrado en marzo' }
  ];

  // ─── REGISTROS DIARIOS (genera curva realista para 24-A día 35) ───
  // Mortalidad realista escalonada para Ross 308
  const mortRoss = [3,2,2,1,2,2,1,1,2,2,1,1,2,1,1,1,2,2,1,2,3,3,4,5,4,5,8,12,15,18,22,28,35,42,50]; // suma ~331
  const pesoDias = [42,57,75,98,123,153,188,228,272,322,377,437,503,575,653,738,829,925,1027,1135,1249,1369,1495,1626,1762,1903,2049,2199,2353,2510,2670,2832,2997,3163,2310]; // último 2310 (modificado)
  const aguaPorDia = (d, aves) => Math.round(aves * (0.045 + d*0.005)); // L
  const alimPorDia = (d, aves) => Math.round(aves * (0.02 + d*0.005) * 10)/10; // kg

  for (let d = 1; d <= 35; d++) {
    const muertas = mortRoss[d-1] || 0;
    db.registros.push({
      id: uid('reg'), loteId: 'l_24a', fecha: dayAt(35-d+1),
      mortalidad: muertas, peso: (d % 7 === 0 || d === 35) ? Math.round(std.pesoEsperado('Ross 308', d) * 1.06) : 0,
      agua: aguaPorDia(d, 18400 - 50),
      alimentoKg: alimPorDia(d, 18400 - 50),
      alimentoTipo: d < 14 ? 'Iniciador' : d < 28 ? 'Crecimiento' : 'Finalizador',
      tempMin: 18 + Math.round(Math.random()*4), tempMax: 22 + Math.round(Math.random()*4),
      humedad: 60 + Math.round(Math.random()*15), observaciones: '', usuario: 'Carlos Pérez',
      _createdAt: dayAt(35-d+1)
    });
  }
  // Registros para 24-B (galpón 2) - con mortalidad ALTA para que coincida con la alerta
  const mortB = [4,3,3,2,3,3,2,3,4,5,8,15,22,30,45,60,80,128]; // suma ~420 = 2.09% día 18, pero subimos para que dé 3.1%
  for (let d = 1; d <= 18; d++) {
    db.registros.push({
      id: uid('reg'), loteId: 'l_24b', fecha: dayAt(18-d+1),
      mortalidad: mortB[d-1] || 0, peso: (d % 7 === 0) ? Math.round(std.pesoEsperado('Cobb 500', d) * 0.94) : 0,
      agua: aguaPorDia(d, 19700), alimentoKg: alimPorDia(d, 19700),
      alimentoTipo: d < 14 ? 'Iniciador' : 'Crecimiento',
      tempMin: 22 + Math.round(Math.random()*3), tempMax: 27 + Math.round(Math.random()*4),
      humedad: 70 + Math.round(Math.random()*8),
      observaciones: d > 14 ? 'Síntomas respiratorios' : '', usuario: 'Carlos Pérez'
    });
  }

  // ─── HUEVOS (lote 24-C último mes) ───
  for (let d = 0; d < 28; d++) {
    const total = 11500 + Math.round(Math.random()*400);
    const rotos = Math.round(total * (0.012 + Math.random()*0.008));
    const buenos = total - rotos;
    db.huevos.push({
      id: uid('hv'), loteId: 'l_24c', fecha: dayAt(d),
      total, rotos,
      jumbo: Math.round(buenos*0.18), extra: Math.round(buenos*0.42),
      grande: Math.round(buenos*0.28), mediano: Math.round(buenos*0.08),
      _createdAt: dayAt(d)
    });
    const total2 = 10000 + Math.round(Math.random()*300);
    const rotos2 = Math.round(total2 * (0.014 + Math.random()*0.008));
    db.huevos.push({
      id: uid('hv'), loteId: 'l_24d', fecha: dayAt(d),
      total: total2, rotos: rotos2,
      jumbo: Math.round((total2-rotos2)*0.16), extra: Math.round((total2-rotos2)*0.41),
      grande: Math.round((total2-rotos2)*0.30), mediano: Math.round((total2-rotos2)*0.09)
    });
  }

  // ─── VACUNAS (Lote 24-A) ───
  db.vacunas = [
    { id: uid('vac'), loteId: 'l_24a', fecha: dayAt(35), vacuna: 'Marek (día 1)', dosis: '0.2mL/ave', via: 'subcutánea', loteVacuna: 'MK-2024-B', aplicador: 'Carlos Pérez', estado: 'aplicada' },
    { id: uid('vac'), loteId: 'l_24a', fecha: dayAt(28), vacuna: 'Newcastle + Bronquitis (día 7)', dosis: '1 dosis/ave', via: 'ocular', loteVacuna: 'LS-2024', aplicador: 'Carlos Pérez', estado: 'aplicada' },
    { id: uid('vac'), loteId: 'l_24a', fecha: dayAt(21), vacuna: 'Gumboro (día 14)', dosis: '1 dosis/ave', via: 'agua', loteVacuna: 'G-97-2024', aplicador: 'Carlos Pérez', estado: 'aplicada' },
    { id: uid('vac'), loteId: 'l_24a', fecha: dayAt(14), vacuna: 'Newcastle refuerzo (día 21)', dosis: '1 dosis/ave', via: 'agua', loteVacuna: 'LS-2024', aplicador: 'Carlos Pérez', estado: 'aplicada' },
    { id: uid('vac'), loteId: 'l_24a', fecha: dayAt(7), vacuna: 'Coccidiosis refuerzo (día 28)', dosis: '1mL/L', via: 'agua', loteVacuna: 'B-2024', aplicador: '', estado: 'pendiente' }
  ];

  // ─── TRATAMIENTOS ───
  db.tratamientos = [
    { id: uid('trt'), loteId: 'l_24b', fechaInicio: dayAt(2), medicamento: 'Enrofloxacina 10%', dosis: '1mL/L agua', dias: 5, diagnostico: 'Síntomas respiratorios', estado: 'activo', diaActual: 2 },
    { id: uid('trt'), loteId: 'l_24a', fechaInicio: dayAt(1), medicamento: 'Vitaminas ADE', dosis: '0.5mL/L agua', dias: 3, diagnostico: 'Refuerzo previo a salida', estado: 'activo', diaActual: 1 }
  ];

  // ─── INVENTARIO SANIDAD ───
  db.inventarioSanidad = [
    { id: uid('inv'), producto: 'La Sota (Newcastle)', tipo: 'Vacuna', presentacion: '1,000 dosis/frasco', stock: 2, minimo: 3, vencimiento: '2026-08-15' },
    { id: uid('inv'), producto: 'Gumboro G-97', tipo: 'Vacuna', presentacion: '500 dosis/frasco', stock: 8, minimo: 3, vencimiento: '2026-11-20' },
    { id: uid('inv'), producto: 'Enrofloxacina 10%', tipo: 'Antibiótico', presentacion: '1L frasco', stock: 4, minimo: 2, vencimiento: '2027-02-10' },
    { id: uid('inv'), producto: 'Baycox', tipo: 'Antiparasitario', presentacion: '1L frasco', stock: 1, minimo: 2, vencimiento: '2026-06-30' },
    { id: uid('inv'), producto: 'Vitaminas ADE', tipo: 'Vitamina', presentacion: '500mL frasco', stock: 6, minimo: 2, vencimiento: '2026-12-01' }
  ];

  // ─── ENTRADAS ALIMENTO (últimas) ───
  db.entradasAlimento = [
    { id: uid('ea'), galponId: 'g1', fecha: dayAt(1), tipo: 'Finalizador Fase 3', sacos: 520, kgPorSaco: 40, kgTotal: 20800, precioPorTon: 4000, total: 83200, proveedor: 'Nutrimentos del Bajío' },
    { id: uid('ea'), galponId: 'g3', fecha: dayAt(3), tipo: 'Postura producción', sacos: 280, kgPorSaco: 40, kgTotal: 11200, precioPorTon: 4000, total: 44800, proveedor: 'Nutrimentos del Bajío' },
    { id: uid('ea'), galponId: 'g2', fecha: dayAt(6), tipo: 'Crecimiento Fase 2', sacos: 600, kgPorSaco: 40, kgTotal: 24000, precioPorTon: 3750, total: 90000, proveedor: 'ProAlimentos MX' },
    { id: uid('ea'), galponId: 'g4', fecha: dayAt(9), tipo: 'Inicio postura', sacos: 200, kgPorSaco: 40, kgTotal: 8000, precioPorTon: 3900, total: 31200, proveedor: 'Nutrimentos del Bajío' }
  ];

  // ─── VENTAS ───
  db.ventas = [
    { id: uid('vt'), fecha: dayAt(1), clienteId: 'c1', cliente: 'Distribuidora García', tipo: 'Pollo en pie', loteId: 'l_24a', cantidad: 2850, unidad: 'kg', precioUnitario: 36, total: 102600, estadoPago: 'Pagado en efectivo', folio: 'F-2026-001' },
    { id: uid('vt'), fecha: dayAt(1), clienteId: 'c3', cliente: 'Mercado Central', tipo: 'Huevo extra', loteId: 'l_24c', cantidad: 240, unidad: 'ctn', precioUnitario: 72, total: 17280, estadoPago: 'Pagado en efectivo', folio: 'F-2026-002' },
    { id: uid('vt'), fecha: dayAt(2), clienteId: 'c2', cliente: 'Agrotec América', tipo: 'Pollo en pie', loteId: 'l_24a', cantidad: 1200, unidad: 'kg', precioUnitario: 36, total: 43200, estadoPago: 'Pendiente · 15 días', folio: 'F-2026-003' },
    { id: uid('vt'), fecha: dayAt(3), clienteId: 'c5', cliente: 'Huevería Morales', tipo: 'Huevo grande', loteId: 'l_24c', cantidad: 180, unidad: 'ctn', precioUnitario: 64, total: 11520, estadoPago: 'Pagado transferencia', folio: 'F-2026-004' },
    { id: uid('vt'), fecha: dayAt(4), clienteId: 'c4', cliente: 'Pollería Reyes', tipo: 'Pollo en pie', loteId: 'l_24a', cantidad: 980, unidad: 'kg', precioUnitario: 36, total: 35280, estadoPago: 'Pagado en efectivo', folio: 'F-2026-005' },
    { id: uid('vt'), fecha: dayAt(6), clienteId: 'c1', cliente: 'Distribuidora García', tipo: 'Huevo extra', loteId: 'l_24c', cantidad: 800, unidad: 'ctn', precioUnitario: 68, total: 54400, estadoPago: 'Pagado transferencia', folio: 'F-2026-006' },
    { id: uid('vt'), fecha: dayAt(9), clienteId: 'c3', cliente: 'Mercado Central', tipo: 'Huevo jumbo', loteId: 'l_24c', cantidad: 120, unidad: 'ctn', precioUnitario: 84, total: 10080, estadoPago: 'Pendiente · 7 días', folio: 'F-2026-007' }
  ];

  // ─── GASTOS (espejos de las entradas alimento) ───
  db.gastos = [
    { id: uid('gst'), fecha: dayAt(1), loteId: 'l_24a', concepto: 'Alimento finalizador · 520 sacos', categoria: 'Alimento', monto: 83200, proveedor: 'Nutrimentos del Bajío' },
    { id: uid('gst'), fecha: dayAt(2), loteId: 'l_24b', concepto: 'Enrofloxacina 10% · 6 frascos', categoria: 'Medicamento', monto: 2400, proveedor: 'PiSA Agropecuaria' },
    { id: uid('gst'), fecha: dayAt(3), loteId: 'l_24c', concepto: 'Alimento postura · 280 sacos', categoria: 'Alimento', monto: 44800, proveedor: 'Nutrimentos del Bajío' },
    { id: uid('gst'), fecha: dayAt(4), loteId: 'l_24c', concepto: 'Vacuna Newcastle La Sota', categoria: 'Vacuna', monto: 1800, proveedor: 'MSD Salud Animal' },
    { id: uid('gst'), fecha: dayAt(5), loteId: 'l_24a', concepto: 'Mano de obra · semana 18', categoria: 'Mano obra', monto: 8400, proveedor: '' }
  ];

  // ─── CLIMA ───
  for (let d = 0; d < 7; d++) {
    db.galpones.forEach(g => {
      const tempMax = g.id === 'g2' ? 27 + Math.round(Math.random()*4) : 21 + Math.round(Math.random()*4);
      db.clima.push({
        id: uid('cl'), galponId: g.id, fecha: dayAt(d),
        tempMin: tempMax - 5 - Math.round(Math.random()*2),
        tempMax,
        humedad: 60 + Math.round(Math.random()*15),
        observaciones: ''
      });
    });
  }

  // ─── BIOSEGURIDAD ───
  db.bioseguridad = [
    { id: uid('bio'), fecha: dayAt(0), tipo: 'Fumigación', galpones: 'G1, G2', responsable: 'Carlos Pérez', producto: 'Glutaral 20%', observaciones: 'Sin novedades' },
    { id: uid('bio'), fecha: dayAt(1), tipo: 'Visita externa', galpones: 'G2', responsable: 'Dr. Roberto M.', producto: '', observaciones: 'Veterinario asesor · Revisión' },
    { id: uid('bio'), fecha: dayAt(2), tipo: 'Desinfección', galpones: 'Todos', responsable: 'Ana García', producto: 'Virkon S', observaciones: 'Pediluvios · pasillos' },
    { id: uid('bio'), fecha: dayAt(4), tipo: 'Control plagas', galpones: 'G3, G4', responsable: 'Carlos Pérez', producto: 'Neosorexa', observaciones: 'Control roedores mensual' },
    { id: uid('bio'), fecha: dayAt(6), tipo: 'Carga aves', galpones: 'G2', responsable: 'Equipo', producto: '', observaciones: 'Entrada Lote 24-B · Limpieza previa' }
  ];

  // ─── VISITAS ───
  db.visitas = [
    { id: uid('vs'), fecha: dayAt(1), nombre: 'Dr. Roberto Martínez', motivo: 'Veterinario asesor · MVZ-12345', duracion: 90, galpones: 'Galpón 2', autorizado: true },
    { id: uid('vs'), fecha: dayAt(5), nombre: 'Inspector SENASICA', motivo: 'Inspección rutinaria · Folio 4583', duracion: 120, galpones: 'Toda la granja', autorizado: true },
    { id: uid('vs'), fecha: dayAt(1), nombre: 'Proveedor Nutrimentos', motivo: 'Entrega de alimento', duracion: 45, galpones: 'Solo bodega', autorizado: true }
  ];

  // ─── TAREAS HOY ───
  const hoy = dayAt(0);
  db.tareas = [
    { id: uid('tr'), fecha: hoy, titulo: 'Aplicar Newcastle refuerzo', loteId: 'l_24c', loteNombre: 'Lote 24-C', icono: 'vaccine', prioridad: 'high', completada: false, hora: '6:00 AM' },
    { id: uid('tr'), fecha: hoy, titulo: 'Necropsia aves Galpón 2', loteId: 'l_24b', loteNombre: 'Lote 24-B', icono: 'stethoscope', prioridad: 'high', completada: false, hora: 'Antes 4 PM' },
    { id: uid('tr'), fecha: hoy, titulo: 'Pedir alimento finalizador', loteId: 'l_24a', loteNombre: 'Galpón 1', icono: 'truck', prioridad: 'med', completada: false, hora: '3 días stock' },
    { id: uid('tr'), fecha: hoy, titulo: 'Pesaje semanal Lote 24-A', loteId: 'l_24a', loteNombre: 'Lote 24-A', icono: 'scale', prioridad: 'low', completada: true, hora: '7:30 AM' }
  ];

  // ─── ACTIVIDAD RECIENTE ───
  db.actividad = [
    { id: uid('act'), fecha: days(0.02), texto: '<strong>Carlos Pérez</strong> aplicó vacuna Coccidiosis a <strong>Lote 24-A</strong>', tipo: 'g', icono: 'vaccine', usuario: 'Carlos Pérez' },
    { id: uid('act'), fecha: days(0.08), texto: '<strong>Ana García</strong> registró <strong>11,673 huevos</strong> en Galpón 3', tipo: 'b', icono: 'edit', usuario: 'Ana García' },
    { id: uid('act'), fecha: days(0.17), texto: 'Alerta automática: <strong>Mortalidad superó 3%</strong> en Galpón 2', tipo: 'r', icono: 'alert-circle', usuario: 'Sistema' },
    { id: uid('act'), fecha: days(0.30), texto: '<strong>Tú</strong> registraste venta · <strong>+$54,400 MXN</strong>', tipo: 'g', icono: 'cash', usuario: 'Jorge Ramírez' },
    { id: uid('act'), fecha: days(1.15), texto: '<strong>Entrada</strong> · 520 sacos finalizador · Galpón 1', tipo: 'a', icono: 'truck', usuario: 'Sistema' }
  ];

  // ─── CONFIG ───
  db.config = {
    alertas: {
      mortalidadAlta: true,
      vacunaPendiente: true,
      alimentoBajo: true,
      tempAlta: true,
      reporteDiario: false
    },
    integraciones: { wati: true, resend: true, senasica: true, cfdi: false },
    licencia: {
      plan: 'Vitalicia',
      precio: 2999,
      moneda: 'MXN',
      fechaCompra: '2026-01-15',
      activa: true
    }
  };
}

window.seedDemo = seedDemo;
