import { Injectable } from '@nestjs/common';
import { NotFoundServiceException } from '../common/exceptions/service.exception';
import { TipoEnemigoRepository } from './repositories/tipo-enemigo.repository';
import { TablaEncuentroRepository } from './repositories/tabla-encuentro.repository';
import { EncuentroEnemigoRepository } from './repositories/encuentro-enemigo.repository';
import { TipoEnemigo } from './entities/tipo-enemigo.entity';
import { TablaEncuentro } from './entities/tabla-encuentro.entity';
import { EncuentroEnemigo } from './entities/encuentro-enemigo.entity';

@Injectable()
export class EncuentrosService {
  constructor(
    private readonly tipoEnemigoRepo: TipoEnemigoRepository,
    private readonly tablaEncuentroRepo: TablaEncuentroRepository,
    private readonly encuentroEnemigoRepo: EncuentroEnemigoRepository,
  ) {}

  // --- Tipos Enemigo ---

  async getTiposEnemigo(): Promise<TipoEnemigo[]> {
    return this.tipoEnemigoRepo.findAll();
  }

  async getTipoEnemigo(id: number): Promise<TipoEnemigo> {
    const tipo = await this.tipoEnemigoRepo.findById(id);
    if (!tipo) {
      throw new NotFoundServiceException(
        `Tipo de enemigo con ID ${id} no encontrado`,
      );
    }
    return tipo;
  }

  async getTiposEnemigoPorPiso(pisoNumero: number): Promise<TipoEnemigo[]> {
    return this.tipoEnemigoRepo.findByPiso(pisoNumero);
  }

  async createTipoEnemigo(data: Partial<TipoEnemigo>): Promise<TipoEnemigo> {
    return this.tipoEnemigoRepo.create(data);
  }

  async updateTipoEnemigo(
    id: number,
    data: Partial<TipoEnemigo>,
  ): Promise<TipoEnemigo> {
    await this.getTipoEnemigo(id);
    const updated = await this.tipoEnemigoRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(
        `Tipo de enemigo con ID ${id} no encontrado`,
      );
    }
    return updated;
  }

  async deleteTipoEnemigo(id: number): Promise<void> {
    await this.getTipoEnemigo(id);
    await this.tipoEnemigoRepo.delete(id);
  }

  // --- Tabla Encuentros ---

  async getTablaEncuentros(): Promise<TablaEncuentro[]> {
    return this.tablaEncuentroRepo.findAll();
  }

  async getTablaEncuentro(id: number): Promise<TablaEncuentro> {
    const te = await this.tablaEncuentroRepo.findById(id);
    if (!te) {
      throw new NotFoundServiceException(
        `Tabla encuentro con ID ${id} no encontrada`,
      );
    }
    return te;
  }

  async getEncuentroPorTirada(
    pisoNumero: number,
    tipoHabitacionId: number,
    tirada: number,
  ): Promise<TablaEncuentro> {
    const te = await this.tablaEncuentroRepo.findByTirada(
      pisoNumero,
      tipoHabitacionId,
      tirada,
    );
    if (!te) {
      throw new NotFoundServiceException(
        `Encuentro no encontrado para piso ${pisoNumero}, habitación ${tipoHabitacionId}, tirada ${tirada}`,
      );
    }
    return te;
  }

  async createTablaEncuentro(
    data: Partial<TablaEncuentro>,
  ): Promise<TablaEncuentro> {
    return this.tablaEncuentroRepo.create(data);
  }

  async updateTablaEncuentro(
    id: number,
    data: Partial<TablaEncuentro>,
  ): Promise<TablaEncuentro> {
    await this.getTablaEncuentro(id);
    const updated = await this.tablaEncuentroRepo.update(id, data);
    if (!updated) {
      throw new NotFoundServiceException(
        `Tabla encuentro con ID ${id} no encontrada`,
      );
    }
    return updated;
  }

  async deleteTablaEncuentro(id: number): Promise<void> {
    await this.getTablaEncuentro(id);
    await this.tablaEncuentroRepo.delete(id);
  }

  // --- Encuentro Enemigos ---

  async addEncuentroEnemigo(
    data: Partial<EncuentroEnemigo>,
  ): Promise<EncuentroEnemigo> {
    return this.encuentroEnemigoRepo.create(data);
  }

  async getEncuentroEnemigos(
    tablaEncuentroId: number,
  ): Promise<EncuentroEnemigo[]> {
    return this.encuentroEnemigoRepo.findByTablaEncuentroId(tablaEncuentroId);
  }

  async deleteEncuentroEnemigo(id: number): Promise<void> {
    await this.encuentroEnemigoRepo.delete(id);
  }
}
