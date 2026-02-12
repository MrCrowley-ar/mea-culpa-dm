import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from '../entities/tier.entity';

@Injectable()
export class TierRepository {
  constructor(
    @InjectRepository(Tier)
    private readonly repo: Repository<Tier>,
  ) {}

  async findAll(): Promise<Tier[]> {
    return this.repo.find({
      relations: ['pisos'],
      order: { numero: 'ASC' },
    });
  }

  async findById(id: number): Promise<Tier | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByNumero(numero: number): Promise<Tier | null> {
    return this.repo.findOne({ where: { numero } });
  }
}
