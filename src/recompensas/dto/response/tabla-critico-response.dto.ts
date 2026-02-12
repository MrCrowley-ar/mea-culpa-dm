import { TablaCritico } from '../../entities/tabla-critico.entity';

export class TablaCriticoResponseDto {
  id: number;
  piso_numero: number | null;
  tirada: number;
  item_id: number;
  item_nombre: string | null;

  static fromEntity(entity: TablaCritico): TablaCriticoResponseDto {
    const dto = new TablaCriticoResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    return dto;
  }
}
