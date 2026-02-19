import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity({ name: 'personajes', schema: 'expediciones' })
export class Personaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  usuario_id: string;

  @ManyToOne(() => Usuario, (u) => u.personajes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @CreateDateColumn()
  created_at: Date;
}
