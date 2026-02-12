import { TablaEncuentro } from '../../entities/tabla-encuentro.entity';
import { EncuentroEnemigoResponseDto } from './encuentro-enemigo-response.dto';

export class TablaEncuentroResponseDto {
  id: number;
  piso_numero: number;
  tipo_habitacion_id: number;
  rango_min: number;
  rango_max: number;
  cantidad_total: number;
  enemigos: EncuentroEnemigoResponseDto[];

  static fromEntity(entity: TablaEncuentro): TablaEncuentroResponseDto {
    const dto = new TablaEncuentroResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tipo_habitacion_id = entity.tipo_habitacion_id;
    dto.rango_min = entity.rango_min;
    dto.rango_max = entity.rango_max;
    dto.cantidad_total = entity.cantidad_total;
    dto.enemigos =
      entity.enemigos?.map((e) => EncuentroEnemigoResponseDto.fromEntity(e)) ??
      [];
    return dto;
  }
}
