import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { RolUsuario } from '../../common/enums';

@Entity({ name: 'usuario_roles', schema: 'expediciones' })
@Unique(['usuario_id', 'rol'])
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  usuario_id: string;

  @ManyToOne(() => Usuario, (u) => u.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;
}
