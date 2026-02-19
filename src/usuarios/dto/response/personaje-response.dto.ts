import { Personaje } from '../../entities/personaje.entity';

export class PersonajeResponseDto {
  id: number;
  usuario_id: string;
  nombre: string;
  created_at: Date;

  static fromEntity(entity: Personaje): PersonajeResponseDto {
    const dto = new PersonajeResponseDto();
    dto.id = entity.id;
    dto.usuario_id = entity.usuario_id;
    dto.nombre = entity.nombre;
    dto.created_at = entity.created_at;
    return dto;
  }
}
