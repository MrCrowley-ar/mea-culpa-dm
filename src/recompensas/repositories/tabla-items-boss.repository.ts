import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaItemsBoss } from '../entities/tabla-items-boss.entity';

@Injectable()
export class TablaItemsBossRepository {
  constructor(
    @InjectRepository(TablaItemsBoss)
    private readonly repo: Repository<TablaItemsBoss>,
  ) {}

  async findAll(): Promise<TablaItemsBoss[]> {
    return this.repo.find({
      relations: ['item', 'piso'],
    });
  }

  async findById(id: number): Promise<TablaItemsBoss | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPiso(pisoNumero: number): Promise<TablaItemsBoss[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero },
    });
  }

  async findByTirada(pisoNumero: number, tirada: number): Promise<TablaItemsBoss | null> {
    return this.repo.findOne({
      where: { piso_numero: pisoNumero, tirada },
      relations: ['item'],
    });
  }

  async create(data: Partial<TablaItemsBoss>): Promise<TablaItemsBoss> {
    const tablaItemsBoss = this.repo.create(data);
    return this.repo.save(tablaItemsBoss);
  }

  async update(
    id: number,
    data: Partial<TablaItemsBoss>,
  ): Promise<TablaItemsBoss | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
