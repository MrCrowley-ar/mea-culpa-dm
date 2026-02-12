import { HistorialHabitacion } from '../../entities/historial-habitacion.entity';
import { HistorialRecompensaResponseDto } from './historial-recompensa-response.dto';

export class HistorialHabitacionResponseDto {
  id: number;
  expedicion_id: number;
  piso_numero: number;
  tipo_habitacion_id: number;
  tipo_habitacion_nombre: string | null;
  orden: number;
  tirada_encuentro: number | null;
  enemigos_derrotados: number;
  completada: boolean;
  notas: string | null;
  created_at: Date;
  recompensas: HistorialRecompensaResponseDto[];

  static fromEntity(
    entity: HistorialHabitacion,
  ): HistorialHabitacionResponseDto {
    const dto = new HistorialHabitacionResponseDto();
    dto.id = entity.id;
    dto.expedicion_id = entity.expedicion_id;
    dto.piso_numero = entity.piso_numero;
    dto.tipo_habitacion_id = entity.tipo_habitacion_id;
    dto.tipo_habitacion_nombre = entity.tipo_habitacion?.nombre ?? null;
    dto.orden = entity.orden;
    dto.tirada_encuentro = entity.tirada_encuentro;
    dto.enemigos_derrotados = entity.enemigos_derrotados;
    dto.completada = entity.completada;
    dto.notas = entity.notas;
    dto.created_at = entity.created_at;
    dto.recompensas =
      entity.recompensas?.map((r) =>
        HistorialRecompensaResponseDto.fromEntity(r),
      ) ?? [];
    return dto;
  }
}
