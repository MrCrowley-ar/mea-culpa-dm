import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tier } from './entities/tier.entity';
import { Piso } from './entities/piso.entity';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { Item } from './entities/item.entity';
import { ConfiguracionService } from './configuracion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tier, Piso, TipoHabitacion, Item])],
  providers: [ConfiguracionService],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}
