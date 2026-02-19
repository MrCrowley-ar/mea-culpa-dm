import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AllowedDiscordId } from './entities/allowed-discord-id.entity';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Personaje } from './entities/personaje.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AllowedDiscordIdRepository } from './repositories/allowed-discord-id.repository';
import { UsuarioRolRepository } from './repositories/usuario-rol.repository';
import { PersonajeRepository } from './repositories/personaje.repository';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      RefreshToken,
      AllowedDiscordId,
      UsuarioRol,
      Personaje,
    ]),
  ],
  providers: [
    UsuarioRepository,
    RefreshTokenRepository,
    AllowedDiscordIdRepository,
    UsuarioRolRepository,
    PersonajeRepository,
    UsuariosService,
  ],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
