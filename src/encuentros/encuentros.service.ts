import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaEncuentro } from './entities/tabla-encuentro.entity';

@Injectable()
export class EncuentrosService {
  constructor(
    @InjectRepository(TablaEncuentro)
    private readonly tablaEncuentroRepo: Repository<TablaEncuentro>,
  ) {}

  async getEncuentro(
    pisoNumero: number,
    tipoHabitacionId: number,
    tirada: number,
  ): Promise<TablaEncuentro | null> {
    return this.tablaEncuentroRepo
      .createQueryBuilder('te')
      .leftJoinAndSelect('te.enemigos', 'ee')
      .leftJoinAndSelect('ee.tipo_enemigo', 'ten')
      .where('te.piso_numero = :pisoNumero', { pisoNumero })
      .andWhere('te.tipo_habitacion_id = :tipoHabitacionId', {
        tipoHabitacionId,
      })
      .andWhere('te.rango_min <= :tirada AND te.rango_max >= :tirada', {
        tirada,
      })
      .getOne();
  }
}
