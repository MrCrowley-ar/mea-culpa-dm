import { HistorialRecompensa } from '../../entities/historial-recompensa.entity';

export class HistorialRecompensaResponseDto {
  id: number;
  historial_habitacion_id: number;
  participacion_id: number;
  participacion_personaje: string | null;
  tirada_original: number;
  tirada_subtabla: number | null;
  item_id: number | null;
  item_nombre: string | null;
  modificador_tier: number | null;
  oro_obtenido: number;
  vendido: boolean;
  precio_venta: number | null;
  created_at: Date;

  static fromEntity(
    entity: HistorialRecompensa,
  ): HistorialRecompensaResponseDto {
    const dto = new HistorialRecompensaResponseDto();
    dto.id = entity.id;
    dto.historial_habitacion_id = entity.historial_habitacion_id;
    dto.participacion_id = entity.participacion_id;
    dto.participacion_personaje =
      entity.participacion?.nombre_personaje ?? null;
    dto.tirada_original = entity.tirada_original;
    dto.tirada_subtabla = entity.tirada_subtabla;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    dto.modificador_tier = entity.modificador_tier;
    dto.oro_obtenido = entity.oro_obtenido;
    dto.vendido = entity.vendido;
    dto.precio_venta = entity.precio_venta;
    dto.created_at = entity.created_at;
    return dto;
  }
}
