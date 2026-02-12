import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaCritico } from '../entities/tabla-critico.entity';

@Injectable()
export class TablaCriticoRepository {
  constructor(
    @InjectRepository(TablaCritico)
    private readonly repo: Repository<TablaCritico>,
  ) {}

  async findAll(): Promise<TablaCritico[]> {
    return this.repo.find({
      relations: ['item', 'piso'],
    });
  }

  async findById(id: number): Promise<TablaCritico | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPiso(pisoNumero: number): Promise<TablaCritico[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero },
    });
  }

  async findByTirada(tirada: number, pisoNumero?: number): Promise<TablaCritico | null> {
    const where: any = { tirada };
    if (pisoNumero) where.piso_numero = pisoNumero;
    return this.repo.findOne({ where, relations: ['item'] });
  }

  async create(data: Partial<TablaCritico>): Promise<TablaCritico> {
    const tablaCritico = this.repo.create(data);
    return this.repo.save(tablaCritico);
  }

  async update(
    id: number,
    data: Partial<TablaCritico>,
  ): Promise<TablaCritico | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
