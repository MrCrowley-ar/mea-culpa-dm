import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { EncuentrosService } from './encuentros.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { CreateTipoEnemigoDto } from './dto/request/create-tipo-enemigo.dto';
import { UpdateTipoEnemigoDto } from './dto/request/update-tipo-enemigo.dto';
import { CreateTablaEncuentroDto } from './dto/request/create-tabla-encuentro.dto';
import { CreateEncuentroEnemigoDto } from './dto/request/create-encuentro-enemigo.dto';
import { TipoEnemigoResponseDto } from './dto/response/tipo-enemigo-response.dto';
import { TablaEncuentroResponseDto } from './dto/response/tabla-encuentro-response.dto';
import { EncuentroEnemigoResponseDto } from './dto/response/encuentro-enemigo-response.dto';

@Controller('encuentros')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class EncuentrosController {
  constructor(private readonly encuentrosService: EncuentrosService) {}

  // --- Tipos Enemigo ---
  @Get('tipos-enemigo')
  async getTiposEnemigo(): Promise<TipoEnemigoResponseDto[]> {
    const tipos = await this.encuentrosService.getTiposEnemigo();
    return tipos.map(TipoEnemigoResponseDto.fromEntity);
  }

  @Get('tipos-enemigo/piso/:pisoNumero')
  async getTiposEnemigoPorPiso(
    @Param('pisoNumero', ParseIntPipe) pisoNumero: number,
  ): Promise<TipoEnemigoResponseDto[]> {
    const tipos = await this.encuentrosService.getTiposEnemigoPorPiso(pisoNumero);
    return tipos.map(TipoEnemigoResponseDto.fromEntity);
  }

  @Get('tipos-enemigo/:id')
  async getTipoEnemigo(@Param('id', ParseIntPipe) id: number): Promise<TipoEnemigoResponseDto> {
    const tipo = await this.encuentrosService.getTipoEnemigo(id);
    return TipoEnemigoResponseDto.fromEntity(tipo);
  }

  @Post('tipos-enemigo')
  async createTipoEnemigo(@Body() dto: CreateTipoEnemigoDto): Promise<TipoEnemigoResponseDto> {
    const tipo = await this.encuentrosService.createTipoEnemigo(dto as any);
    return TipoEnemigoResponseDto.fromEntity(tipo);
  }

  @Put('tipos-enemigo/:id')
  async updateTipoEnemigo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoEnemigoDto,
  ): Promise<TipoEnemigoResponseDto> {
    const tipo = await this.encuentrosService.updateTipoEnemigo(id, dto as any);
    return TipoEnemigoResponseDto.fromEntity(tipo);
  }

  @Delete('tipos-enemigo/:id')
  async deleteTipoEnemigo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.encuentrosService.deleteTipoEnemigo(id);
  }

  // --- Tabla Encuentros ---
  @Get('tabla')
  async getTablaEncuentros(): Promise<TablaEncuentroResponseDto[]> {
    const tabla = await this.encuentrosService.getTablaEncuentros();
    return tabla.map(TablaEncuentroResponseDto.fromEntity);
  }

  @Get('tabla/:id')
  async getTablaEncuentro(@Param('id', ParseIntPipe) id: number): Promise<TablaEncuentroResponseDto> {
    const te = await this.encuentrosService.getTablaEncuentro(id);
    return TablaEncuentroResponseDto.fromEntity(te);
  }

  @Get('tabla/tirada/:pisoNumero/:tipoHabitacionId/:tirada')
  async getEncuentroPorTirada(
    @Param('pisoNumero', ParseIntPipe) pisoNumero: number,
    @Param('tipoHabitacionId', ParseIntPipe) tipoHabitacionId: number,
    @Param('tirada', ParseIntPipe) tirada: number,
  ): Promise<TablaEncuentroResponseDto> {
    const te = await this.encuentrosService.getEncuentroPorTirada(pisoNumero, tipoHabitacionId, tirada);
    return TablaEncuentroResponseDto.fromEntity(te);
  }

  @Post('tabla')
  async createTablaEncuentro(@Body() dto: CreateTablaEncuentroDto): Promise<TablaEncuentroResponseDto> {
    const te = await this.encuentrosService.createTablaEncuentro(dto as any);
    return TablaEncuentroResponseDto.fromEntity(te);
  }

  @Delete('tabla/:id')
  async deleteTablaEncuentro(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.encuentrosService.deleteTablaEncuentro(id);
  }

  // --- Encuentro Enemigos ---
  @Post('tabla/:tablaEncuentroId/enemigos')
  async addEncuentroEnemigo(
    @Param('tablaEncuentroId', ParseIntPipe) tablaEncuentroId: number,
    @Body() dto: CreateEncuentroEnemigoDto,
  ): Promise<EncuentroEnemigoResponseDto> {
    const ee = await this.encuentrosService.addEncuentroEnemigo({
      tabla_encuentro_id: tablaEncuentroId,
      tipo_enemigo_id: dto.tipo_enemigo_id,
      max_cantidad: dto.max_cantidad,
    });
    return EncuentroEnemigoResponseDto.fromEntity(ee);
  }

  @Get('tabla/:tablaEncuentroId/enemigos')
  async getEncuentroEnemigos(
    @Param('tablaEncuentroId', ParseIntPipe) tablaEncuentroId: number,
  ): Promise<EncuentroEnemigoResponseDto[]> {
    const enemigos = await this.encuentrosService.getEncuentroEnemigos(tablaEncuentroId);
    return enemigos.map(EncuentroEnemigoResponseDto.fromEntity);
  }

  @Delete('enemigos/:id')
  async deleteEncuentroEnemigo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.encuentrosService.deleteEncuentroEnemigo(id);
  }
}
