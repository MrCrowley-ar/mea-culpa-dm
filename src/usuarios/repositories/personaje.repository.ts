import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personaje } from '../entities/personaje.entity';

@Injectable()
export class PersonajeRepository {
  constructor(
    @InjectRepository(Personaje)
    private readonly repo: Repository<Personaje>,
  ) {}

  async findByUsuarioId(usuarioId: string): Promise<Personaje[]> {
    return this.repo.find({ where: { usuario_id: usuarioId } });
  }

  async findById(id: number): Promise<Personaje | null> {
    return this.repo.findOne({ where: { id }, relations: ['usuario'] });
  }

  async create(data: Partial<Personaje>): Promise<Personaje> {
    const personaje = this.repo.create(data);
    return this.repo.save(personaje);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
