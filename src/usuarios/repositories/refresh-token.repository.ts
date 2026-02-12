import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {}

  async create(data: {
    usuario_id: string;
    token: string;
    expires_at: Date;
  }): Promise<RefreshToken> {
    const refreshToken = this.repo.create(data);
    return this.repo.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repo.findOne({
      where: { token },
      relations: ['usuario'],
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repo.delete({ token });
  }

  async deleteByUsuarioId(usuarioId: string): Promise<void> {
    await this.repo.delete({ usuario_id: usuarioId });
  }
}
