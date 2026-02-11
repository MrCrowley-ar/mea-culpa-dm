import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Check,
} from 'typeorm';
import { Piso } from '../../configuracion/entities/piso.entity';
import { TipoHabitacion } from '../../configuracion/entities/tipo-habitacion.entity';
import { EncuentroEnemigo } from './encuentro-enemigo.entity';

@Entity({ name: 'tabla_encuentros', schema: 'expediciones' })
@Check('"rango_min" <= "rango_max"')
@Check('"rango_min" >= 1 AND "rango_max" <= 20')
export class TablaEncuentro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  piso_numero: number;

  @ManyToOne(() => Piso)
  @JoinColumn({ name: 'piso_numero', referencedColumnName: 'numero' })
  piso: Piso;

  @Column({ type: 'int' })
  tipo_habitacion_id: number;

  @ManyToOne(() => TipoHabitacion)
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipo_habitacion: TipoHabitacion;

  @Column({ type: 'int' })
  rango_min: number;

  @Column({ type: 'int' })
  rango_max: number;

  @Column({ type: 'int' })
  cantidad_total: number;

  @OneToMany(() => EncuentroEnemigo, (ee) => ee.tabla_encuentro)
  enemigos: EncuentroEnemigo[];
}
