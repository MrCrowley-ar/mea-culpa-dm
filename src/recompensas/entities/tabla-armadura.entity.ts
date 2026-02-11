import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'tabla_armaduras', schema: 'expediciones' })
@Check('"tirada" BETWEEN 1 AND 20')
export class TablaArmadura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  tirada: number;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
