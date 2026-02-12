import { TablaArma } from '../../entities/tabla-arma.entity';

export class TablaArmaResponseDto {
  id: number;
  tirada: number;
  item_id: number;
  item_nombre: string | null;

  static fromEntity(entity: TablaArma): TablaArmaResponseDto {
    const dto = new TablaArmaResponseDto();
    dto.id = entity.id;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    return dto;
  }
}
