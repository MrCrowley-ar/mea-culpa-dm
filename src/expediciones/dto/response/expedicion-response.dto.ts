import { Expedicion } from '../../entities/expedicion.entity';

export class ExpedicionResponseDto {
  id: number;
  organizador_id: string;
  organizador_nombre: string | null;
  fecha: Date;
  estado: string;
  piso_actual: number;
  notas: string | null;
  tiene_snapshot: boolean;
  created_at: Date;
  updated_at: Date;

  static fromEntity(entity: Expedicion): ExpedicionResponseDto {
    const dto = new ExpedicionResponseDto();
    dto.id = entity.id;
    dto.organizador_id = entity.organizador_id;
    dto.organizador_nombre = entity.organizador?.nombre ?? null;
    dto.fecha = entity.fecha;
    dto.estado = entity.estado;
    dto.piso_actual = entity.piso_actual;
    dto.notas = entity.notas;
    dto.tiene_snapshot = entity.estado_snapshot != null;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    return dto;
  }
}
