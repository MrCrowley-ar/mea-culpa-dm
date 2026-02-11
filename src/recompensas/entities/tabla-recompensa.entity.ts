import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Piso } from '../../configuracion/entities/piso.entity';
import { TipoHabitacion } from '../../configuracion/entities/tipo-habitacion.entity';
import { TipoResultadoRecompensa } from '../../common/enums';

@Entity({ name: 'tabla_recompensas', schema: 'expediciones' })
@Check('"rango_min" <= "rango_max"')
@Check('"rango_min" >= 1 AND "rango_max" <= 20')
export class TablaRecompensa {
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

  @Column({ type: 'enum', enum: TipoResultadoRecompensa })
  tipo_resultado: TipoResultadoRecompensa;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dados_oro: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  subtabla_nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcion: string;
}
