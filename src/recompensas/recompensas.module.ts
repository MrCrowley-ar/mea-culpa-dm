import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablaRecompensa } from './entities/tabla-recompensa.entity';
import { TablaObjetosCuriosos } from './entities/tabla-objetos-curiosos.entity';
import { TablaItemsBoss } from './entities/tabla-items-boss.entity';
import { TablaArma } from './entities/tabla-arma.entity';
import { TablaArmadura } from './entities/tabla-armadura.entity';
import { TablaPocion } from './entities/tabla-pocion.entity';
import { TablaTesroMenor } from './entities/tabla-tesoro-menor.entity';
import { TablaCritico } from './entities/tabla-critico.entity';
import { TablaEventoBonus } from './entities/tabla-evento-bonus.entity';
import { TablaRecompensaRepository } from './repositories/tabla-recompensa.repository';
import { TablaObjetosCuriososRepository } from './repositories/tabla-objetos-curiosos.repository';
import { TablaItemsBossRepository } from './repositories/tabla-items-boss.repository';
import { TablaArmaRepository } from './repositories/tabla-arma.repository';
import { TablaArmaduraRepository } from './repositories/tabla-armadura.repository';
import { TablaPocionRepository } from './repositories/tabla-pocion.repository';
import { TablaTesroMenorRepository } from './repositories/tabla-tesoro-menor.repository';
import { TablaCriticoRepository } from './repositories/tabla-critico.repository';
import { RecompensasService } from './recompensas.service';
import { RecompensasController } from './recompensas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TablaRecompensa,
      TablaObjetosCuriosos,
      TablaItemsBoss,
      TablaArma,
      TablaArmadura,
      TablaPocion,
      TablaTesroMenor,
      TablaCritico,
      TablaEventoBonus,
    ]),
  ],
  providers: [
    TablaRecompensaRepository,
    TablaObjetosCuriososRepository,
    TablaItemsBossRepository,
    TablaArmaRepository,
    TablaArmaduraRepository,
    TablaPocionRepository,
    TablaTesroMenorRepository,
    TablaCriticoRepository,
    RecompensasService,
  ],
  controllers: [RecompensasController],
  exports: [RecompensasService],
})
export class RecompensasModule {}
