import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { HistorialHabitacion } from './historial-habitacion.entity';
import { Participacion } from '../../expediciones/entities/participacion.entity';
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'historial_recompensas', schema: 'expediciones' })
export class HistorialRecompensa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  historial_habitacion_id: number;

  @ManyToOne(() => HistorialHabitacion, (hh) => hh.recompensas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'historial_habitacion_id' })
  historial_habitacion: HistorialHabitacion;

  @Column({ type: 'int' })
  participacion_id: number;

  @ManyToOne(() => Participacion, (p) => p.historial_recompensas)
  @JoinColumn({ name: 'participacion_id' })
  participacion: Participacion;

  @Column({ type: 'int' })
  tirada_original: number;

  @Column({ type: 'int', nullable: true })
  tirada_subtabla: number;

  @Column({ type: 'int', nullable: true })
  item_id: number;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'int', nullable: true })
  modificador_tier: number;

  @Column({ type: 'int', default: 0 })
  oro_obtenido: number;

  @Column({ type: 'boolean', default: false })
  vendido: boolean;

  @Column({ type: 'int', nullable: true })
  precio_venta: number;

  @CreateDateColumn()
  created_at: Date;
}
