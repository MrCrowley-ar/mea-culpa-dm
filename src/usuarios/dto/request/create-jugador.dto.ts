import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJugadorDto {
  @IsString()
  @IsNotEmpty()
  discord_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
