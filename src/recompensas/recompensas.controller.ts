import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { RecompensasService } from './recompensas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { CreateTablaRecompensaDto } from './dto/request/create-tabla-recompensa.dto';
import { UpdateTablaRecompensaDto } from './dto/request/update-tabla-recompensa.dto';
import { CreateTablaObjetosCuriososDto } from './dto/request/create-tabla-objetos-curiosos.dto';
import { CreateTablaItemsBossDto } from './dto/request/create-tabla-items-boss.dto';
import { CreateTablaArmaDto } from './dto/request/create-tabla-arma.dto';
import { CreateTablaArmaduraDto } from './dto/request/create-tabla-armadura.dto';
import { CreateTablaPocionDto } from './dto/request/create-tabla-pocion.dto';
import { CreateTablaTesoroMenorDto } from './dto/request/create-tabla-tesoro-menor.dto';
import { CreateTablaCriticoDto } from './dto/request/create-tabla-critico.dto';
import { TablaRecompensaResponseDto } from './dto/response/tabla-recompensa-response.dto';
import { TablaObjetosCuriososResponseDto } from './dto/response/tabla-objetos-curiosos-response.dto';
import { TablaItemsBossResponseDto } from './dto/response/tabla-items-boss-response.dto';
import { TablaArmaResponseDto } from './dto/response/tabla-arma-response.dto';
import { TablaArmaduraResponseDto } from './dto/response/tabla-armadura-response.dto';
import { TablaPocionResponseDto } from './dto/response/tabla-pocion-response.dto';
import { TablaTesroMenorResponseDto } from './dto/response/tabla-tesoro-menor-response.dto';
import { TablaCriticoResponseDto } from './dto/response/tabla-critico-response.dto';

@Controller('recompensas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class RecompensasController {
  constructor(private readonly recompensasService: RecompensasService) {}

  // --- Tabla Recompensas ---
  @Get('tabla')
  async getTablaRecompensas(): Promise<TablaRecompensaResponseDto[]> {
    const items = await this.recompensasService.getTablaRecompensas();
    return items.map(TablaRecompensaResponseDto.fromEntity);
  }

  @Post('tabla')
  async createTablaRecompensa(
    @Body() dto: CreateTablaRecompensaDto,
  ): Promise<TablaRecompensaResponseDto> {
    const item = await this.recompensasService.createTablaRecompensa(dto as any);
    return TablaRecompensaResponseDto.fromEntity(item);
  }

  @Put('tabla/:id')
  async updateTablaRecompensa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTablaRecompensaDto,
  ): Promise<TablaRecompensaResponseDto> {
    const item = await this.recompensasService.updateTablaRecompensa(id, dto as any);
    return TablaRecompensaResponseDto.fromEntity(item);
  }

  @Delete('tabla/:id')
  async deleteTablaRecompensa(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaRecompensa(id);
  }

  // --- Objetos Curiosos ---
  @Get('objetos-curiosos')
  async getObjetosCuriosos(): Promise<TablaObjetosCuriososResponseDto[]> {
    const items = await this.recompensasService.getTablaObjetosCuriosos();
    return items.map(TablaObjetosCuriososResponseDto.fromEntity);
  }

  @Post('objetos-curiosos')
  async createObjetoCurioso(
    @Body() dto: CreateTablaObjetosCuriososDto,
  ): Promise<TablaObjetosCuriososResponseDto> {
    const item = await this.recompensasService.createTablaObjetosCuriosos(dto as any);
    return TablaObjetosCuriososResponseDto.fromEntity(item);
  }

  @Delete('objetos-curiosos/:id')
  async deleteObjetoCurioso(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaObjetosCuriosos(id);
  }

  // --- Items Boss ---
  @Get('items-boss')
  async getItemsBoss(): Promise<TablaItemsBossResponseDto[]> {
    const items = await this.recompensasService.getTablaItemsBoss();
    return items.map(TablaItemsBossResponseDto.fromEntity);
  }

  @Post('items-boss')
  async createItemBoss(
    @Body() dto: CreateTablaItemsBossDto,
  ): Promise<TablaItemsBossResponseDto> {
    const item = await this.recompensasService.createTablaItemsBoss(dto as any);
    return TablaItemsBossResponseDto.fromEntity(item);
  }

  @Delete('items-boss/:id')
  async deleteItemBoss(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaItemsBoss(id);
  }

  // --- Armas ---
  @Get('armas')
  async getArmas(): Promise<TablaArmaResponseDto[]> {
    const items = await this.recompensasService.getTablaArmas();
    return items.map(TablaArmaResponseDto.fromEntity);
  }

  @Post('armas')
  async createArma(@Body() dto: CreateTablaArmaDto): Promise<TablaArmaResponseDto> {
    const item = await this.recompensasService.createTablaArma(dto as any);
    return TablaArmaResponseDto.fromEntity(item);
  }

  @Delete('armas/:id')
  async deleteArma(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaArma(id);
  }

  // --- Armaduras ---
  @Get('armaduras')
  async getArmaduras(): Promise<TablaArmaduraResponseDto[]> {
    const items = await this.recompensasService.getTablaArmaduras();
    return items.map(TablaArmaduraResponseDto.fromEntity);
  }

  @Post('armaduras')
  async createArmadura(@Body() dto: CreateTablaArmaduraDto): Promise<TablaArmaduraResponseDto> {
    const item = await this.recompensasService.createTablaArmadura(dto as any);
    return TablaArmaduraResponseDto.fromEntity(item);
  }

  @Delete('armaduras/:id')
  async deleteArmadura(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaArmadura(id);
  }

  // --- Pociones ---
  @Get('pociones')
  async getPociones(): Promise<TablaPocionResponseDto[]> {
    const items = await this.recompensasService.getTablaPociones();
    return items.map(TablaPocionResponseDto.fromEntity);
  }

  @Post('pociones')
  async createPocion(@Body() dto: CreateTablaPocionDto): Promise<TablaPocionResponseDto> {
    const item = await this.recompensasService.createTablaPocion(dto as any);
    return TablaPocionResponseDto.fromEntity(item);
  }

  @Delete('pociones/:id')
  async deletePocion(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaPocion(id);
  }

  // --- Tesoro Menor ---
  @Get('tesoro-menor')
  async getTesroMenor(): Promise<TablaTesroMenorResponseDto[]> {
    const items = await this.recompensasService.getTablaTesroMenor();
    return items.map(TablaTesroMenorResponseDto.fromEntity);
  }

  @Post('tesoro-menor')
  async createTesroMenor(
    @Body() dto: CreateTablaTesoroMenorDto,
  ): Promise<TablaTesroMenorResponseDto> {
    const item = await this.recompensasService.createTablaTesroMenor(dto as any);
    return TablaTesroMenorResponseDto.fromEntity(item);
  }

  @Delete('tesoro-menor/:id')
  async deleteTesroMenor(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaTesroMenor(id);
  }

  // --- Critico ---
  @Get('critico')
  async getCritico(): Promise<TablaCriticoResponseDto[]> {
    const items = await this.recompensasService.getTablaCritico();
    return items.map(TablaCriticoResponseDto.fromEntity);
  }

  @Post('critico')
  async createCritico(@Body() dto: CreateTablaCriticoDto): Promise<TablaCriticoResponseDto> {
    const item = await this.recompensasService.createTablaCritico(dto as any);
    return TablaCriticoResponseDto.fromEntity(item);
  }

  @Delete('critico/:id')
  async deleteCritico(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.recompensasService.deleteTablaCritico(id);
  }
}
