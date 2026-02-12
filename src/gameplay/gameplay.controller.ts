import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { GameplayService } from './gameplay.service';
import { ResolverEncuentroDto } from './dto/request/resolver-encuentro.dto';
import { ResolverRecompensaDto } from './dto/request/resolver-recompensa.dto';
import { RepartirOroDto } from './dto/request/repartir-oro.dto';
import { LiquidarRecompensasDto } from './dto/request/liquidar-recompensas.dto';
import { GenerarLayoutPisoDto } from './dto/request/generar-layout-piso.dto';
import { ResolverEncuentroHabitacionDto } from './dto/request/resolver-encuentro-habitacion.dto';
import { ProcesarRecompensasHabitacionDto } from './dto/request/procesar-recompensas-habitacion.dto';
import { AsignarItemDto } from './dto/request/asignar-item.dto';
import { RepartirOroHabitacionDto } from './dto/request/repartir-oro-habitacion.dto';
import { EncuentroResueltoDto } from './dto/response/encuentro-resuelto.dto';
import { RecompensaResueltaDto } from './dto/response/recompensa-resuelta.dto';
import { LayoutPisoResponseDto } from './dto/response/layout-piso-response.dto';
import { ResultadoRecompensasHabitacionDto } from './dto/response/resultado-recompensas-habitacion.dto';
import { ResumenExpedicionDto } from './dto/response/resumen-expedicion.dto';
import { LiquidacionResultadoDto } from './dto/response/liquidacion-resultado.dto';
import { ParticipacionResponseDto } from '../expediciones/dto/response/participacion-response.dto';

@Controller('gameplay')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

  // =========================================================================
  // FLUJO INTEGRADO POR SALA
  // =========================================================================

  @Post('generar-layout-piso')
  async generarLayoutPiso(
    @Body() dto: GenerarLayoutPisoDto,
  ): Promise<LayoutPisoResponseDto> {
    return this.gameplayService.generarLayoutPiso(
      dto.expedicion_id,
      dto.piso,
      dto.incluir_bonus ?? false,
      dto.incluir_evento ?? false,
    );
  }

  @Post('resolver-encuentro-habitacion')
  async resolverEncuentroHabitacion(
    @Body() dto: ResolverEncuentroHabitacionDto,
  ): Promise<EncuentroResueltoDto> {
    return this.gameplayService.resolverEncuentroHabitacion(
      dto.historial_habitacion_id,
      dto.tirada,
    );
  }

  @Post('procesar-recompensas-habitacion')
  async procesarRecompensasHabitacion(
    @Body() dto: ProcesarRecompensasHabitacionDto,
  ): Promise<ResultadoRecompensasHabitacionDto> {
    return this.gameplayService.procesarRecompensasHabitacion(
      dto.historial_habitacion_id,
      dto.tiradas,
    );
  }

  @Post('asignar-item')
  async asignarItem(
    @Body() dto: AsignarItemDto,
  ): Promise<{ id: number; historial_habitacion_id: number; participacion_id: number; item_id: number }> {
    return this.gameplayService.asignarItemParticipante(
      dto.historial_habitacion_id,
      dto.participacion_id,
      dto.tirada_original,
      dto.tirada_subtabla,
      dto.item_id,
      dto.modificador_tier,
    );
  }

  @Post('repartir-oro-habitacion')
  async repartirOroHabitacion(
    @Body() dto: RepartirOroHabitacionDto,
  ): Promise<{ repartos: { participacion_id: number; nombre_personaje: string; oro: number }[] }> {
    return this.gameplayService.repartirOroHabitacion(
      dto.historial_habitacion_id,
      dto.oro_total,
    );
  }

  @Post('completar-habitacion/:id')
  async completarHabitacion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ id: number; completada: boolean }> {
    return this.gameplayService.completarHabitacion(id);
  }

  @Get('participantes-activos/:expedicionId')
  async participantesActivos(
    @Param('expedicionId', ParseIntPipe) expedicionId: number,
  ): Promise<ParticipacionResponseDto[]> {
    const participaciones = await this.gameplayService.getParticipantesActivos(expedicionId);
    return participaciones.map(ParticipacionResponseDto.fromEntity);
  }

  // =========================================================================
  // ENDPOINTS ORIGINALES
  // =========================================================================

  @Post('resolver-encuentro')
  async resolverEncuentro(
    @Body() dto: ResolverEncuentroDto,
  ): Promise<EncuentroResueltoDto> {
    return this.gameplayService.resolverEncuentro(
      dto.piso,
      dto.tipo_habitacion_id,
      dto.tirada,
    );
  }

  @Post('resolver-recompensa')
  async resolverRecompensa(
    @Body() dto: ResolverRecompensaDto,
  ): Promise<RecompensaResueltaDto> {
    return this.gameplayService.resolverRecompensa(
      dto.piso,
      dto.tipo_habitacion_id,
      dto.tirada_d20,
      dto.tirada_subtabla,
    );
  }

  @Post('repartir-oro')
  async repartirOro(
    @Body() dto: RepartirOroDto,
  ): Promise<{ repartos: { participacion_id: number; oro: number }[] }> {
    return this.gameplayService.repartirOro(
      dto.historial_habitacion_id,
      dto.oro_total,
      dto.participacion_ids,
    );
  }

  @Get('resumen-expedicion/:expedicionId')
  async resumenExpedicion(
    @Param('expedicionId', ParseIntPipe) expedicionId: number,
  ): Promise<ResumenExpedicionDto> {
    return this.gameplayService.getResumenExpedicion(expedicionId);
  }

  @Post('liquidar-recompensas')
  async liquidarRecompensas(
    @Body() dto: LiquidarRecompensasDto,
  ): Promise<LiquidacionResultadoDto> {
    return this.gameplayService.liquidarRecompensas(
      dto.expedicion_id,
      dto.decisiones,
    );
  }
}
