import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expedicion } from './entities/expedicion.entity';
import { Participacion } from './entities/participacion.entity';
import { RolUsuario } from '../common/enums';

@Injectable()
export class ExpedicionesService {
  constructor(
    @InjectRepository(Expedicion)
    private readonly expedicionRepo: Repository<Expedicion>,
    @InjectRepository(Participacion)
    private readonly participacionRepo: Repository<Participacion>,
  ) {}

  async create(
    organizadorId: string,
    rol: RolUsuario,
  ): Promise<Expedicion> {
    if (rol !== RolUsuario.DM && rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException(
        'Solo DMs y admins pueden crear expediciones',
      );
    }
    const expedicion = this.expedicionRepo.create({
      organizador_id: organizadorId,
    });
    return this.expedicionRepo.save(expedicion);
  }

  async findAll(): Promise<Expedicion[]> {
    return this.expedicionRepo.find({
      relations: ['organizador', 'participaciones'],
    });
  }

  async findOne(id: number): Promise<Expedicion | null> {
    return this.expedicionRepo.findOne({
      where: { id },
      relations: ['organizador', 'participaciones', 'participaciones.usuario'],
    });
  }

  async join(
    expedicionId: number,
    usuarioId: string,
    nombrePersonaje: string,
  ): Promise<Participacion> {
    const participacion = this.participacionRepo.create({
      expedicion_id: expedicionId,
      usuario_id: usuarioId,
      nombre_personaje: nombrePersonaje,
    });
    return this.participacionRepo.save(participacion);
  }
}
