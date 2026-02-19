import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialRecompensa } from '../entities/historial-recompensa.entity';

@Injectable()
export class HistorialRecompensaRepository {
  constructor(
    @InjectRepository(HistorialRecompensa)
    private readonly repo: Repository<HistorialRecompensa>,
  ) {}

  async create(data: Partial<HistorialRecompensa>): Promise<HistorialRecompensa> {
    const historialRecompensa = this.repo.create(data);
    return this.repo.save(historialRecompensa);
  }

  async findByHabitacionId(
    habitacionId: number,
  ): Promise<HistorialRecompensa[]> {
    return this.repo.find({
      where: { historial_habitacion_id: habitacionId },
      relations: ['item', 'participacion', 'participacion.personaje'],
    });
  }

  async findById(id: number): Promise<HistorialRecompensa | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    id: number,
    data: Partial<HistorialRecompensa>,
  ): Promise<HistorialRecompensa | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
