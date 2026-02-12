import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialHabitacion } from '../entities/historial-habitacion.entity';

@Injectable()
export class HistorialHabitacionRepository {
  constructor(
    @InjectRepository(HistorialHabitacion)
    private readonly repo: Repository<HistorialHabitacion>,
  ) {}

  async create(data: Partial<HistorialHabitacion>): Promise<HistorialHabitacion> {
    const historialHabitacion = this.repo.create(data);
    return this.repo.save(historialHabitacion);
  }

  async findByExpedicionId(
    expedicionId: number,
  ): Promise<HistorialHabitacion[]> {
    return this.repo.find({
      where: { expedicion_id: expedicionId },
      relations: [
        'tipo_habitacion',
        'recompensas',
        'recompensas.item',
        'recompensas.participacion',
      ],
      order: { orden: 'ASC' },
    });
  }

  async findById(id: number): Promise<HistorialHabitacion | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(
    id: number,
    data: Partial<HistorialHabitacion>,
  ): Promise<HistorialHabitacion | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
