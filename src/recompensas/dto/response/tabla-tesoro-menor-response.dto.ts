import { TablaTesroMenor } from '../../entities/tabla-tesoro-menor.entity';

export class TablaTesroMenorResponseDto {
  id: number;
  piso_numero: number | null;
  tirada: number;
  item_id: number | null;
  item_nombre: string | null;
  efecto_especial: string | null;

  static fromEntity(entity: TablaTesroMenor): TablaTesroMenorResponseDto {
    const dto = new TablaTesroMenorResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    dto.efecto_especial = entity.efecto_especial;
    return dto;
  }
}
