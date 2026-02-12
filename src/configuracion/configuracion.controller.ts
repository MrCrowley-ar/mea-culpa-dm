import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { CreateItemDto } from './dto/request/create-item.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { TierResponseDto } from './dto/response/tier-response.dto';
import { PisoResponseDto } from './dto/response/piso-response.dto';
import { TipoHabitacionResponseDto } from './dto/response/tipo-habitacion-response.dto';
import { ItemResponseDto } from './dto/response/item-response.dto';

@Controller('configuracion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  // --- Tiers ---
  @Get('tiers')
  async getTiers(): Promise<TierResponseDto[]> {
    const tiers = await this.configuracionService.getTiers();
    return tiers.map(TierResponseDto.fromEntity);
  }

  @Get('tiers/:id')
  async getTier(@Param('id', ParseIntPipe) id: number): Promise<TierResponseDto> {
    const tier = await this.configuracionService.getTier(id);
    return TierResponseDto.fromEntity(tier);
  }

  // --- Pisos ---
  @Get('pisos')
  async getPisos(): Promise<PisoResponseDto[]> {
    const pisos = await this.configuracionService.getPisos();
    return pisos.map(PisoResponseDto.fromEntity);
  }

  @Get('pisos/:numero')
  async getPiso(@Param('numero', ParseIntPipe) numero: number): Promise<PisoResponseDto> {
    const piso = await this.configuracionService.getPiso(numero);
    return PisoResponseDto.fromEntity(piso);
  }

  // --- Tipos Habitacion ---
  @Get('tipos-habitacion')
  async getTiposHabitacion(): Promise<TipoHabitacionResponseDto[]> {
    const tipos = await this.configuracionService.getTiposHabitacion();
    return tipos.map(TipoHabitacionResponseDto.fromEntity);
  }

  @Get('tipos-habitacion/:id')
  async getTipoHabitacion(@Param('id', ParseIntPipe) id: number): Promise<TipoHabitacionResponseDto> {
    const tipo = await this.configuracionService.getTipoHabitacion(id);
    return TipoHabitacionResponseDto.fromEntity(tipo);
  }

  // --- Items ---
  @Get('items')
  async getItems(): Promise<ItemResponseDto[]> {
    const items = await this.configuracionService.getItems();
    return items.map(ItemResponseDto.fromEntity);
  }

  @Get('items/:id')
  async getItem(@Param('id', ParseIntPipe) id: number): Promise<ItemResponseDto> {
    const item = await this.configuracionService.getItem(id);
    return ItemResponseDto.fromEntity(item);
  }

  @Post('items')
  async createItem(@Body() dto: CreateItemDto): Promise<ItemResponseDto> {
    const item = await this.configuracionService.createItem(dto as any);
    return ItemResponseDto.fromEntity(item);
  }

  @Put('items/:id')
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.configuracionService.updateItem(id, dto as any);
    return ItemResponseDto.fromEntity(item);
  }

  @Delete('items/:id')
  async deleteItem(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.configuracionService.deleteItem(id);
  }
}
