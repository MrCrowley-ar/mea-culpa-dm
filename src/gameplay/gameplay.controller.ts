import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../common/enums';
import { GameplayService } from './gameplay.service';
import { ResolverEncuentroDto } from './dto/request/resolver-encuentro.dto';
import { ResolverRecompensaDto } from './dto/request/resolver-recompensa.dto';
import { EncuentroResueltoDto } from './dto/response/encuentro-resuelto.dto';
import { RecompensaResueltaDto } from './dto/response/recompensa-resuelta.dto';

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
}
