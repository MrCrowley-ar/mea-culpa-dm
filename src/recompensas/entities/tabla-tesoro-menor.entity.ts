import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Piso } from '../../configuracion/entities/piso.entity';
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'tabla_tesoro_menor', schema: 'expediciones' })
@Check('"tirada" BETWEEN 1 AND 20')
export class TablaTesroMenor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  piso_numero: number;

  @ManyToOne(() => Piso)
  @JoinColumn({ name: 'piso_numero', referencedColumnName: 'numero' })
  piso: Piso;

  @Column({ type: 'int' })
  tirada: number;

  @Column({ type: 'int', nullable: true })
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'varchar', length: 100, nullable: true })
  efecto_especial: string;
}
