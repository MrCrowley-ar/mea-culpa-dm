import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Expedicion } from './expedicion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Personaje } from '../../usuarios/entities/personaje.entity';
import { HistorialRecompensa } from '../../historial/entities/historial-recompensa.entity';

@Entity({ name: 'participaciones', schema: 'expediciones' })
@Unique(['expedicion_id', 'usuario_id'])
export class Participacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  expedicion_id: number;

  @ManyToOne(() => Expedicion, (e) => e.participaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expedicion_id' })
  expedicion: Expedicion;

  @Column({ type: 'varchar', length: 32 })
  usuario_id: string;

  @ManyToOne(() => Usuario, (u) => u.participaciones)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'int' })
  personaje_id: number;

  @ManyToOne(() => Personaje)
  @JoinColumn({ name: 'personaje_id' })
  personaje: Personaje;

  @Column({ type: 'int', default: 0 })
  oro_acumulado: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int', nullable: true })
  sala_salida: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => HistorialRecompensa, (hr) => hr.participacion)
  historial_recompensas: HistorialRecompensa[];
}
