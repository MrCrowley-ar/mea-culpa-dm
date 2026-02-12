import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateEncuentroEnemigoDto {
  @IsInt()
  tabla_encuentro_id: number;

  @IsInt()
  tipo_enemigo_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_cantidad?: number;
}
