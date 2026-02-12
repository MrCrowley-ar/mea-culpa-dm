export class EnemigoResueltoDto {
  nombre: string;
  max_cantidad: number;
}

export class EncuentroResueltoDto {
  piso: number;
  tipo_habitacion_id: number;
  tirada: number;
  cantidad_total: number;
  enemigos: EnemigoResueltoDto[];

  static fromTablaEncuentro(te: any, tirada: number): EncuentroResueltoDto {
    const dto = new EncuentroResueltoDto();
    dto.piso = te.piso_numero;
    dto.tipo_habitacion_id = te.tipo_habitacion_id;
    dto.tirada = tirada;
    dto.cantidad_total = te.cantidad_total;
    dto.enemigos = (te.enemigos || []).map((ee: any) => ({
      nombre: ee.tipo_enemigo?.nombre ?? `Enemigo ID ${ee.tipo_enemigo_id}`,
      max_cantidad: ee.max_cantidad,
    }));
    return dto;
  }
}
