import { Injectable } from '@nestjs/common';
import {
  NotFoundServiceException,
  ValidationServiceException,
} from '../common/exceptions/service.exception';
import { TipoResultadoRecompensa } from '../common/enums';
import { ConfiguracionService } from '../configuracion/configuracion.service';
import { EncuentrosService } from '../encuentros/encuentros.service';
import { RecompensasService } from '../recompensas/recompensas.service';
import { HistorialService } from '../historial/historial.service';
import { ExpedicionesService } from '../expediciones/expediciones.service';
import {
  EncuentroResueltoDto,
} from './dto/response/encuentro-resuelto.dto';
import { RecompensaResueltaDto } from './dto/response/recompensa-resuelta.dto';
import {
  ResumenExpedicionDto,
  ParticipanteResumenDto,
  ItemResumenDto,
} from './dto/response/resumen-expedicion.dto';
import {
  LiquidacionResultadoDto,
  ParticipanteLiquidadoDto,
} from './dto/response/liquidacion-resultado.dto';

@Injectable()
export class GameplayService {
  constructor(
    private readonly configuracionService: ConfiguracionService,
    private readonly encuentrosService: EncuentrosService,
    private readonly recompensasService: RecompensasService,
    private readonly historialService: HistorialService,
    private readonly expedicionesService: ExpedicionesService,
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

  // =========================================================================
  // REPARTO DE ORO
  // =========================================================================

  /**
   * Reparte oro bruto entre N participantes de una habitación.
   * El DM tira los dados de oro, informa el total, y elige entre cuántos se reparte.
   * El sobrante (si no es divisible) se reparte 1 extra a los primeros.
   */
  async repartirOro(
    historialHabitacionId: number,
    oroTotal: number,
    participacionIds: number[],
  ): Promise<{ repartos: { participacion_id: number; oro: number }[] }> {
    await this.historialService.getHistorialHabitacion(historialHabitacionId);

    if (participacionIds.length === 0) {
      throw new ValidationServiceException('Debe indicar al menos un participante');
    }

    const oroPorJugador = Math.floor(oroTotal / participacionIds.length);
    const sobrante = oroTotal % participacionIds.length;
    const repartos: { participacion_id: number; oro: number }[] = [];

    for (let i = 0; i < participacionIds.length; i++) {
      const oroAsignado = oroPorJugador + (i < sobrante ? 1 : 0);
      await this.historialService.registrarRecompensa({
        historial_habitacion_id: historialHabitacionId,
        participacion_id: participacionIds[i],
        tirada_original: 0,
        oro_obtenido: oroAsignado,
        vendido: false,
      });
      repartos.push({ participacion_id: participacionIds[i], oro: oroAsignado });
    }

    return { repartos };
  }

  // =========================================================================
  // RESUMEN DE EXPEDICIÓN
  // =========================================================================

  /**
   * Genera un resumen completo de la expedición agrupado por participante:
   * - Items obtenidos (con datos de venta si aplica)
   * - Oro bruto total
   * - Oro por ventas
   * - Oro total
   */
  async getResumenExpedicion(expedicionId: number): Promise<ResumenExpedicionDto> {
    const expedicion = await this.expedicionesService.findOne(expedicionId);
    const participaciones = await this.expedicionesService.getParticipaciones(expedicionId);
    const habitaciones = await this.historialService.getHistorialExpedicion(expedicionId);

    // Agrupar recompensas por participacion_id
    const recompensasPorParticipante = new Map<number, ItemResumenDto[]>();

    for (const participacion of participaciones) {
      recompensasPorParticipante.set(participacion.id, []);
    }

    for (const habitacion of habitaciones) {
      const recompensas = habitacion.recompensas || [];
      for (const r of recompensas) {
        const items = recompensasPorParticipante.get(r.participacion_id);
        if (items) {
          items.push({
            recompensa_id: r.id,
            habitacion_orden: habitacion.orden,
            tirada_original: r.tirada_original,
            tirada_subtabla: r.tirada_subtabla ?? null,
            item_id: r.item_id ?? null,
            item_nombre: r.item?.nombre ?? null,
            modificador_tier: r.modificador_tier ?? null,
            oro_obtenido: r.oro_obtenido ?? 0,
            vendido: r.vendido ?? false,
            precio_venta: r.precio_venta ?? null,
          });
        }
      }
    }

    let oroTotalExpedicion = 0;
    const participantesResumen: ParticipanteResumenDto[] = participaciones.map((p) => {
      const items = recompensasPorParticipante.get(p.id) || [];
      const totalOroBruto = items.reduce((sum, i) => sum + i.oro_obtenido, 0);
      const totalOroVentas = items
        .filter((i) => i.vendido && i.precio_venta)
        .reduce((sum, i) => sum + (i.precio_venta ?? 0), 0);
      const totalOro = totalOroBruto + totalOroVentas;
      oroTotalExpedicion += totalOro;

      return {
        participacion_id: p.id,
        nombre_personaje: p.nombre_personaje,
        usuario_id: p.usuario_id,
        items,
        total_oro_bruto: totalOroBruto,
        total_oro_ventas: totalOroVentas,
        total_oro: totalOro,
        oro_acumulado_actual: p.oro_acumulado,
      };
    });

    return {
      expedicion_id: expedicionId,
      estado: expedicion.estado,
      piso_actual: expedicion.piso_actual,
      total_habitaciones: habitaciones.length,
      participantes: participantesResumen,
      oro_total_expedicion: oroTotalExpedicion,
    };
  }

  // =========================================================================
  // LIQUIDAR RECOMPENSAS
  // =========================================================================

  /**
   * Aplica las decisiones de venta del DM y calcula el oro final por participante.
   * 1. Actualiza cada recompensa con vendido/precio_venta
   * 2. Recalcula oro total por participante
   * 3. Actualiza participacion.oro_acumulado
   */
  async liquidarRecompensas(
    expedicionId: number,
    decisiones: { recompensa_id: number; vendido: boolean; precio_venta?: number }[],
  ): Promise<LiquidacionResultadoDto> {
    await this.expedicionesService.findOne(expedicionId);

    // 1. Aplicar decisiones de venta
    for (const d of decisiones) {
      await this.historialService.updateHistorialRecompensa(d.recompensa_id, {
        vendido: d.vendido,
        precio_venta: d.vendido ? (d.precio_venta ?? 0) : 0,
      } as any);
    }

    // 2. Obtener resumen actualizado
    const resumen = await this.getResumenExpedicion(expedicionId);

    // 3. Actualizar oro_acumulado de cada participante
    const participantes: ParticipanteLiquidadoDto[] = [];
    let oroTotalExpedicion = 0;

    for (const p of resumen.participantes) {
      await this.expedicionesService.updateOro(p.participacion_id, p.total_oro);
      participantes.push({
        participacion_id: p.participacion_id,
        nombre_personaje: p.nombre_personaje,
        oro_bruto: p.total_oro_bruto,
        oro_ventas: p.total_oro_ventas,
        oro_total: p.total_oro,
      });
      oroTotalExpedicion += p.total_oro;
    }

    return {
      expedicion_id: expedicionId,
      decisiones_aplicadas: decisiones.length,
      participantes,
      oro_total_expedicion: oroTotalExpedicion,
    };
  }
}
