import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { HistorialService } from './historial.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { CreateHistorialHabitacionDto } from './dto/request/create-historial-habitacion.dto';
import { UpdateHistorialHabitacionDto } from './dto/request/update-historial-habitacion.dto';
import { CreateHistorialRecompensaDto } from './dto/request/create-historial-recompensa.dto';
import { UpdateHistorialRecompensaDto } from './dto/request/update-historial-recompensa.dto';
import { HistorialHabitacionResponseDto } from './dto/response/historial-habitacion-response.dto';
import { HistorialRecompensaResponseDto } from './dto/response/historial-recompensa-response.dto';

@Controller('historial')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  // --- Habitaciones ---
  @Get('expedicion/:expedicionId')
  async getHistorialExpedicion(
    @Param('expedicionId', ParseIntPipe) expedicionId: number,
  ): Promise<HistorialHabitacionResponseDto[]> {
    const items = await this.historialService.getHistorialExpedicion(expedicionId);
    return items.map(HistorialHabitacionResponseDto.fromEntity);
  }

  @Get('habitaciones/:id')
  async getHistorialHabitacion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HistorialHabitacionResponseDto> {
    const item = await this.historialService.getHistorialHabitacion(id);
    return HistorialHabitacionResponseDto.fromEntity(item);
  }

  @Post('habitaciones')
  async registrarHabitacion(
    @Body() dto: CreateHistorialHabitacionDto,
  ): Promise<HistorialHabitacionResponseDto> {
    const item = await this.historialService.registrarHabitacion(dto as any);
    return HistorialHabitacionResponseDto.fromEntity(item);
  }

  @Put('habitaciones/:id')
  async updateHabitacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHistorialHabitacionDto,
  ): Promise<HistorialHabitacionResponseDto> {
    const item = await this.historialService.updateHistorialHabitacion(id, dto as any);
    return HistorialHabitacionResponseDto.fromEntity(item);
  }

  @Delete('habitaciones/:id')
  async deleteHabitacion(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.historialService.deleteHistorialHabitacion(id);
  }

  // --- Recompensas ---
  @Get('habitaciones/:habitacionId/recompensas')
  async getRecompensasHabitacion(
    @Param('habitacionId', ParseIntPipe) habitacionId: number,
  ): Promise<HistorialRecompensaResponseDto[]> {
    const items = await this.historialService.getRecompensasHabitacion(habitacionId);
    return items.map(HistorialRecompensaResponseDto.fromEntity);
  }

  @Get('recompensas/:id')
  async getRecompensa(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HistorialRecompensaResponseDto> {
    const item = await this.historialService.getHistorialRecompensa(id);
    return HistorialRecompensaResponseDto.fromEntity(item);
  }

  @Post('recompensas')
  async registrarRecompensa(
    @Body() dto: CreateHistorialRecompensaDto,
  ): Promise<HistorialRecompensaResponseDto> {
    const item = await this.historialService.registrarRecompensa(dto as any);
    return HistorialRecompensaResponseDto.fromEntity(item);
  }

  @Put('recompensas/:id')
  async updateRecompensa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHistorialRecompensaDto,
  ): Promise<HistorialRecompensaResponseDto> {
    const item = await this.historialService.updateHistorialRecompensa(id, dto as any);
    return HistorialRecompensaResponseDto.fromEntity(item);
  }

  @Delete('recompensas/:id')
  async deleteRecompensa(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.historialService.deleteHistorialRecompensa(id);
  }
}
