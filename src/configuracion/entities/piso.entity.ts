import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Tier } from './tier.entity';

@Entity({ name: 'pisos', schema: 'expediciones' })
@Check('"numero" BETWEEN 1 AND 20')
export class Piso {
  @PrimaryColumn({ type: 'int' })
  numero: number;

  @Column({ type: 'int' })
  tier_id: number;

  @ManyToOne(() => Tier, (t) => t.pisos)
  @JoinColumn({ name: 'tier_id' })
  tier: Tier;

  @Column({ type: 'int', default: 0 })
  bonus_recompensa: number;

  @Column({ type: 'int', default: 4 })
  num_habitaciones_comunes: number;
}
