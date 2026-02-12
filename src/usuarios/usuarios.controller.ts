import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { UsuarioResponseDto } from './dto/response/usuario-response.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.DM, RolUsuario.ADMIN)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuariosService.findAll();
    return usuarios.map(UsuarioResponseDto.fromEntity);
  }

  @Get(':discordId')
  async findOne(
    @Param('discordId') discordId: string,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.usuariosService.findByDiscordId(discordId);
    return UsuarioResponseDto.fromEntity(usuario);
  }
}
