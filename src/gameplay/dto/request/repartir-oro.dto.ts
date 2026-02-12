import { IsInt, IsArray, Min, ArrayMinSize } from 'class-validator';

export class RepartirOroDto {
  @IsInt()
  historial_habitacion_id: number;

  @IsInt()
  @Min(1)
  oro_total: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  participacion_ids: number[];
}
