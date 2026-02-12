export class ParticipanteLiquidadoDto {
  participacion_id: number;
  nombre_personaje: string;
  oro_bruto: number;
  oro_ventas: number;
  oro_total: number;
}

export class LiquidacionResultadoDto {
  expedicion_id: number;
  decisiones_aplicadas: number;
  participantes: ParticipanteLiquidadoDto[];
  oro_total_expedicion: number;
}
