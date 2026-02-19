import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateParticipacionDto {
  @IsString()
  @IsNotEmpty()
  usuario_id: string;

  @IsInt()
  personaje_id: number;
}
