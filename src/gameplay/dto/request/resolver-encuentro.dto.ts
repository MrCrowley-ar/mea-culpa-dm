import { IsInt, Min, Max } from 'class-validator';

export class ResolverEncuentroDto {
  @IsInt()
  @Min(1)
  @Max(20)
  piso: number;

  @IsInt()
  tipo_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;
}
