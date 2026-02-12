import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tier } from './entities/tier.entity';
import { Piso } from './entities/piso.entity';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { Item } from './entities/item.entity';
import { TierRepository } from './repositories/tier.repository';
import { PisoRepository } from './repositories/piso.repository';
import { TipoHabitacionRepository } from './repositories/tipo-habitacion.repository';
import { ItemRepository } from './repositories/item.repository';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tier, Piso, TipoHabitacion, Item])],
  providers: [
    TierRepository,
    PisoRepository,
    TipoHabitacionRepository,
    ItemRepository,
    ConfiguracionService,
  ],
  controllers: [ConfiguracionController],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}
