import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expedicion } from '../entities/expedicion.entity';

@Injectable()
export class ExpedicionRepository {
  constructor(
    @InjectRepository(Expedicion)
    private readonly repo: Repository<Expedicion>,
  ) {}

  async create(data: Partial<Expedicion>): Promise<Expedicion> {
    const expedicion = this.repo.create(data);
    return this.repo.save(expedicion);
  }

  async findAll(): Promise<Expedicion[]> {
    return this.repo.find({
      relations: ['organizador', 'participaciones'],
    });
  }

  async findById(id: number): Promise<Expedicion | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['organizador', 'participaciones', 'participaciones.usuario'],
    });
  }

  async update(id: number, data: Partial<Expedicion>): Promise<Expedicion | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
