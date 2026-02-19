import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ConflictServiceException,
  ForbiddenServiceException,
} from '../common/exceptions/service.exception';
import { RolUsuario } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    await this.usuariosService.verifyAllowedDiscordId(dto.discord_id);

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Si ya existe como jugador sin password, promover a DM
    const existing = await this.usuariosService.findByDiscordIdOrNull(dto.discord_id);
    if (existing) {
      if (existing.password_hash) {
        throw new ConflictServiceException('Este Discord ID ya está registrado como DM');
      }
      await this.usuariosService.update(dto.discord_id, {
        nombre: dto.nombre,
        password_hash: passwordHash,
      });
      await this.usuariosService.addRol(dto.discord_id, RolUsuario.DM);
      const usuario = await this.usuariosService.findByDiscordId(dto.discord_id);
      return this.generateTokens(usuario.discord_id, usuario.rolNames);
    }

    await this.usuariosService.create({
      discord_id: dto.discord_id,
      nombre: dto.nombre,
      password_hash: passwordHash,
    });
    await this.usuariosService.addRol(dto.discord_id, RolUsuario.DM);
    const usuario = await this.usuariosService.findByDiscordId(dto.discord_id);

    return this.generateTokens(usuario.discord_id, usuario.rolNames);
  }

  async login(dto: LoginDto) {
    await this.usuariosService.verifyAllowedDiscordId(dto.discord_id);

    const usuario = await this.usuariosService.findByDiscordIdOrNull(dto.discord_id);
    if (!usuario || !usuario.password_hash) {
      throw new ForbiddenServiceException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      usuario.password_hash,
    );
    if (!isPasswordValid) {
      throw new ForbiddenServiceException('Credenciales inválidas');
    }

    return this.generateTokens(usuario.discord_id, usuario.rolNames);
  }

  async refreshToken(refreshToken: string) {
    const stored =
      await this.usuariosService.findRefreshToken(refreshToken);
    if (!stored || stored.expires_at < new Date()) {
      throw new ForbiddenServiceException(
        'Refresh token inválido o expirado',
      );
    }

    await this.usuariosService.deleteRefreshToken(refreshToken);
    const usuario = await this.usuariosService.findByDiscordId(
      stored.usuario.discord_id,
    );
    return this.generateTokens(usuario.discord_id, usuario.rolNames);
  }

  private async generateTokens(
    discordId: string,
    roles: string[],
  ) {
    const payload = { sub: discordId, roles };

    const accessToken = this.jwtService.sign(payload);

    const refreshExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      '7d',
    );
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(
      refreshExpiresAt.getDate() + parseInt(refreshExpiration, 10) || 7,
    );

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshExpiration as any,
    });

    await this.usuariosService.saveRefreshToken(
      discordId,
      refreshToken,
      refreshExpiresAt,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
