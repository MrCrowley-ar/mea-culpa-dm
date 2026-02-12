import { IsInt, Min, Max } from 'class-validator';

export class ResolverEncuentroHabitacionDto {
  @IsInt()
  @Min(1)
  historial_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;
}
