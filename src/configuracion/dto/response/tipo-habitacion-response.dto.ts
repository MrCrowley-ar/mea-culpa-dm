import { TipoHabitacion } from '../../entities/tipo-habitacion.entity';

export class TipoHabitacionResponseDto {
  id: number;
  nombre: string;
  usa_tabla_boss: boolean;
  descripcion: string | null;

  static fromEntity(entity: TipoHabitacion): TipoHabitacionResponseDto {
    const dto = new TipoHabitacionResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.usa_tabla_boss = entity.usa_tabla_boss;
    dto.descripcion = entity.descripcion;
    return dto;
  }
}
