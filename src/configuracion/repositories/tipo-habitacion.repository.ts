import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from '../entities/tipo-habitacion.entity';

@Injectable()
export class TipoHabitacionRepository {
  constructor(
    @InjectRepository(TipoHabitacion)
    private readonly repo: Repository<TipoHabitacion>,
  ) {}

  async findAll(): Promise<TipoHabitacion[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<TipoHabitacion | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByNombre(nombre: string): Promise<TipoHabitacion | null> {
    return this.repo.findOne({ where: { nombre } });
  }
}
