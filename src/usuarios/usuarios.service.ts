import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async findByDiscordId(discordId: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { discord_id: discordId } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepo.create(data);
    return this.usuarioRepo.save(usuario);
  }

  async saveRefreshToken(
    usuarioId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const rt = this.refreshTokenRepo.create({
      usuario_id: usuarioId,
      token,
      expires_at: expiresAt,
    });
    return this.refreshTokenRepo.save(rt);
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['usuario'],
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepo.delete({ token });
  }
}
