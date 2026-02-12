import { EncuentroEnemigo } from '../../entities/encuentro-enemigo.entity';

export class EncuentroEnemigoResponseDto {
  id: number;
  tabla_encuentro_id: number;
  tipo_enemigo_id: number;
  tipo_enemigo_nombre: string | null;
  max_cantidad: number | null;

  static fromEntity(entity: EncuentroEnemigo): EncuentroEnemigoResponseDto {
    const dto = new EncuentroEnemigoResponseDto();
    dto.id = entity.id;
    dto.tabla_encuentro_id = entity.tabla_encuentro_id;
    dto.tipo_enemigo_id = entity.tipo_enemigo_id;
    dto.tipo_enemigo_nombre = entity.tipo_enemigo?.nombre ?? null;
    dto.max_cantidad = entity.max_cantidad;
    return dto;
  }
}
