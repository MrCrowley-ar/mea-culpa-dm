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
import { EncuentroResueltoDto } from './dto/response/encuentro-resuelto.dto';
import { RecompensaResueltaDto } from './dto/response/recompensa-resuelta.dto';
import { ResumenExpedicionDto } from './dto/response/resumen-expedicion.dto';
import { LiquidacionResultadoDto } from './dto/response/liquidacion-resultado.dto';

@Controller('gameplay')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

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
