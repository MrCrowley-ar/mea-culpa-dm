import { Participacion } from '../../entities/participacion.entity';

export class ParticipacionResponseDto {
  id: number;
  expedicion_id: number;
  usuario_id: string;
  usuario_nombre: string | null;
  nombre_personaje: string;
  oro_acumulado: number;
  activo: boolean;
  sala_salida: number | null;
  created_at: Date;

  static fromEntity(entity: Participacion): ParticipacionResponseDto {
    const dto = new ParticipacionResponseDto();
    dto.id = entity.id;
    dto.expedicion_id = entity.expedicion_id;
    dto.usuario_id = entity.usuario_id;
    dto.usuario_nombre = entity.usuario?.nombre ?? null;
    dto.nombre_personaje = entity.nombre_personaje;
    dto.oro_acumulado = entity.oro_acumulado;
    dto.activo = entity.activo;
    dto.sala_salida = entity.sala_salida ?? null;
    dto.created_at = entity.created_at;
    return dto;
  }
}
