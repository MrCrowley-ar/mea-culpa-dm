import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRol } from '../entities/usuario-rol.entity';
import { RolUsuario } from '../../common/enums';

@Injectable()
export class UsuarioRolRepository {
  constructor(
    @InjectRepository(UsuarioRol)
    private readonly repo: Repository<UsuarioRol>,
  ) {}

  async findByUsuarioId(usuarioId: string): Promise<UsuarioRol[]> {
    return this.repo.find({ where: { usuario_id: usuarioId } });
  }

  async addRol(usuarioId: string, rol: RolUsuario): Promise<UsuarioRol> {
    const entity = this.repo.create({ usuario_id: usuarioId, rol });
    return this.repo.save(entity);
  }

  async hasRol(usuarioId: string, rol: RolUsuario): Promise<boolean> {
    const count = await this.repo.count({
      where: { usuario_id: usuarioId, rol },
    });
    return count > 0;
  }

  async removeRol(usuarioId: string, rol: RolUsuario): Promise<void> {
    await this.repo.delete({ usuario_id: usuarioId, rol });
  }

  async findUsuarioIdsByRol(rol: RolUsuario): Promise<string[]> {
    const entries = await this.repo.find({ where: { rol } });
    return entries.map((e) => e.usuario_id);
  }
}
