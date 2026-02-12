import { IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateHistorialRecompensaDto {
  @IsInt()
  historial_habitacion_id: number;

  @IsInt()
  participacion_id: number;

  @IsInt()
  tirada_original: number;

  @IsOptional()
  @IsInt()
  tirada_subtabla?: number;

  @IsOptional()
  @IsInt()
  item_id?: number;

  @IsOptional()
  @IsInt()
  modificador_tier?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  oro_obtenido?: number;

  @IsOptional()
  @IsBoolean()
  vendido?: boolean;

  @IsOptional()
  @IsInt()
  precio_venta?: number;
}
