import { Injectable } from '@nestjs/common';
import {
  ConflictServiceException,
  NotFoundServiceException,
  ValidationServiceException,
} from '../common/exceptions/service.exception';
import { EstadoExpedicion, TipoResultadoRecompensa } from '../common/enums';
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
  LayoutPisoResponseDto,
} from './dto/response/layout-piso-response.dto';
import {
  ResultadoRecompensasHabitacionDto,
  ItemPendienteDto,
} from './dto/response/resultado-recompensas-habitacion.dto';
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

    // 'especial' se resuelve al azar sin tirada de subtabla
    if (subtablaNombre.toLowerCase().trim() === 'especial') {
      return this.resolverEspecial(recompensa.id, baseParams, recompensa.descripcion);
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
      case 'botin_alternativo':
        return this.resolverSubtablaObjetosCuriosos(
          tiradaSubtabla, piso, tipoHabitacionId, baseParams, descripcion,
        );
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

  private async resolverEspecial(
    tablaRecompensaId: number,
    baseParams: any,
    descripcion?: string,
  ): Promise<RecompensaResueltaDto> {
    const opciones = await this.recompensasService.getOpcionesByRecompensaId(tablaRecompensaId);

    if (opciones.length === 0) {
      throw new NotFoundServiceException(
        `No se encontraron opciones especiales para tabla_recompensa_id ${tablaRecompensaId}`,
      );
    }

    // Elegir una opción al azar
    const indice = Math.floor(Math.random() * opciones.length);
    const elegida = opciones[indice];

    return RecompensaResueltaDto.subtablaResuelta({
      ...baseParams,
      subtabla_nombre: 'especial',
      tirada_subtabla: 0,
      item_nombre: elegida.item?.nombre,
      item_id: elegida.item_id,
      descripcion,
    });
  }

  // =========================================================================
  // FLUJO INTEGRADO POR SALA
  // =========================================================================

  /**
   * Genera el layout de salas para un piso de una expedición.
   * Crea: N comunes + (bonus opcional) + (evento opcional) + 1 jefe (siempre).
   * Actualiza piso_actual de la expedición.
   */
  async generarLayoutPiso(
    expedicionId: number,
    piso: number,
    incluirBonus: boolean = false,
    incluirEvento: boolean = false,
  ): Promise<LayoutPisoResponseDto> {
    const expedicion = await this.expedicionesService.findOne(expedicionId);

    if (expedicion.estado !== EstadoExpedicion.EN_CURSO) {
      throw new ValidationServiceException(
        'La expedición debe estar en_curso para generar un layout de piso',
      );
    }

    const pisoConfig = await this.configuracionService.getPiso(piso);

    // Verificar que no haya salas ya generadas para este piso
    const salasExistentes = await this.historialService.getHabitacionesByExpedicionAndPiso(
      expedicionId,
      piso,
    );
    if (salasExistentes.length > 0) {
      throw new ConflictServiceException(
        `Ya existen ${salasExistentes.length} salas generadas para el piso ${piso} de esta expedición`,
      );
    }

    // Obtener tipos de habitación por nombre
    const tipoComun = await this.configuracionService.getTipoHabitacionByNombre('comun');
    const tipoBonus = await this.configuracionService.getTipoHabitacionByNombre('bonus');
    const tipoJefe = await this.configuracionService.getTipoHabitacionByNombre('jefe');
    const tipoEvento = await this.configuracionService.getTipoHabitacionByNombre('evento');

    // Calcular orden base (por si hay salas de pisos anteriores)
    const maxOrden = await this.historialService.getMaxOrden(expedicionId);
    let ordenActual = maxOrden + 1;

    const habitacionesData: any[] = [];

    // N salas comunes
    for (let i = 0; i < pisoConfig.num_habitaciones_comunes; i++) {
      habitacionesData.push({
        expedicion_id: expedicionId,
        piso_numero: piso,
        tipo_habitacion_id: tipoComun.id,
        orden: ordenActual++,
      });
    }

    // Sala bonus (opcional)
    if (incluirBonus) {
      habitacionesData.push({
        expedicion_id: expedicionId,
        piso_numero: piso,
        tipo_habitacion_id: tipoBonus.id,
        orden: ordenActual++,
      });
    }

    // Sala evento (opcional)
    if (incluirEvento) {
      habitacionesData.push({
        expedicion_id: expedicionId,
        piso_numero: piso,
        tipo_habitacion_id: tipoEvento.id,
        orden: ordenActual++,
      });
    }

    // Sala jefe (siempre)
    habitacionesData.push({
      expedicion_id: expedicionId,
      piso_numero: piso,
      tipo_habitacion_id: tipoJefe.id,
      orden: ordenActual++,
    });

    // Crear todas las salas
    const habitaciones = await this.historialService.registrarHabitacionesBatch(habitacionesData);

    // Actualizar piso_actual
    await this.expedicionesService.update(expedicionId, { piso_actual: piso } as any);

    // Recargar con relaciones para la respuesta
    const habitacionesConRelaciones = await this.historialService.getHabitacionesByExpedicionAndPiso(
      expedicionId,
      piso,
    );

    return LayoutPisoResponseDto.fromEntities(expedicionId, piso, habitacionesConRelaciones);
  }

  /**
   * Resuelve el encuentro de una sala específica del historial.
   * Lee piso/tipo de la habitación y delega al resolverEncuentro existente.
   * Persiste la tirada en el registro de habitación.
   */
  async resolverEncuentroHabitacion(
    historialHabitacionId: number,
    tirada: number,
  ): Promise<EncuentroResueltoDto> {
    const habitacion = await this.historialService.getHistorialHabitacion(historialHabitacionId);

    if (habitacion.completada) {
      throw new ValidationServiceException('Esta habitación ya fue completada');
    }

    const resultado = await this.resolverEncuentro(
      habitacion.piso_numero,
      habitacion.tipo_habitacion_id,
      tirada,
    );

    // Persistir tirada y cantidad de enemigos
    await this.historialService.updateHistorialHabitacion(historialHabitacionId, {
      tirada_encuentro: tirada,
      enemigos_derrotados: resultado.cantidad_total,
    } as any);

    return resultado;
  }

  /**
   * Procesa N recompensas (1 por enemigo) de una habitación.
   * Es un preview: NO persiste items ni oro.
   * Retorna los resultados separados en items_pendientes (para asignar) y oro_dados.
   */
  async procesarRecompensasHabitacion(
    historialHabitacionId: number,
    tiradas: { tirada_d20: number; tirada_subtabla?: number }[],
  ): Promise<ResultadoRecompensasHabitacionDto> {
    const habitacion = await this.historialService.getHistorialHabitacion(historialHabitacionId);

    if (habitacion.completada) {
      throw new ValidationServiceException('Esta habitación ya fue completada');
    }

    const resultados: RecompensaResueltaDto[] = [];
    const itemsPendientes: ItemPendienteDto[] = [];
    const oroDados: string[] = [];

    for (let i = 0; i < tiradas.length; i++) {
      const t = tiradas[i];
      const resultado = await this.resolverRecompensa(
        habitacion.piso_numero,
        habitacion.tipo_habitacion_id,
        t.tirada_d20,
        t.tirada_subtabla,
      );
      resultados.push(resultado);

      if (resultado.tipo_resultado === 'subtabla' && !resultado.requiere_subtabla && (resultado.item_id || resultado.subtabla_nombre === 'especial')) {
        itemsPendientes.push({
          indice: i,
          tirada_d20: t.tirada_d20,
          tirada_subtabla: resultado.tirada_subtabla ?? null,
          subtabla_nombre: resultado.subtabla_nombre!,
          item_id: resultado.item_id ?? null,
          item_nombre: resultado.item_nombre ?? null,
          modificador_tier: resultado.modificador_tier ?? null,
        });
      } else if (resultado.tipo_resultado === 'oro' && resultado.dados_oro) {
        oroDados.push(resultado.dados_oro);
      }
    }

    return {
      historial_habitacion_id: historialHabitacionId,
      piso: habitacion.piso_numero,
      tipo_habitacion_id: habitacion.tipo_habitacion_id,
      resultados,
      items_pendientes: itemsPendientes,
      oro_dados: oroDados,
    };
  }

  /**
   * Asigna un item a un participante específico de una habitación.
   * Crea un historial_recompensa vinculando el item al participante.
   */
  async asignarItemParticipante(
    historialHabitacionId: number,
    participacionId: number,
    tiradaOriginal: number,
    tiradaSubtabla: number | undefined,
    itemId: number,
    modificadorTier?: number,
  ): Promise<{ id: number; historial_habitacion_id: number; participacion_id: number; item_id: number }> {
    await this.historialService.getHistorialHabitacion(historialHabitacionId);

    const recompensa = await this.historialService.registrarRecompensa({
      historial_habitacion_id: historialHabitacionId,
      participacion_id: participacionId,
      tirada_original: tiradaOriginal,
      tirada_subtabla: tiradaSubtabla || undefined,
      item_id: itemId,
      modificador_tier: modificadorTier ?? 0,
      oro_obtenido: 0,
      vendido: false,
    });

    return {
      id: recompensa.id,
      historial_habitacion_id: historialHabitacionId,
      participacion_id: participacionId,
      item_id: itemId,
    };
  }

  /**
   * Reparte oro entre los participantes ACTIVOS de la expedición de una habitación.
   * Obtiene automáticamente los activos y distribuye equitativamente.
   */
  async repartirOroHabitacion(
    historialHabitacionId: number,
    oroTotal: number,
  ): Promise<{ repartos: { participacion_id: number; nombre_personaje: string; oro: number }[] }> {  // nombre_personaje from personaje relation
    const habitacion = await this.historialService.getHistorialHabitacion(historialHabitacionId);

    if (habitacion.completada) {
      throw new ValidationServiceException('Esta habitación ya fue completada');
    }

    const participacionesActivas = await this.expedicionesService.getParticipacionesActivas(
      habitacion.expedicion_id,
    );

    if (participacionesActivas.length === 0) {
      throw new ValidationServiceException('No hay participantes activos en la expedición');
    }

    const participacionIds = participacionesActivas.map((p) => p.id);
    const resultado = await this.repartirOro(historialHabitacionId, oroTotal, participacionIds);

    return {
      repartos: resultado.repartos.map((r) => {
        const p = participacionesActivas.find((p) => p.id === r.participacion_id);
        return {
          participacion_id: r.participacion_id,
          nombre_personaje: p?.personaje?.nombre ?? '',
          oro: r.oro,
        };
      }),
    };
  }

  /**
   * Marca una habitación como completada.
   */
  async completarHabitacion(
    historialHabitacionId: number,
  ): Promise<{ id: number; completada: boolean }> {
    await this.historialService.updateHistorialHabitacion(historialHabitacionId, {
      completada: true,
    } as any);

    return { id: historialHabitacionId, completada: true };
  }

  /**
   * Retorna los participantes activos de una expedición.
   */
  async getParticipantesActivos(expedicionId: number) {
    return this.expedicionesService.getParticipacionesActivas(expedicionId);
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
        nombre_personaje: p.personaje?.nombre ?? '',
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
