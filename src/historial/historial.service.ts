import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialHabitacion } from './entities/historial-habitacion.entity';
import { HistorialRecompensa } from './entities/historial-recompensa.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(HistorialHabitacion)
    private readonly histHabitacionRepo: Repository<HistorialHabitacion>,
    @InjectRepository(HistorialRecompensa)
    private readonly histRecompensaRepo: Repository<HistorialRecompensa>,
  ) {}

  async registrarHabitacion(
    data: Partial<HistorialHabitacion>,
  ): Promise<HistorialHabitacion> {
    const registro = this.histHabitacionRepo.create(data);
    return this.histHabitacionRepo.save(registro);
  }

  async registrarRecompensa(
    data: Partial<HistorialRecompensa>,
  ): Promise<HistorialRecompensa> {
    const registro = this.histRecompensaRepo.create(data);
    return this.histRecompensaRepo.save(registro);
  }

  async getHistorialExpedicion(
    expedicionId: number,
  ): Promise<HistorialHabitacion[]> {
    return this.histHabitacionRepo.find({
      where: { expedicion_id: expedicionId },
      relations: ['tipo_habitacion', 'recompensas', 'recompensas.item'],
      order: { orden: 'ASC' },
    });
  }
}
