import { IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateExpedicionDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
