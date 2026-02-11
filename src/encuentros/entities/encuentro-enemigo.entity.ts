import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TablaEncuentro } from './tabla-encuentro.entity';
import { TipoEnemigo } from './tipo-enemigo.entity';

@Entity({ name: 'encuentro_enemigos', schema: 'expediciones' })
@Unique(['tabla_encuentro_id', 'tipo_enemigo_id'])
export class EncuentroEnemigo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tabla_encuentro_id: number;

  @ManyToOne(() => TablaEncuentro, (te) => te.enemigos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tabla_encuentro_id' })
  tabla_encuentro: TablaEncuentro;

  @Column({ type: 'int' })
  tipo_enemigo_id: number;

  @ManyToOne(() => TipoEnemigo)
  @JoinColumn({ name: 'tipo_enemigo_id' })
  tipo_enemigo: TipoEnemigo;

  @Column({ type: 'int', nullable: true })
  max_cantidad: number;
}
