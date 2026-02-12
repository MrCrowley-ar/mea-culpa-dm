import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablaArmadura } from '../entities/tabla-armadura.entity';

@Injectable()
export class TablaArmaduraRepository {
  constructor(
    @InjectRepository(TablaArmadura)
    private readonly repo: Repository<TablaArmadura>,
  ) {}

  async findAll(): Promise<TablaArmadura[]> {
    return this.repo.find({
      relations: ['item'],
    });
  }

  async findById(id: number): Promise<TablaArmadura | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByTirada(tirada: number): Promise<TablaArmadura | null> {
    return this.repo
      .createQueryBuilder('tabla_armadura')
      .where('tabla_armadura.rango_min <= :tirada', { tirada })
      .andWhere('tabla_armadura.rango_max >= :tirada', { tirada })
      .getOne();
  }

  async create(data: Partial<TablaArmadura>): Promise<TablaArmadura> {
    const tablaArmadura = this.repo.create(data);
    return this.repo.save(tablaArmadura);
  }

  async update(
    id: number,
    data: Partial<TablaArmadura>,
  ): Promise<TablaArmadura | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
