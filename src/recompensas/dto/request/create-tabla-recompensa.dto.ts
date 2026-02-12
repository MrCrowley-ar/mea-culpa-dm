import { IsInt, Min, Max, IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoResultadoRecompensa } from '../../../common/enums';

export class CreateTablaRecompensaDto {
  @IsInt()
  @Min(1)
  @Max(20)
  piso_numero: number;

  @IsInt()
  tipo_habitacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  rango_min: number;

  @IsInt()
  @Min(1)
  @Max(20)
  rango_max: number;

  @IsEnum(TipoResultadoRecompensa)
  tipo_resultado: TipoResultadoRecompensa;

  @IsOptional()
  @IsString()
  dados_oro?: string;

  @IsOptional()
  @IsString()
  subtabla_nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
