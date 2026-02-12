import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaRecompensa } from '../entities/tabla-recompensa.entity';

@Injectable()
export class TablaRecompensaRepository {
  constructor(
    @InjectRepository(TablaRecompensa)
    private readonly repo: Repository<TablaRecompensa>,
  ) {}

  async findAll(): Promise<TablaRecompensa[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<TablaRecompensa | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPisoAndHabitacion(
    pisoNumero: number,
    tipoHabitacionId: number,
  ): Promise<TablaRecompensa[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero, tipo_habitacion_id: tipoHabitacionId },
    });
  }

  async findByTirada(
    pisoNumero: number,
    tipoHabitacionId: number,
    tiradaConBonus: number,
  ): Promise<TablaRecompensa | null> {
    return this.repo
      .createQueryBuilder('tabla_recompensa')
      .where('tabla_recompensa.piso_numero = :pisoNumero', { pisoNumero })
      .andWhere('tabla_recompensa.tipo_habitacion_id = :tipoHabitacionId', {
        tipoHabitacionId,
      })
      .andWhere('tabla_recompensa.rango_min <= :tiradaConBonus', {
        tiradaConBonus,
      })
      .andWhere('tabla_recompensa.rango_max >= :tiradaConBonus', {
        tiradaConBonus,
      })
      .getOne();
  }

  async create(data: Partial<TablaRecompensa>): Promise<TablaRecompensa> {
    const tablaRecompensa = this.repo.create(data);
    return this.repo.save(tablaRecompensa);
  }

  async update(
    id: number,
    data: Partial<TablaRecompensa>,
  ): Promise<TablaRecompensa | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
