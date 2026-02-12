import { IsInt, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class GenerarLayoutPisoDto {
  @IsInt()
  @Min(1)
  expedicion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  piso: number;

  @IsBoolean()
  @IsOptional()
  incluir_bonus?: boolean;

  @IsBoolean()
  @IsOptional()
  incluir_evento?: boolean;
}
