import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expedicion } from './entities/expedicion.entity';
import { Participacion } from './entities/participacion.entity';
import { ExpedicionesService } from './expediciones.service';
import { ExpedicionesController } from './expediciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Expedicion, Participacion])],
  providers: [ExpedicionesService],
  controllers: [ExpedicionesController],
  exports: [ExpedicionesService],
})
export class ExpedicionesModule {}
