import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEnemigo } from './entities/tipo-enemigo.entity';
import { TablaEncuentro } from './entities/tabla-encuentro.entity';
import { EncuentroEnemigo } from './entities/encuentro-enemigo.entity';
import { EncuentrosService } from './encuentros.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoEnemigo, TablaEncuentro, EncuentroEnemigo]),
  ],
  providers: [EncuentrosService],
  exports: [EncuentrosService],
})
export class EncuentrosModule {}
