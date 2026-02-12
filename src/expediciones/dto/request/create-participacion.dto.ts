import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateParticipacionDto {
  @IsString()
  @IsNotEmpty()
  usuario_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_personaje: string;
}
