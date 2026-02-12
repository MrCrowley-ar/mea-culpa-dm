import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateTablaPocionDto {
  @IsOptional()
  @IsInt()
  piso_numero?: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;

  @IsInt()
  item_id: number;
}
