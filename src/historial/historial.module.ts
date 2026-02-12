import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialHabitacion } from './entities/historial-habitacion.entity';
import { HistorialRecompensa } from './entities/historial-recompensa.entity';
import { HistorialHabitacionRepository } from './repositories/historial-habitacion.repository';
import { HistorialRecompensaRepository } from './repositories/historial-recompensa.repository';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialHabitacion, HistorialRecompensa]),
  ],
  providers: [
    HistorialHabitacionRepository,
    HistorialRecompensaRepository,
    HistorialService,
  ],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}
