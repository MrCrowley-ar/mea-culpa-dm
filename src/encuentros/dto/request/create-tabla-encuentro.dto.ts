import { IsInt, Min, Max } from 'class-validator';

export class CreateTablaEncuentroDto {
  @IsInt()
  @Min(1)
  @Max(20)
  piso_numero: number;

  @IsInt()
  tipo_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  rango_min: number;

  @IsInt()
  @Min(1)
  @Max(20)
  rango_max: number;

  @IsInt()
  @Min(1)
  cantidad_total: number;
}
