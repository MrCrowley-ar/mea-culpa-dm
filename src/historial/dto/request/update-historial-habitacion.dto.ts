import { IsInt, IsOptional, IsBoolean, IsString, Min, Max } from 'class-validator';

export class UpdateHistorialHabitacionDto {
  @IsOptional()
  @IsInt()
  expedicion_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  piso_numero?: number;

  @IsOptional()
  @IsInt()
  tipo_habitacion_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  tirada_encuentro?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enemigos_derrotados?: number;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}
