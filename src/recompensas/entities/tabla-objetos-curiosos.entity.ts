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
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'tabla_objetos_curiosos', schema: 'expediciones' })
@Check('"tirada" BETWEEN 1 AND 20')
export class TablaObjetosCuriosos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  piso_numero: number;

  @ManyToOne(() => Piso, { nullable: true })
  @JoinColumn({ name: 'piso_numero', referencedColumnName: 'numero' })
  piso: Piso;

  @Column({ type: 'int', nullable: true })
  tipo_habitacion_id: number;

  @ManyToOne(() => TipoHabitacion, { nullable: true })
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipo_habitacion: TipoHabitacion;

  @Column({ type: 'int' })
  tirada: number;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
