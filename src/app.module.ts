import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ExpedicionesModule } from './expediciones/expediciones.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { EncuentrosModule } from './encuentros/encuentros.module';
import { RecompensasModule } from './recompensas/recompensas.module';
import { HistorialModule } from './historial/historial.module';
import { GameplayModule } from './gameplay/gameplay.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        schema: 'expediciones',
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UsuariosModule,
    ExpedicionesModule,
    ConfiguracionModule,
    EncuentrosModule,
    RecompensasModule,
    HistorialModule,
    GameplayModule,
  ],
})
export class AppModule {}
