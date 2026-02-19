import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expedicion } from '../../expediciones/entities/expedicion.entity';
import { Participacion } from '../../expediciones/entities/participacion.entity';
import { RefreshToken } from './refresh-token.entity';
import { UsuarioRol } from './usuario-rol.entity';
import { Personaje } from './personaje.entity';

@Entity({ name: 'usuarios', schema: 'expediciones' })
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  discord_id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UsuarioRol, (ur) => ur.usuario, { eager: true })
  roles: UsuarioRol[];

  @OneToMany(() => Personaje, (p) => p.usuario)
  personajes: Personaje[];

  @OneToMany(() => Expedicion, (e) => e.organizador)
  expediciones_organizadas: Expedicion[];

  @OneToMany(() => Participacion, (p) => p.usuario)
  participaciones: Participacion[];

  @OneToMany(() => RefreshToken, (rt) => rt.usuario)
  refresh_tokens: RefreshToken[];

  get rolNames(): string[] {
    return this.roles?.map((r) => r.rol) ?? [];
  }
}
