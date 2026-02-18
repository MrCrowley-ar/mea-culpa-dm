import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolUsuario } from '../../common/enums';
import { Expedicion } from '../../expediciones/entities/expedicion.entity';
import { Participacion } from '../../expediciones/entities/participacion.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity({ name: 'usuarios', schema: 'expediciones' })
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  discord_id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string | null;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.PLAYER })
  rol: RolUsuario;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Expedicion, (e) => e.organizador)
  expediciones_organizadas: Expedicion[];

  @OneToMany(() => Participacion, (p) => p.usuario)
  participaciones: Participacion[];

  @OneToMany(() => RefreshToken, (rt) => rt.usuario)
  refresh_tokens: RefreshToken[];
}
