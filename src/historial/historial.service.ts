import { Injectable } from '@nestjs/common';
import { NotFoundServiceException } from '../common/exceptions/service.exception';
import { HistorialHabitacionRepository } from './repositories/historial-habitacion.repository';
import { HistorialRecompensaRepository } from './repositories/historial-recompensa.repository';
import { HistorialHabitacion } from './entities/historial-habitacion.entity';
import { HistorialRecompensa } from './entities/historial-recompensa.entity';

@Injectable()
export class HistorialService {
  constructor(
    private readonly histHabitacionRepo: HistorialHabitacionRepository,
    private readonly histRecompensaRepo: HistorialRecompensaRepository,
  ) {}

  // --- Historial Habitaciones ---

  async registrarHabitacion(
    data: Partial<HistorialHabitacion>,
  ): Promise<HistorialHabitacion> {
    return this.histHabitacionRepo.create(data);
  }

  async getHistorialExpedicion(
    expedicionId: number,
  ): Promise<HistorialHabitacion[]> {
    return this.histHabitacionRepo.findByExpedicionId(expedicionId);
  }

  async getHistorialHabitacion(id: number): Promise<HistorialHabitacion> {
    const h = await this.histHabitacionRepo.findById(id);
    if (!h) {
      throw new NotFoundServiceException(
        `Historial habitación con ID ${id} no encontrado`,
      );
    }
    return h;
  }

  async updateHistorialHabitacion(
    id: number,
    data: Partial<HistorialHabitacion>,
  ): Promise<HistorialHabitacion> {
    await this.getHistorialHabitacion(id);
    const updated = await this.histHabitacionRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(
        `Historial habitación con ID ${id} no encontrado`,
      );
    }
    return updated;
  }

  async deleteHistorialHabitacion(id: number): Promise<void> {
    await this.getHistorialHabitacion(id);
    await this.histHabitacionRepo.delete(id);
  }

  // --- Historial Recompensas ---

  async registrarRecompensa(
    data: Partial<HistorialRecompensa>,
  ): Promise<HistorialRecompensa> {
    return this.histRecompensaRepo.create(data);
  }

  async getRecompensasHabitacion(
    habitacionId: number,
  ): Promise<HistorialRecompensa[]> {
    return this.histRecompensaRepo.findByHabitacionId(habitacionId);
  }

  async getHistorialRecompensa(id: number): Promise<HistorialRecompensa> {
    const r = await this.histRecompensaRepo.findById(id);
    if (!r) {
      throw new NotFoundServiceException(
        `Historial recompensa con ID ${id} no encontrado`,
      );
    }
    return r;
  }

  async updateHistorialRecompensa(
    id: number,
    data: Partial<HistorialRecompensa>,
  ): Promise<HistorialRecompensa> {
    await this.getHistorialRecompensa(id);
    const updated = await this.histRecompensaRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(
        `Historial recompensa con ID ${id} no encontrado`,
      );
    }
    return updated;
  }

  async deleteHistorialRecompensa(id: number): Promise<void> {
    await this.getHistorialRecompensa(id);
    await this.histRecompensaRepo.delete(id);
  }
}
