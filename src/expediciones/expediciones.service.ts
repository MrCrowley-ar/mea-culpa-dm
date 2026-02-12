import { Injectable } from '@nestjs/common';
import {
  ForbiddenServiceException,
  NotFoundServiceException,
} from '../common/exceptions/service.exception';
import { ExpedicionRepository } from './repositories/expedicion.repository';
import { ParticipacionRepository } from './repositories/participacion.repository';
import { Expedicion } from './entities/expedicion.entity';
import { Participacion } from './entities/participacion.entity';
import { RolUsuario } from '../common/enums';

@Injectable()
export class ExpedicionesService {
  constructor(
    private readonly expedicionRepo: ExpedicionRepository,
    private readonly participacionRepo: ParticipacionRepository,
  ) {}

  async create(
    organizadorId: string,
    rol: RolUsuario,
    data?: Partial<Expedicion>,
  ): Promise<Expedicion> {
    if (rol !== RolUsuario.DM && rol !== RolUsuario.ADMIN) {
      throw new ForbiddenServiceException(
        'Solo DMs y admins pueden crear expediciones',
      );
    }
    return this.expedicionRepo.create({
      ...data,
      organizador_id: organizadorId,
    });
  }

  async findAll(): Promise<Expedicion[]> {
    return this.expedicionRepo.findAll();
  }

  async findOne(id: number): Promise<Expedicion> {
    const expedicion = await this.expedicionRepo.findById(id);
    if (!expedicion) {
      throw new NotFoundServiceException(
        `Expedición con ID ${id} no encontrada`,
      );
    }
    return expedicion;
  }

  async update(id: number, data: Partial<Expedicion>): Promise<Expedicion> {
    await this.findOne(id);
    const updated = await this.expedicionRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(
        `Expedición con ID ${id} no encontrada`,
      );
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.expedicionRepo.delete(id);
  }

  async addParticipacion(data: Partial<Participacion>): Promise<Participacion> {
    await this.findOne(data.expedicion_id!);
    return this.participacionRepo.create(data);
  }

  async getParticipaciones(expedicionId: number): Promise<Participacion[]> {
    await this.findOne(expedicionId);
    return this.participacionRepo.findByExpedicionId(expedicionId);
  }

  async removeParticipacion(id: number): Promise<void> {
    const p = await this.participacionRepo.findById(id);
    if (!p) {
      throw new NotFoundServiceException(
        `Participación con ID ${id} no encontrada`,
      );
    }
    await this.participacionRepo.delete(id);
  }

  async updateOro(participacionId: number, oro: number): Promise<void> {
    const p = await this.participacionRepo.findById(participacionId);
    if (!p) {
      throw new NotFoundServiceException(
        `Participación con ID ${participacionId} no encontrada`,
      );
    }
    await this.participacionRepo.updateOro(participacionId, oro);
  }

  async getParticipacionesActivas(expedicionId: number): Promise<Participacion[]> {
    await this.findOne(expedicionId);
    return this.participacionRepo.findActivasByExpedicionId(expedicionId);
  }

  async desactivarParticipacion(participacionId: number, salaSalida: number): Promise<void> {
    const p = await this.participacionRepo.findById(participacionId);
    if (!p) {
      throw new NotFoundServiceException(
        `Participación con ID ${participacionId} no encontrada`,
      );
    }
    await this.participacionRepo.updateActivo(participacionId, false, salaSalida);
  }

  async reactivarParticipacion(participacionId: number): Promise<void> {
    const p = await this.participacionRepo.findById(participacionId);
    if (!p) {
      throw new NotFoundServiceException(
        `Participación con ID ${participacionId} no encontrada`,
      );
    }
    await this.participacionRepo.updateActivo(participacionId, true, null);
  }
}
