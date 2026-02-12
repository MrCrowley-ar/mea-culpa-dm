import { HistorialHabitacion } from '../../../historial/entities/historial-habitacion.entity';

export class HabitacionLayoutDto {
  id: number;
  orden: number;
  tipo_habitacion_id: number;
  tipo_nombre: string;
  completada: boolean;
}

export class LayoutPisoResponseDto {
  expedicion_id: number;
  piso: number;
  total_habitaciones: number;
  habitaciones: HabitacionLayoutDto[];

  static fromEntities(
    expedicionId: number,
    piso: number,
    habitaciones: HistorialHabitacion[],
  ): LayoutPisoResponseDto {
    const dto = new LayoutPisoResponseDto();
    dto.expedicion_id = expedicionId;
    dto.piso = piso;
    dto.total_habitaciones = habitaciones.length;
    dto.habitaciones = habitaciones.map((h) => {
      const hab = new HabitacionLayoutDto();
      hab.id = h.id;
      hab.orden = h.orden;
      hab.tipo_habitacion_id = h.tipo_habitacion_id;
      hab.tipo_nombre = h.tipo_habitacion?.nombre ?? '';
      hab.completada = h.completada;
      return hab;
    });
    return dto;
  }
}
