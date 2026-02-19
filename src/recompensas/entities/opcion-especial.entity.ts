import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TablaRecompensa } from './tabla-recompensa.entity';
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'opciones_especiales', schema: 'expediciones' })
export class OpcionEspecial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tabla_recompensa_id: number;

  @ManyToOne(() => TablaRecompensa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tabla_recompensa_id' })
  tabla_recompensa: TablaRecompensa;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
