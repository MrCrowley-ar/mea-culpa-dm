import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class AsignarItemDto {
  @IsInt()
  @Min(1)
  historial_habitacion_id: number;

  @IsInt()
  @Min(1)
  participacion_id: number;

  @IsInt()
  @Min(1)
  @Max(20)
  tirada_original: number;

  @IsInt()
  @Min(0)
  @Max(20)
  @IsOptional()
  tirada_subtabla?: number;

  @IsInt()
  @Min(1)
  item_id: number;

  @IsInt()
  @IsOptional()
  modificador_tier?: number;
}
