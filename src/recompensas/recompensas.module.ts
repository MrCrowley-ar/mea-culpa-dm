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
import { RecompensasService } from './recompensas.service';

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
    ]),
  ],
  providers: [RecompensasService],
  exports: [RecompensasService],
})
export class RecompensasModule {}
