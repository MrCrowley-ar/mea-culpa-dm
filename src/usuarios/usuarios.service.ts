import { Injectable } from '@nestjs/common';
import {
  ConflictServiceException,
  ForbiddenServiceException,
  NotFoundServiceException,
} from '../common/exceptions/service.exception';
import { UsuarioRepository } from './repositories/usuario.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AllowedDiscordIdRepository } from './repositories/allowed-discord-id.repository';
import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from '../common/enums';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly allowedDiscordIdRepo: AllowedDiscordIdRepository,
  ) {}

  async findByDiscordId(discordId: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findByDiscordId(discordId);
    if (!usuario) {
      throw new NotFoundServiceException(
        `Usuario con Discord ID ${discordId} no encontrado`,
      );
    }
    return usuario;
  }

  async findByDiscordIdOrNull(discordId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findByDiscordId(discordId);
  }

  async verifyAllowedDiscordId(discordId: string): Promise<void> {
    const allowed = await this.allowedDiscordIdRepo.findById(discordId);
    if (!allowed) {
      throw new ForbiddenServiceException(
        'Este Discord ID no está autorizado para registrarse',
      );
    }
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const existingDiscord = await this.usuarioRepo.findByDiscordId(
      data.discord_id!,
    );
    if (existingDiscord) {
      throw new ConflictServiceException('El Discord ID ya está registrado');
    }
    return this.usuarioRepo.create(data);
  }

  async update(discordId: string, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findByDiscordId(discordId);
    if (!usuario) {
      throw new NotFoundServiceException(
        `Usuario con Discord ID ${discordId} no encontrado`,
      );
    }
    const updated = await this.usuarioRepo.update(discordId, data);
    return updated!;
  }

  async createJugador(discordId: string, nombre: string): Promise<Usuario> {
    const existing = await this.usuarioRepo.findByDiscordId(discordId);
    if (existing) {
      throw new ConflictServiceException('El Discord ID ya está registrado');
    }
    return this.usuarioRepo.create({
      discord_id: discordId,
      nombre,
      password_hash: null,
      rol: RolUsuario.PLAYER,
    });
  }

  async findJugadores(): Promise<Usuario[]> {
    return this.usuarioRepo.findByRol(RolUsuario.PLAYER);
  }

  async addAllowedDiscordId(discordId: string, nota?: string): Promise<void> {
    const existing = await this.allowedDiscordIdRepo.findById(discordId);
    if (existing) {
      throw new ConflictServiceException(
        'Este Discord ID ya está en la lista de permitidos',
      );
    }
    await this.allowedDiscordIdRepo.create({ discord_id: discordId, nota });
  }

  async removeAllowedDiscordId(discordId: string): Promise<void> {
    const existing = await this.allowedDiscordIdRepo.findById(discordId);
    if (!existing) {
      throw new NotFoundServiceException(
        'Este Discord ID no está en la lista de permitidos',
      );
    }
    await this.allowedDiscordIdRepo.delete(discordId);
  }

  async getAllowedDiscordIds() {
    return this.allowedDiscordIdRepo.findAll();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.findAll();
  }

  async saveRefreshToken(
    usuarioId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.refreshTokenRepo.create({
      usuario_id: usuarioId,
      token,
      expires_at: expiresAt,
    });
  }

  async findRefreshToken(token: string) {
    return this.refreshTokenRepo.findByToken(token);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepo.deleteByToken(token);
  }
}
