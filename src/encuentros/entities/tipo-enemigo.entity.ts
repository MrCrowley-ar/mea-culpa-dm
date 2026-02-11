import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Piso } from '../../configuracion/entities/piso.entity';

@Entity({ name: 'tipos_enemigo', schema: 'expediciones' })
@Unique(['nombre', 'piso_id'])
export class TipoEnemigo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  piso_id: number;

  @ManyToOne(() => Piso)
  @JoinColumn({ name: 'piso_id', referencedColumnName: 'numero' })
  piso: Piso;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
