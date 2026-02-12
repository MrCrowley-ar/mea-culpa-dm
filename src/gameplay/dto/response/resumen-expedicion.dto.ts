export class ItemResumenDto {
  recompensa_id: number;
  habitacion_orden: number;
  tirada_original: number;
  tirada_subtabla: number | null;
  item_id: number | null;
  item_nombre: string | null;
  modificador_tier: number | null;
  oro_obtenido: number;
  vendido: boolean;
  precio_venta: number | null;
}

export class ParticipanteResumenDto {
  participacion_id: number;
  nombre_personaje: string;
  usuario_id: string;
  items: ItemResumenDto[];
  total_oro_bruto: number;
  total_oro_ventas: number;
  total_oro: number;
  oro_acumulado_actual: number;
}

export class ResumenExpedicionDto {
  expedicion_id: number;
  estado: string;
  piso_actual: number;
  total_habitaciones: number;
  participantes: ParticipanteResumenDto[];
  oro_total_expedicion: number;
}
