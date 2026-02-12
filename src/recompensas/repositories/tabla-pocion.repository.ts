import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaPocion } from '../entities/tabla-pocion.entity';

@Injectable()
export class TablaPocionRepository {
  constructor(
    @InjectRepository(TablaPocion)
    private readonly repo: Repository<TablaPocion>,
  ) {}

  async findAll(): Promise<TablaPocion[]> {
    return this.repo.find({
      relations: ['item', 'piso'],
    });
  }

  async findById(id: number): Promise<TablaPocion | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPiso(pisoNumero: number): Promise<TablaPocion[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero },
    });
  }

  async create(data: Partial<TablaPocion>): Promise<TablaPocion> {
    const tablaPocion = this.repo.create(data);
    return this.repo.save(tablaPocion);
  }

  async update(
    id: number,
    data: Partial<TablaPocion>,
  ): Promise<TablaPocion | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
