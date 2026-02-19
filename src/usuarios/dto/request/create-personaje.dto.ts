import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePersonajeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
