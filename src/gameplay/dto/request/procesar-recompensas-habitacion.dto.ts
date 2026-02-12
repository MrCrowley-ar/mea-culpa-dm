import { IsInt, Min, IsArray, ValidateNested, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TiradaRecompensaDto {
  @IsInt()
  @Min(1)
  @Max(20)
  tirada_d20: number;

  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  tirada_subtabla?: number;
}

export class ProcesarRecompensasHabitacionDto {
  @IsInt()
  @Min(1)
  historial_habitacion_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TiradaRecompensaDto)
  tiradas: TiradaRecompensaDto[];
}
