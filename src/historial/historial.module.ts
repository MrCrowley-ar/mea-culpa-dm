import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialHabitacion } from './entities/historial-habitacion.entity';
import { HistorialRecompensa } from './entities/historial-recompensa.entity';
import { HistorialService } from './historial.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialHabitacion, HistorialRecompensa]),
  ],
  providers: [HistorialService],
  exports: [HistorialService],
})
export class HistorialModule {}
