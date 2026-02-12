import { IsInt, Min, Max } from 'class-validator';

export class CreateTablaItemsBossDto {
  @IsInt()
  piso_numero: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;

  @IsInt()
  item_id: number;
}
