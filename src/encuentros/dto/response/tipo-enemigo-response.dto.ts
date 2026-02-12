import { TipoEnemigo } from '../../entities/tipo-enemigo.entity';

export class TipoEnemigoResponseDto {
  id: number;
  nombre: string;
  piso_id: number;
  descripcion: string | null;

  static fromEntity(entity: TipoEnemigo): TipoEnemigoResponseDto {
    const dto = new TipoEnemigoResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.piso_id = entity.piso_id;
    dto.descripcion = entity.descripcion;
    return dto;
  }
}
