import { Module } from '@nestjs/common';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { EncuentrosModule } from '../encuentros/encuentros.module';
import { RecompensasModule } from '../recompensas/recompensas.module';
import { HistorialModule } from '../historial/historial.module';
import { ExpedicionesModule } from '../expediciones/expediciones.module';
import { GameplayService } from './gameplay.service';
import { GameplayController } from './gameplay.controller';

@Module({
  imports: [
    ConfiguracionModule,
    EncuentrosModule,
    RecompensasModule,
    HistorialModule,
    ExpedicionesModule,
  ],
  providers: [GameplayService],
  controllers: [GameplayController],
})
export class GameplayModule {}
