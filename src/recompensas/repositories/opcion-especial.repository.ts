import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpcionEspecial } from '../entities/opcion-especial.entity';

@Injectable()
export class OpcionEspecialRepository {
  constructor(
    @InjectRepository(OpcionEspecial)
    private readonly repo: Repository<OpcionEspecial>,
  ) {}

  async findAll(): Promise<OpcionEspecial[]> {
    return this.repo.find({
      relations: ['tabla_recompensa'],
    });
  }

  async findByTablaRecompensaId(
    tablaRecompensaId: number,
  ): Promise<OpcionEspecial[]> {
    return this.repo.find({
      where: { tabla_recompensa_id: tablaRecompensaId },
    });
  }

  async create(data: Partial<OpcionEspecial>): Promise<OpcionEspecial> {
    const opcion = this.repo.create(data);
    return this.repo.save(opcion);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByTablaRecompensaId(tablaRecompensaId: number): Promise<void> {
    await this.repo.delete({ tabla_recompensa_id: tablaRecompensaId });
  }
}
