import { TablaItemsBoss } from '../../entities/tabla-items-boss.entity';

export class TablaItemsBossResponseDto {
  id: number;
  piso_numero: number;
  tirada: number;
  item_id: number;
  item_nombre: string | null;

  static fromEntity(entity: TablaItemsBoss): TablaItemsBossResponseDto {
    const dto = new TablaItemsBossResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    return dto;
  }
}
