import { IsInt, Min, Max } from 'class-validator';

export class CreateTablaObjetosCuriososDto {
  @IsInt()
  piso_numero: number;

  @IsInt()
  tipo_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;

  @IsInt()
  item_id: number;
}
