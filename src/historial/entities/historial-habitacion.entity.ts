import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Expedicion } from '../../expediciones/entities/expedicion.entity';
import { TipoHabitacion } from '../../configuracion/entities/tipo-habitacion.entity';
import { HistorialRecompensa } from './historial-recompensa.entity';

@Entity({ name: 'historial_habitaciones', schema: 'expediciones' })
export class HistorialHabitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  expedicion_id: number;

  @ManyToOne(() => Expedicion, (e) => e.historial_habitaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expedicion_id' })
  expedicion: Expedicion;

  @Column({ type: 'int' })
  piso_numero: number;

  @Column({ type: 'int' })
  tipo_habitacion_id: number;

  @ManyToOne(() => TipoHabitacion)
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipo_habitacion: TipoHabitacion;

  @Column({ type: 'int' })
  orden: number;

  @Column({ type: 'int', nullable: true })
  tirada_encuentro: number;

  @Column({ type: 'int', default: 0 })
  enemigos_derrotados: number;

  @Column({ type: 'boolean', default: false })
  completada: boolean;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => HistorialRecompensa, (hr) => hr.historial_habitacion)
  recompensas: HistorialRecompensa[];
}
