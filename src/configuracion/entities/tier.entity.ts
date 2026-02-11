import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Check,
} from 'typeorm';
import { Piso } from './piso.entity';

@Entity({ name: 'tiers', schema: 'expediciones' })
@Check('"piso_min" <= "piso_max"')
@Check('"numero" BETWEEN 1 AND 4')
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  numero: number;

  @Column({ type: 'int' })
  piso_min: number;

  @Column({ type: 'int' })
  piso_max: number;

  @Column({ type: 'int', default: 0 })
  mod_armas: number;

  @Column({ type: 'int', default: 0 })
  mod_armaduras: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcion: string;

  @OneToMany(() => Piso, (p) => p.tier)
  pisos: Piso[];
}
