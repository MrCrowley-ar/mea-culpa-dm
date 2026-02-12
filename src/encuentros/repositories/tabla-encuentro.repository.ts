import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaEncuentro } from '../entities/tabla-encuentro.entity';

@Injectable()
export class TablaEncuentroRepository {
  constructor(
    @InjectRepository(TablaEncuentro)
    private readonly repo: Repository<TablaEncuentro>,
  ) {}

  async findAll(): Promise<TablaEncuentro[]> {
    return this.repo.find({
      relations: ['piso', 'tipo_habitacion', 'enemigos', 'enemigos.tipo_enemigo'],
    });
  }

  async findById(id: number): Promise<TablaEncuentro | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['piso', 'tipo_habitacion', 'enemigos', 'enemigos.tipo_enemigo'],
    });
  }

  async findByPisoAndHabitacion(
    pisoNumero: number,
    tipoHabitacionId: number,
  ): Promise<TablaEncuentro[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero, tipo_habitacion_id: tipoHabitacionId },
    });
  }

  async findByTirada(
    pisoNumero: number,
    tipoHabitacionId: number,
    tirada: number,
  ): Promise<TablaEncuentro | null> {
    return this.repo
      .createQueryBuilder('tabla_encuentro')
      .leftJoinAndSelect('tabla_encuentro.enemigos', 'enemigos')
      .leftJoinAndSelect('enemigos.tipo_enemigo', 'tipo_enemigo')
      .where('tabla_encuentro.piso_numero = :pisoNumero', { pisoNumero })
      .andWhere('tabla_encuentro.tipo_habitacion_id = :tipoHabitacionId', {
        tipoHabitacionId,
      })
      .andWhere('tabla_encuentro.rango_min <= :tirada', { tirada })
      .andWhere('tabla_encuentro.rango_max >= :tirada', { tirada })
      .getOne();
  }

  async create(data: Partial<TablaEncuentro>): Promise<TablaEncuentro> {
    const tablaEncuentro = this.repo.create(data);
    return this.repo.save(tablaEncuentro);
  }

  async update(
    id: number,
    data: Partial<TablaEncuentro>,
  ): Promise<TablaEncuentro | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
