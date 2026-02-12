import { IsOptional, IsEnum, IsInt, IsString, Min, Max } from 'class-validator';
import { EstadoExpedicion } from '../../../common/enums';

export class UpdateExpedicionDto {
  @IsOptional()
  @IsEnum(EstadoExpedicion)
  estado?: EstadoExpedicion;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  piso_actual?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
