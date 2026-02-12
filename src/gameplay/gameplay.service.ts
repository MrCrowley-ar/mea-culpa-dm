import { Injectable } from '@nestjs/common';
import { NotFoundServiceException } from '../common/exceptions/service.exception';
import { TipoResultadoRecompensa } from '../common/enums';
import { ConfiguracionService } from '../configuracion/configuracion.service';
import { EncuentrosService } from '../encuentros/encuentros.service';
import { RecompensasService } from '../recompensas/recompensas.service';
import {
  EncuentroResueltoDto,
} from './dto/response/encuentro-resuelto.dto';
import { RecompensaResueltaDto } from './dto/response/recompensa-resuelta.dto';

@Injectable()
export class GameplayService {
  constructor(
    private readonly configuracionService: ConfiguracionService,
    private readonly encuentrosService: EncuentrosService,
    private readonly recompensasService: RecompensasService,
  ) {}

  /**
   * Resuelve un encuentro: dado piso + tipo_habitacion + tirada (1d20),
   * retorna la cantidad total de enemigos y el desglose por tipo.
   */
  async resolverEncuentro(
    piso: number,
    tipoHabitacionId: number,
    tirada: number,
  ): Promise<EncuentroResueltoDto> {
    // Validar que el piso existe
    await this.configuracionService.getPiso(piso);

    const tablaEncuentro = await this.encuentrosService.getEncuentroPorTirada(
      piso,
      tipoHabitacionId,
      tirada,
    );

    return EncuentroResueltoDto.fromTablaEncuentro(tablaEncuentro, tirada);
  }

  /**
   * Resuelve una recompensa con la cadena completa:
   * 1. Suma bonus_recompensa del piso a la tirada
   * 2. Busca en tabla_recompensas
   * 3. Si tipo_resultado es 'subtabla' y hay tirada_subtabla, resuelve la subtabla
   * 4. Aplica modificador de tier para armas/armaduras
   */
  async resolverRecompensa(
    piso: number,
    tipoHabitacionId: number,
    tiradaD20: number,
    tiradaSubtabla?: number,
  ): Promise<RecompensaResueltaDto> {
    // 1. Obtener bonus del piso
    const bonusRecompensa = await this.configuracionService.getBonusRecompensa(piso);
    const tiradaConBonus = tiradaD20 + bonusRecompensa;

    // 2. Buscar en tabla de recompensas
    const recompensa = await this.recompensasService.getRecompensaPorTirada(
      piso,
      tipoHabitacionId,
      tiradaConBonus,
    );

    if (!recompensa) {
      throw new NotFoundServiceException(
        `No se encontró recompensa para piso ${piso}, habitación ${tipoHabitacionId}, tirada ${tiradaConBonus} (original: ${tiradaD20} + bonus: ${bonusRecompensa})`,
      );
    }

    const baseParams = {
      piso,
      tipo_habitacion_id: tipoHabitacionId,
      tirada_original: tiradaD20,
      bonus_recompensa: bonusRecompensa,
      tirada_con_bonus: tiradaConBonus,
    };

    // 3. Según el tipo de resultado
    if (recompensa.tipo_resultado === TipoResultadoRecompensa.NADA) {
      return RecompensaResueltaDto.nada({
        ...baseParams,
        descripcion: recompensa.descripcion,
      });
    }

    if (recompensa.tipo_resultado === TipoResultadoRecompensa.ORO) {
      return RecompensaResueltaDto.oro({
        ...baseParams,
        dados_oro: recompensa.dados_oro,
        descripcion: recompensa.descripcion,
      });
    }

    // tipo_resultado === 'subtabla'
    const subtablaNombre = recompensa.subtabla_nombre;
    if (!subtablaNombre) {
      throw new NotFoundServiceException(
        `La recompensa indica subtabla pero no tiene subtabla_nombre definido`,
      );
    }

    // Si no hay tirada de subtabla, indicar que se requiere
    if (tiradaSubtabla === undefined || tiradaSubtabla === null) {
      return RecompensaResueltaDto.subtablaPendiente({
        ...baseParams,
        subtabla_nombre: subtablaNombre,
        descripcion: recompensa.descripcion,
      });
    }

    // 4. Resolver la subtabla
    return this.resolverSubtabla(
      subtablaNombre,
      piso,
      tipoHabitacionId,
      tiradaSubtabla,
      baseParams,
      recompensa.descripcion,
    );
  }

  private async resolverSubtabla(
    subtablaNombre: string,
    piso: number,
    tipoHabitacionId: number,
    tiradaSubtabla: number,
    baseParams: {
      piso: number;
      tipo_habitacion_id: number;
      tirada_original: number;
      bonus_recompensa: number;
      tirada_con_bonus: number;
    },
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const nombre = subtablaNombre.toLowerCase().trim();

    switch (nombre) {
      case 'armas':
        return this.resolverSubtablaArma(tiradaSubtabla, piso, baseParams, descripcion);
      case 'armaduras':
        return this.resolverSubtablaArmadura(tiradaSubtabla, piso, baseParams, descripcion);
      case 'objetos_curiosos':
        return this.resolverSubtablaObjetosCuriosos(
          tiradaSubtabla, piso, tipoHabitacionId, baseParams, descripcion,
        );
      case 'items_boss':
        return this.resolverSubtablaItemsBoss(tiradaSubtabla, piso, baseParams, descripcion);
      case 'pociones':
        return this.resolverSubtablaPociones(tiradaSubtabla, piso, baseParams, descripcion);
      case 'tesoro_menor':
        return this.resolverSubtablaTesoroMenor(tiradaSubtabla, piso, baseParams, descripcion);
      case 'critico':
        return this.resolverSubtablaCritico(tiradaSubtabla, piso, baseParams, descripcion);
      default:
        throw new NotFoundServiceException(
          `Subtabla desconocida: "${subtablaNombre}"`,
        );
    }
  }

  private async resolverSubtablaArma(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const entrada = await this.recompensasService.getArmaByTirada(tirada);
    if (!entrada) {
      throw new NotFoundServiceException(`No se encontró arma para tirada ${tirada}`);
    }
    const modArmas = await this.configuracionService.getModArmas(piso);
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'armas',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      modificador_tier: modArmas,
      descripcion,
    });
  }

  private async resolverSubtablaArmadura(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const entrada = await this.recompensasService.getArmaduraByTirada(tirada);
    if (!entrada) {
      throw new NotFoundServiceException(`No se encontró armadura para tirada ${tirada}`);
    }
    const modArmaduras = await this.configuracionService.getModArmaduras(piso);
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'armaduras',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      modificador_tier: modArmaduras,
      descripcion,
    });
  }

  private async resolverSubtablaObjetosCuriosos(
    tirada: number,
    piso: number,
    tipoHabitacionId: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const entrada = await this.recompensasService.getObjetoCuriosoByTirada(
      piso, tipoHabitacionId, tirada,
    );
    if (!entrada) {
      throw new NotFoundServiceException(
        `No se encontró objeto curioso para piso ${piso}, habitación ${tipoHabitacionId}, tirada ${tirada}`,
      );
    }
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'objetos_curiosos',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      descripcion,
    });
  }

  private async resolverSubtablaItemsBoss(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const entrada = await this.recompensasService.getItemBossByTirada(piso, tirada);
    if (!entrada) {
      throw new NotFoundServiceException(
        `No se encontró item de boss para piso ${piso}, tirada ${tirada}`,
      );
    }
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'items_boss',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      descripcion,
    });
  }

  private async resolverSubtablaPociones(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    // Intentar primero con piso específico, luego sin piso
    let entrada = await this.recompensasService.getPocionByTirada(tirada, piso);
    if (!entrada) {
      entrada = await this.recompensasService.getPocionByTirada(tirada);
    }
    if (!entrada) {
      throw new NotFoundServiceException(`No se encontró poción para tirada ${tirada}`);
    }
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'pociones',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      descripcion,
    });
  }

  private async resolverSubtablaTesoroMenor(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    let entrada = await this.recompensasService.getTesoroMenorByTirada(tirada, piso);
    if (!entrada) {
      entrada = await this.recompensasService.getTesoroMenorByTirada(tirada);
    }
    if (!entrada) {
      throw new NotFoundServiceException(`No se encontró tesoro menor para tirada ${tirada}`);
    }
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'tesoro_menor',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      efecto_especial: entrada.efecto_especial,
      descripcion,
    });
  }

  private async resolverSubtablaCritico(
    tirada: number,
    piso: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    let entrada = await this.recompensasService.getCriticoByTirada(tirada, piso);
    if (!entrada) {
      entrada = await this.recompensasService.getCriticoByTirada(tirada);
    }
    if (!entrada) {
      throw new NotFoundServiceException(`No se encontró crítico para tirada ${tirada}`);
    }
    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'critico',
      tirada_subtabla: tirada,
      item_nombre: entrada.item?.nombre,
      item_id: entrada.item_id,
      descripcion,
    });
  }
}
