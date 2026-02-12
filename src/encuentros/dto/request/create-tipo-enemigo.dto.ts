import { IsString, IsNotEmpty, MaxLength, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateTipoEnemigoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsInt()
  @Min(1)
  @Max(20)
  piso_id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
