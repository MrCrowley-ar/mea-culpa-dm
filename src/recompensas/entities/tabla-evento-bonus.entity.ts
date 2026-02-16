import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Tier } from '../../configuracion/entities/tier.entity';

@Entity({ name: 'tabla_eventos_bonus', schema: 'expediciones' })
@Check('"rango_min" <= "rango_max"')
@Check('"rango_min" >= 1 AND "rango_max" <= 20')
export class TablaEventoBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tier_numero: number;

  @ManyToOne(() => Tier)
  @JoinColumn({ name: 'tier_numero', referencedColumnName: 'numero' })
  tier: Tier;

  @Column({ type: 'int' })
  rango_min: number;

  @Column({ type: 'int' })
  rango_max: number;

  @Column({ type: 'varchar', length: 100 })
  evento: string;

  @Column({ type: 'text', nullable: true })
  detalles: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  recompensa: string;
}
