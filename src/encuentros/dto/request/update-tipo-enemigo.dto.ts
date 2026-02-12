import { IsString, IsNotEmpty, MaxLength, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateTipoEnemigoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  piso_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
