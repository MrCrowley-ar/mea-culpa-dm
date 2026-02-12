import { TablaObjetosCuriosos } from '../../entities/tabla-objetos-curiosos.entity';

export class TablaObjetosCuriososResponseDto {
  id: number;
  piso_numero: number;
  tipo_habitacion_id: number;
  tirada: number;
  item_id: number;
  item_nombre: string | null;

  static fromEntity(
    entity: TablaObjetosCuriosos,
  ): TablaObjetosCuriososResponseDto {
    const dto = new TablaObjetosCuriososResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tipo_habitacion_id = entity.tipo_habitacion_id;
    dto.tirada = entity.tirada;
    dto.item_id = entity.item_id;
    dto.item_nombre = entity.item?.nombre ?? null;
    return dto;
  }
}
