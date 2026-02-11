import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaRecompensa } from './entities/tabla-recompensa.entity';

@Injectable()
export class RecompensasService {
  constructor(
    @InjectRepository(TablaRecompensa)
    private readonly tablaRecompensaRepo: Repository<TablaRecompensa>,
  ) {}

  async getRecompensa(
    pisoNumero: number,
    tipoHabitacionId: number,
    tiradaConBonus: number,
  ): Promise<TablaRecompensa | null> {
    return this.tablaRecompensaRepo
      .createQueryBuilder('tr')
      .where('tr.piso_numero = :pisoNumero', { pisoNumero })
      .andWhere('tr.tipo_habitacion_id = :tipoHabitacionId', {
        tipoHabitacionId,
      })
      .andWhere(
        'tr.rango_min <= :tiradaConBonus AND tr.rango_max >= :tiradaConBonus',
        { tiradaConBonus },
      )
      .getOne();
  }
}
