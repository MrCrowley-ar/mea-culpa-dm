import { Tier } from '../../entities/tier.entity';

export class TierResponseDto {
  id: number;
  numero: number;
  piso_min: number;
  piso_max: number;
  mod_armas: number;
  mod_armaduras: number;
  descripcion: string | null;

  static fromEntity(entity: Tier): TierResponseDto {
    const dto = new TierResponseDto();
    dto.id = entity.id;
    dto.numero = entity.numero;
    dto.piso_min = entity.piso_min;
    dto.piso_max = entity.piso_max;
    dto.mod_armas = entity.mod_armas;
    dto.mod_armaduras = entity.mod_armaduras;
    dto.descripcion = entity.descripcion;
    return dto;
  }
}
