import { Item } from '../../entities/item.entity';

export class ItemResponseDto {
  id: number;
  nombre: string;
  tipo: string;
  precio_base: number | null;
  dados_precio: string | null;
  descripcion: string | null;
  es_base_modificable: boolean;

  static fromEntity(entity: Item): ItemResponseDto {
    const dto = new ItemResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.tipo = entity.tipo;
    dto.precio_base = entity.precio_base;
    dto.dados_precio = entity.dados_precio;
    dto.descripcion = entity.descripcion;
    dto.es_base_modificable = entity.es_base_modificable;
    return dto;
  }
}
