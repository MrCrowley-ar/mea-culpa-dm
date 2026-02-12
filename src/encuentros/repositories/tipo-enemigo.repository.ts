import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEnemigo } from '../entities/tipo-enemigo.entity';

@Injectable()
export class TipoEnemigoRepository {
  constructor(
    @InjectRepository(TipoEnemigo)
    private readonly repo: Repository<TipoEnemigo>,
  ) {}

  async findAll(): Promise<TipoEnemigo[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<TipoEnemigo | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPiso(pisoNumero: number): Promise<TipoEnemigo[]> {
    return this.repo.find({ where: { piso_id: pisoNumero } });
  }

  async create(data: Partial<TipoEnemigo>): Promise<TipoEnemigo> {
    const tipoEnemigo = this.repo.create(data);
    return this.repo.save(tipoEnemigo);
  }

  async update(id: number, data: Partial<TipoEnemigo>): Promise<TipoEnemigo | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
