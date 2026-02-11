import {
  Controller,
  Get,
  Post,
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

@Controller('expediciones')
@UseGuards(JwtAuthGuard)
export class ExpedicionesController {
  constructor(private readonly expedicionesService: ExpedicionesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.DM, RolUsuario.ADMIN)
  create(@Request() req: any) {
    return this.expedicionesService.create(req.user.discord_id, req.user.rol);
  }

  @Get()
  findAll() {
    return this.expedicionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expedicionesService.findOne(id);
  }

  @Post(':id/join')
  join(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre_personaje') nombrePersonaje: string,
    @Request() req: any,
  ) {
    return this.expedicionesService.join(
      id,
      req.user.discord_id,
      nombrePersonaje,
    );
  }
}
