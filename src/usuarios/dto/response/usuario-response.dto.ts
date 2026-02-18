import { Usuario } from '../../entities/usuario.entity';

export class UsuarioResponseDto {
  discord_id: string;
  nombre: string;
  rol: string;
  created_at: Date;

  static fromEntity(entity: Usuario): UsuarioResponseDto {
    const dto = new UsuarioResponseDto();
    dto.discord_id = entity.discord_id;
    dto.nombre = entity.nombre;
    dto.rol = entity.rol;
    dto.created_at = entity.created_at;
    return dto;
  }
}
