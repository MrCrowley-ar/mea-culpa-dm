import { Piso } from '../../entities/piso.entity';

export class PisoResponseDto {
  numero: number;
  tier_id: number;
  tier_numero: number | null;
  bonus_recompensa: number;
  num_habitaciones_comunes: number;

  static fromEntity(entity: Piso): PisoResponseDto {
    const dto = new PisoResponseDto();
    dto.numero = entity.numero;
    dto.tier_id = entity.tier_id;
    dto.tier_numero = entity.tier?.numero ?? null;
    dto.bonus_recompensa = entity.bonus_recompensa;
    dto.num_habitaciones_comunes = entity.num_habitaciones_comunes;
    return dto;
  }
}
