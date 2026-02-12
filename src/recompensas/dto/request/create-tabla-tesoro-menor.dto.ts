import { IsInt, IsOptional, IsString, MaxLength, Min, Max } from 'class-validator';

export class CreateTablaTesoroMenorDto {
  @IsOptional()
  @IsInt()
  piso_numero?: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada: number;

  @IsOptional()
  @IsInt()
  item_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  efecto_especial?: string;
}
