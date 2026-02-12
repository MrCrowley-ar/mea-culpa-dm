import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { TipoItem } from '../../../common/enums';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsEnum(TipoItem)
  tipo: TipoItem;

  @IsOptional()
  @IsInt()
  precio_base?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dados_precio?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  es_base_modificable?: boolean;
}
