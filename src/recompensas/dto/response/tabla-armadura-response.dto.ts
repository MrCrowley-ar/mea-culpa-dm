import { TablaArmadura } from '../../entities/tabla-armadura.entity';

export class TablaArmaduraResponseDto {
  id: number;
  tirada: number;
  item_id: number;
  item_nombre: string | null;

  static fromEntity(entity: TablaArmadura): TablaArmaduraResponseDto {
    const dto = new TablaArmaduraResponseDto();
    dto.id = entity.id;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    return dto;
  }
}
