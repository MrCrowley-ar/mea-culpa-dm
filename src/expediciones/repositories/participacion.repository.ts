import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participacion } from '../entities/participacion.entity';

@Injectable()
export class ParticipacionRepository {
  constructor(
    @InjectRepository(Participacion)
    private readonly repo: Repository<Participacion>,
  ) {}

  async create(data: Partial<Participacion>): Promise<Participacion> {
    const participacion = this.repo.create(data);
    return this.repo.save(participacion);
  }

  async findByExpedicionId(expedicionId: number): Promise<Participacion[]> {
    return this.repo.find({
      where: { expedicion_id: expedicionId },
      relations: ['usuario'],
    });
  }

  async findById(id: number): Promise<Participacion | null> {
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async updateOro(id: number, oro: number): Promise<void> {
    await this.repo.update(id, { oro_acumulado: oro });
  }
}
