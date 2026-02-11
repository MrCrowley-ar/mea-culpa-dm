import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usuariosService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const existingDiscord = await this.usuariosService.findByDiscordId(
      dto.discord_id,
    );
    if (existingDiscord) {
      throw new ConflictException('El Discord ID ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const usuario = await this.usuariosService.create({
      discord_id: dto.discord_id,
      nombre: dto.nombre,
      email: dto.email,
      password_hash: passwordHash,
    });

    return this.generateTokens(usuario.discord_id, usuario.email, usuario.rol);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      usuario.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateTokens(usuario.discord_id, usuario.email, usuario.rol);
  }

  async refreshToken(refreshToken: string) {
    const stored =
      await this.usuariosService.findRefreshToken(refreshToken);
    if (!stored || stored.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    await this.usuariosService.deleteRefreshToken(refreshToken);
    return this.generateTokens(
      stored.usuario.discord_id,
      stored.usuario.email,
      stored.usuario.rol,
    );
  }

  private async generateTokens(
    discordId: string,
    email: string,
    rol: string,
  ) {
    const payload = { sub: discordId, email, rol };

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
