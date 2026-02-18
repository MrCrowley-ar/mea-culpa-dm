import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async findByDiscordId(id: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { discord_id: id } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.repo.create(data);
    return this.repo.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.repo.find();
  }

  async findByRol(rol: string): Promise<Usuario[]> {
    return this.repo.find({ where: { rol: rol as any } });
  }

  async update(discordId: string, data: Partial<Usuario>): Promise<Usuario | null> {
    await this.repo.update(discordId, data);
    return this.findByDiscordId(discordId);
  }
}
