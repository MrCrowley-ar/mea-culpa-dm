import { IsInt, Min } from 'class-validator';

export class RepartirOroHabitacionDto {
  @IsInt()
  @Min(1)
  historial_habitacion_id: number;

  @IsInt()
  @Min(0)
  oro_total: number;
}
