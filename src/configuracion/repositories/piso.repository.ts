import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Piso } from '../entities/piso.entity';

@Injectable()
export class PisoRepository {
  constructor(
    @InjectRepository(Piso)
    private readonly repo: Repository<Piso>,
  ) {}

  async findAll(): Promise<Piso[]> {
    return this.repo.find({
      relations: ['tier'],
      order: { numero: 'ASC' },
    });
  }

  async findByNumero(numero: number): Promise<Piso | null> {
    return this.repo.findOne({
      where: { numero },
      relations: ['tier'],
    });
  }
}
