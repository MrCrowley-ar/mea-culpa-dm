import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class ResolverRecompensaDto {
  @IsInt()
  @Min(1)
  @Max(20)
  piso: number;

  @IsInt()
  tipo_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada_d20: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  tirada_subtabla?: number;
}
