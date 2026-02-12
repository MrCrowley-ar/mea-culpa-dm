import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaArma } from '../entities/tabla-arma.entity';

@Injectable()
export class TablaArmaRepository {
  constructor(
    @InjectRepository(TablaArma)
    private readonly repo: Repository<TablaArma>,
  ) {}

  async findAll(): Promise<TablaArma[]> {
    return this.repo.find({
      relations: ['item'],
    });
  }

  async findById(id: number): Promise<TablaArma | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByTirada(tirada: number): Promise<TablaArma | null> {
    return this.repo.findOne({
      where: { tirada },
      relations: ['item'],
    });
  }

  async create(data: Partial<TablaArma>): Promise<TablaArma> {
    const tablaArma = this.repo.create(data);
    return this.repo.save(tablaArma);
  }

  async update(id: number, data: Partial<TablaArma>): Promise<TablaArma | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
