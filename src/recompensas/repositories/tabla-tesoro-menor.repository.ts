import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaTesroMenor } from '../entities/tabla-tesoro-menor.entity';

@Injectable()
export class TablaTesroMenorRepository {
  constructor(
    @InjectRepository(TablaTesroMenor)
    private readonly repo: Repository<TablaTesroMenor>,
  ) {}

  async findAll(): Promise<TablaTesroMenor[]> {
    return this.repo.find({
      relations: ['item', 'piso'],
    });
  }

  async findById(id: number): Promise<TablaTesroMenor | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPiso(pisoNumero: number): Promise<TablaTesroMenor[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero },
    });
  }

  async findByTirada(tirada: number, pisoNumero?: number): Promise<TablaTesroMenor | null> {
    const where: any = { tirada };
    if (pisoNumero) where.piso_numero = pisoNumero;
    return this.repo.findOne({ where, relations: ['item'] });
  }

  async create(data: Partial<TablaTesroMenor>): Promise<TablaTesroMenor> {
    const tablaTesroMenor = this.repo.create(data);
    return this.repo.save(tablaTesroMenor);
  }

  async update(
    id: number,
    data: Partial<TablaTesroMenor>,
  ): Promise<TablaTesroMenor | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
