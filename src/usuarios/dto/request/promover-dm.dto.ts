import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PromoverDmDto {
  @IsString()
  @IsNotEmpty()
  discord_id: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nota?: string;
}
