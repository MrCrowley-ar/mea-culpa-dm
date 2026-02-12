import { TablaRecompensa } from '../../entities/tabla-recompensa.entity';

export class TablaRecompensaResponseDto {
  id: number;
  piso_numero: number;
  tipo_habitacion_id: number;
  rango_min: number;
  rango_max: number;
  tipo_resultado: string;
  dados_oro: string | null;
  subtabla_nombre: string | null;
  descripcion: string | null;

  static fromEntity(entity: TablaRecompensa): TablaRecompensaResponseDto {
    const dto = new TablaRecompensaResponseDto();
    dto.id = entity.id;
    dto.piso_numero = entity.piso_numero;
    dto.tipo_habitacion_id = entity.tipo_habitacion_id;
    dto.rango_min = entity.rango_min;
    dto.rango_max = entity.rango_max;
    dto.tipo_resultado = entity.tipo_resultado;
    dto.dados_oro = entity.dados_oro;
    dto.subtabla_nombre = entity.subtabla_nombre;
    dto.descripcion = entity.descripcion;
    return dto;
  }
}
