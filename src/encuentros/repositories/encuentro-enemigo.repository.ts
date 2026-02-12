import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncuentroEnemigo } from '../entities/encuentro-enemigo.entity';

@Injectable()
export class EncuentroEnemigoRepository {
  constructor(
    @InjectRepository(EncuentroEnemigo)
    private readonly repo: Repository<EncuentroEnemigo>,
  ) {}

  async create(data: Partial<EncuentroEnemigo>): Promise<EncuentroEnemigo> {
    const encuentroEnemigo = this.repo.create(data);
    return this.repo.save(encuentroEnemigo);
  }

  async findByTablaEncuentroId(
    tablaEncuentroId: number,
  ): Promise<EncuentroEnemigo[]> {
    return this.repo.find({
      where: { tabla_encuentro_id: tablaEncuentroId },
      relations: ['tipo_enemigo'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
