import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ExpedicionesService } from './expediciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { CreateExpedicionDto } from './dto/request/create-expedicion.dto';
import { UpdateExpedicionDto } from './dto/request/update-expedicion.dto';
import { CreateParticipacionDto } from './dto/request/create-participacion.dto';
import { DesactivarParticipacionDto } from './dto/request/desactivar-participacion.dto';
import { SaveEstadoSnapshotDto } from './dto/request/save-estado-snapshot.dto';
import { ExpedicionResponseDto } from './dto/response/expedicion-response.dto';
import { ParticipacionResponseDto } from './dto/response/participacion-response.dto';

@Controller('expediciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class ExpedicionesController {
  constructor(private readonly expedicionesService: ExpedicionesService) {}

  @Post()
  async create(
    @Body() dto: CreateExpedicionDto,
    @Request() req: any,
  ): Promise<ExpedicionResponseDto> {
    const expedicion = await this.expedicionesService.create(
      req.user.discord_id,
      req.user.roles,
      { fecha: dto.fecha ? new Date(dto.fecha) : undefined, notas: dto.notas },
    );
    return ExpedicionResponseDto.fromEntity(expedicion);
  }

  @Get()
  async findAll(): Promise<ExpedicionResponseDto[]> {
    const expediciones = await this.expedicionesService.findAll();
    return expediciones.map(ExpedicionResponseDto.fromEntity);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpedicionResponseDto> {
    const expedicion = await this.expedicionesService.findOne(id);
    return ExpedicionResponseDto.fromEntity(expedicion);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpedicionDto,
  ): Promise<ExpedicionResponseDto> {
    const expedicion = await this.expedicionesService.update(id, dto as any);
    return ExpedicionResponseDto.fromEntity(expedicion);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.expedicionesService.delete(id);
  }

  // --- Estado Snapshot ---

  @Put(':id/snapshot')
  async saveSnapshot(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveEstadoSnapshotDto,
  ): Promise<{ expedicion_id: number; updated_at: Date }> {
    const expedicion = await this.expedicionesService.saveSnapshot(
      id,
      dto.estado_snapshot,
    );
    return { expedicion_id: expedicion.id, updated_at: expedicion.updated_at };
  }

  @Get(':id/snapshot')
  async getSnapshot(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ expedicion_id: number; estado_snapshot: Record<string, any> | null }> {
    const snapshot = await this.expedicionesService.getSnapshot(id);
    return { expedicion_id: id, estado_snapshot: snapshot };
  }

  // --- Participaciones ---

  @Post(':id/participaciones')
  async addParticipacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateParticipacionDto,
  ): Promise<ParticipacionResponseDto> {
    const p = await this.expedicionesService.addParticipacion({
      expedicion_id: id,
      usuario_id: dto.usuario_id,
      personaje_id: dto.personaje_id,
    });
    return ParticipacionResponseDto.fromEntity(p);
  }

  @Get(':id/participaciones')
  async getParticipaciones(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ParticipacionResponseDto[]> {
    const participaciones =
      await this.expedicionesService.getParticipaciones(id);
    return participaciones.map(ParticipacionResponseDto.fromEntity);
  }

  @Delete('participaciones/:participacionId')
  async removeParticipacion(
    @Param('participacionId', ParseIntPipe) participacionId: number,
  ): Promise<void> {
    await this.expedicionesService.removeParticipacion(participacionId);
  }

  @Put('participaciones/:participacionId/oro')
  async updateOro(
    @Param('participacionId', ParseIntPipe) participacionId: number,
    @Body() body: { oro: number },
  ): Promise<{ participacion_id: number; oro_acumulado: number }> {
    await this.expedicionesService.updateOro(participacionId, body.oro);
    return { participacion_id: participacionId, oro_acumulado: body.oro };
  }

  @Put('participaciones/:participacionId/desactivar')
  async desactivarParticipacion(
    @Param('participacionId', ParseIntPipe) participacionId: number,
    @Body() dto: DesactivarParticipacionDto,
  ): Promise<{ participacion_id: number; activo: boolean; sala_salida: number }> {
    await this.expedicionesService.desactivarParticipacion(participacionId, dto.sala_salida);
    return { participacion_id: participacionId, activo: false, sala_salida: dto.sala_salida };
  }

  @Put('participaciones/:participacionId/reactivar')
  async reactivarParticipacion(
    @Param('participacionId', ParseIntPipe) participacionId: number,
  ): Promise<{ participacion_id: number; activo: boolean }> {
    await this.expedicionesService.reactivarParticipacion(participacionId);
    return { participacion_id: participacionId, activo: true };
  }
}
