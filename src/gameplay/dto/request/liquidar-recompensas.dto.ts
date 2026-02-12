import { IsInt, IsArray, IsBoolean, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DecisionRecompensaDto {
  @IsInt()
  recompensa_id: number;

  @IsBoolean()
  vendido: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  precio_venta?: number;
}

export class LiquidarRecompensasDto {
  @IsInt()
  expedicion_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DecisionRecompensaDto)
  decisiones: DecisionRecompensaDto[];
}
