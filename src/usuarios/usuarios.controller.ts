import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { UsuarioResponseDto } from './dto/response/usuario-response.dto';
import { PersonajeResponseDto } from './dto/response/personaje-response.dto';
import { CreateJugadorDto } from './dto/request/create-jugador.dto';
import { CreatePersonajeDto } from './dto/request/create-personaje.dto';
import { PromoverDmDto } from './dto/request/promover-dm.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuariosService.findAll();
    return usuarios.map(UsuarioResponseDto.fromEntity);
  }

  @Get('jugadores')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async findJugadores(): Promise<UsuarioResponseDto[]> {
    const jugadores = await this.usuariosService.findJugadores();
    return jugadores.map(UsuarioResponseDto.fromEntity);
  }

  @Post('jugadores')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async createJugador(
    @Body() dto: CreateJugadorDto,
  ): Promise<UsuarioResponseDto> {
    const jugador = await this.usuariosService.createJugador(
      dto.discord_id,
      dto.nombre,
    );
    return UsuarioResponseDto.fromEntity(jugador);
  }

  // --- Personajes ---

  @Get(':discordId/personajes')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async getPersonajes(
    @Param('discordId') discordId: string,
  ): Promise<PersonajeResponseDto[]> {
    const personajes = await this.usuariosService.getPersonajes(discordId);
    return personajes.map(PersonajeResponseDto.fromEntity);
  }

  @Post(':discordId/personajes')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async createPersonaje(
    @Param('discordId') discordId: string,
    @Body() dto: CreatePersonajeDto,
  ): Promise<PersonajeResponseDto> {
    const personaje = await this.usuariosService.createPersonaje(
      discordId,
      dto.nombre,
    );
    return PersonajeResponseDto.fromEntity(personaje);
  }

  @Delete('personajes/:personajeId')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async deletePersonaje(
    @Param('personajeId', ParseIntPipe) personajeId: number,
  ): Promise<void> {
    await this.usuariosService.deletePersonaje(personajeId);
  }

  // --- Promover DM ---

  @Post('promover-dm')
  @Roles(RolUsuario.ADMIN)
  async promoverDm(@Body() dto: PromoverDmDto): Promise<{ message: string }> {
    await this.usuariosService.addAllowedDiscordId(dto.discord_id, dto.nota);
    return {
      message: `Discord ID ${dto.discord_id} agregado a la lista de permitidos. El jugador puede registrarse como DM.`,
    };
  }

  // --- Allowed Discord IDs ---

  @Get('allowed')
  @Roles(RolUsuario.ADMIN)
  async getAllowed() {
    return this.usuariosService.getAllowedDiscordIds();
  }

  @Delete('allowed/:discordId')
  @Roles(RolUsuario.ADMIN)
  async removeAllowed(
    @Param('discordId') discordId: string,
  ): Promise<void> {
    await this.usuariosService.removeAllowedDiscordId(discordId);
  }

  // --- Detalle usuario ---

  @Get(':discordId')
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  async findOne(
    @Param('discordId') discordId: string,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.usuariosService.findByDiscordId(discordId);
    return UsuarioResponseDto.fromEntity(usuario);
  }
}
