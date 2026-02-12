import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEnemigo } from './entities/tipo-enemigo.entity';
import { TablaEncuentro } from './entities/tabla-encuentro.entity';
import { EncuentroEnemigo } from './entities/encuentro-enemigo.entity';
import { TipoEnemigoRepository } from './repositories/tipo-enemigo.repository';
import { TablaEncuentroRepository } from './repositories/tabla-encuentro.repository';
import { EncuentroEnemigoRepository } from './repositories/encuentro-enemigo.repository';
import { EncuentrosService } from './encuentros.service';
import { EncuentrosController } from './encuentros.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoEnemigo, TablaEncuentro, EncuentroEnemigo]),
  ],
  providers: [
    TipoEnemigoRepository,
    TablaEncuentroRepository,
    EncuentroEnemigoRepository,
    EncuentrosService,
  ],
  controllers: [EncuentrosController],
  exports: [EncuentrosService],
})
export class EncuentrosModule {}
