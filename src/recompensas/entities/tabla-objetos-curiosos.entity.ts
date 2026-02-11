import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { Piso } from '../../configuracion/entities/piso.entity';
import { TipoHabitacion } from '../../configuracion/entities/tipo-habitacion.entity';
import { Item } from '../../configuracion/entities/item.entity';

@Entity({ name: 'tabla_objetos_curiosos', schema: 'expediciones' })
@Unique(['piso_numero', 'tipo_habitacion_id', 'tirada'])
@Check('"tirada" BETWEEN 1 AND 20')
export class TablaObjetosCuriosos {
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
  tirada: number;

  @Column({ type: 'int' })
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
