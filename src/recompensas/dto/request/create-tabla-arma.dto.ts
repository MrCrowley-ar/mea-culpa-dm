import { IsInt, Min, Max } from 'class-validator';

export class CreateTablaArmaDto {
  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;

  @IsInt()
  item_id: number;
}
