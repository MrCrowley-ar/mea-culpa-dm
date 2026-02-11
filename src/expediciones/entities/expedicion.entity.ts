import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoExpedicion } from '../../common/enums';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Participacion } from './participacion.entity';
import { HistorialHabitacion } from '../../historial/entities/historial-habitacion.entity';

@Entity({ name: 'expediciones', schema: 'expediciones' })
export class Expedicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  organizador_id: string;

  @ManyToOne(() => Usuario, (u) => u.expediciones_organizadas)
  @JoinColumn({ name: 'organizador_id' })
  organizador: Usuario;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: EstadoExpedicion,
    default: EstadoExpedicion.PENDIENTE,
  })
  estado: EstadoExpedicion;

  @Column({ type: 'int', default: 1 })
  piso_actual: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Participacion, (p) => p.expedicion)
  participaciones: Participacion[];

  @OneToMany(() => HistorialHabitacion, (h) => h.expedicion)
  historial_habitaciones: HistorialHabitacion[];
}
