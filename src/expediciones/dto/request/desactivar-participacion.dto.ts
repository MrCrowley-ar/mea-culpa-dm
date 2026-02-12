import { IsInt, Min } from 'class-validator';

export class DesactivarParticipacionDto {
  @IsInt()
  @Min(1)
  sala_salida: number;
}
