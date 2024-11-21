export function calcularDiasDescuento(
  fechaEmision: string,
  fechaVencimiento: string
): number {
  const fechaEmisionDate = new Date(fechaEmision);
  const fechaVencimientoDate = new Date(fechaVencimiento);

  if (isNaN(fechaEmisionDate.getTime()) || isNaN(fechaVencimientoDate.getTime())) {
    throw new Error("Fechas inválidas");
  }

  const diffTime = fechaVencimientoDate.getTime() - fechaEmisionDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    throw new Error("La fecha de vencimiento debe ser posterior a la fecha de emisión");
  }

  return diffDays;
}


export function calcularSumaCostos(costosAdicionales: { descripcion: string; monto: number }[]): number {
  return costosAdicionales.reduce((acc, costo) => acc + costo.monto, 0);
}

function calcularSumaCostosAdicionales(costosAdicionales: { descripcion: string; monto: number; pagadoAlInicio: boolean }[],
  pagadoAlInicio: boolean): number {
  return costosAdicionales.filter((costo) => costo.pagadoAlInicio === pagadoAlInicio).reduce((acc, costo) => acc + costo.monto, 0);
}

function obtenerDiasPeriodo(tiempoTasa: string): number {
  const diasPorPeriodo: { [key: string]: number } = {
    Anual: 360,
    Semestral: 180,
    Cuatrimestral: 120,
    Trimestral: 90,
    Bimestral: 60,
    Mensual: 30,
    Quincenal: 15,
    Diario: 1,
  };

  if (!(tiempoTasa in diasPorPeriodo)) {
    throw new Error(`Tiempo de Tasa inválido: ${tiempoTasa}`);
  }

  return diasPorPeriodo[tiempoTasa];
}

function calcularTasaDescuento(diasDescuento: number, valorTasa: number, diasPeriodo: number, tipoTasa: string, capitalizacion: string | undefined): number {

  let TEPlazoDeDescuento;

  if (tipoTasa === "Efectiva") {
    TEPlazoDeDescuento = Math.pow(1 + valorTasa / 100, diasDescuento / diasPeriodo) - 1;
  } else if (tipoTasa === "Nominal") {
    TEPlazoDeDescuento = Math.pow(1 + valorTasa / 100 / diasPeriodo, diasDescuento / obtenerDiasPeriodo(capitalizacion!)) - 1;
  } else {
    throw new Error("Tasa inválida");
  }

  return TEPlazoDeDescuento;
}

export function calcularDescuento(importeNominal: number, diasDescuento: number, tipoTasa: string, tiempoTasa: string,
  capitalizacion: string | undefined, valorTasa: number): number {

  const diasPeriodo = obtenerDiasPeriodo(tiempoTasa);
  const TEPlazoDeDescuento = calcularTasaDescuento(diasDescuento, valorTasa, diasPeriodo, tipoTasa, capitalizacion);
  const tasaDescuento = TEPlazoDeDescuento / (1 + TEPlazoDeDescuento);
  const descuento = importeNominal * tasaDescuento;
  console.log("descuento:", descuento);

  return descuento;
}

export function calcularTcea(importeNominal: number, descuento: number, retencion: number,
  costosAdicionales: { descripcion: string; monto: number; pagadoAlInicio: boolean }[],
  portes: number, diasDescuento: number): number {

  retencion = importeNominal * (retencion / 100);

  const valorNeto = importeNominal - descuento;
  const costosInicio = calcularSumaCostosAdicionales(costosAdicionales, true);
  const costosFin = calcularSumaCostosAdicionales(costosAdicionales, false);
  const valorRecibido = valorNeto - costosInicio - retencion;
  const valorEntregado = importeNominal + portes + costosFin - retencion;
  const tcea = 100 * (Math.pow(valorEntregado / valorRecibido, 360 / diasDescuento) - 1);
  console.log("tca", tcea);

  return tcea;
}

export function calcularTceaConMora(importeNominal: number, descuento: number, retencion: number,
  costosAdicionales: { descripcion: string; monto: number; pagadoAlInicio: boolean }[],
  costosMora: { descripcion: string; monto: number }[],
  diasDescuento: number, valorTasa: number, tipoTasa: string, portes: number, capitalizacion: string, tiempoTasa: string,
  diasMora: number, valorTasaMora: number, tipoTasaMora: string, tiempoTasaMora: string, capitalizacionMora?: string,
): number {

  retencion = importeNominal * (retencion / 100);

  const diasPeriodo = obtenerDiasPeriodo(tiempoTasa);
  const diasPeriodoMora = obtenerDiasPeriodo(tiempoTasaMora);

  const valorNeto = importeNominal - descuento;
  const costosInicio = calcularSumaCostosAdicionales(costosAdicionales, true);
  const costosFin = calcularSumaCostosAdicionales(costosAdicionales, false);
  const costosAdicionalesConMora = costosMora.reduce((sum, c) => sum + c.monto, 0);
  const valorRecibido = valorNeto - costosInicio - retencion;
  const valorEntregado = importeNominal + portes + costosFin - retencion;
  const interesesComp = importeNominal * calcularTasaDescuento(diasMora, valorTasa, diasPeriodo, tipoTasa, capitalizacion);
  const interesesMora = importeNominal * calcularTasaDescuento(diasMora, valorTasaMora, diasPeriodoMora, tipoTasaMora, capitalizacionMora);
  const valorEntregadoMora = valorEntregado + costosAdicionalesConMora + interesesMora + interesesComp;
  const tceaMora = (Math.pow(valorEntregadoMora / valorRecibido, 360 / (diasDescuento + diasMora)) - 1) * 100;

  console.log(tceaMora);
  return tceaMora;
}
