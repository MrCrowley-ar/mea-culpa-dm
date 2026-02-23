import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaObjetosCuriosos } from '../entities/tabla-objetos-curiosos.entity';

@Injectable()
export class TablaObjetosCuriososRepository {
  constructor(
    @InjectRepository(TablaObjetosCuriosos)
    private readonly repo: Repository<TablaObjetosCuriosos>,
  ) {}

  async findAll(): Promise<TablaObjetosCuriosos[]> {
    return this.repo.find({
      relations: ['item', 'piso', 'tipo_habitacion'],
    });
  }

  async findById(id: number): Promise<TablaObjetosCuriosos | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPisoAndHabitacion(
    pisoNumero: number,
    tipoHabitacionId: number,
  ): Promise<TablaObjetosCuriosos[]> {
    return this.repo.find({
      where: { piso_numero: pisoNumero, tipo_habitacion_id: tipoHabitacionId },
    });
  }

  async findByTirada(
    pisoNumero: number,
    tipoHabitacionId: number,
    tirada: number,
  ): Promise<TablaObjetosCuriosos | null> {
    // Buscar primero con piso y tipo de habitación específicos
    const especifico = await this.repo.findOne({
      where: { piso_numero: pisoNumero, tipo_habitacion_id: tipoHabitacionId, tirada },
      relations: ['item'],
    });
    if (especifico) return especifico;

    // Fallback: buscar con piso específico y habitación NULL
    const porPiso = await this.repo
      .createQueryBuilder('oc')
      .leftJoinAndSelect('oc.item', 'item')
      .where('oc.piso_numero = :pisoNumero', { pisoNumero })
      .andWhere('oc.tipo_habitacion_id IS NULL')
      .andWhere('oc.tirada = :tirada', { tirada })
      .getOne();
    if (porPiso) return porPiso;

    // Fallback: buscar genérico (piso NULL y habitación NULL)
    return this.repo
      .createQueryBuilder('oc')
      .leftJoinAndSelect('oc.item', 'item')
      .where('oc.piso_numero IS NULL')
      .andWhere('oc.tipo_habitacion_id IS NULL')
      .andWhere('oc.tirada = :tirada', { tirada })
      .getOne();
  }

  async create(data: Partial<TablaObjetosCuriosos>): Promise<TablaObjetosCuriosos> {
    const tablaObjetosCuriosos = this.repo.create(data);
    return this.repo.save(tablaObjetosCuriosos);
  }

  async update(
    id: number,
    data: Partial<TablaObjetosCuriosos>,
  ): Promise<TablaObjetosCuriosos | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
