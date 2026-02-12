export class RecompensaResueltaDto {
  piso: number;
  tipo_habitacion_id: number;
  tirada_original: number;
  bonus_recompensa: number;
  tirada_con_bonus: number;
  tipo_resultado: string;
  dados_oro?: string;
  descripcion?: string;
  requiere_subtabla: boolean;
  subtabla_nombre?: string;
  tirada_subtabla?: number;
  item_nombre?: string;
  item_id?: number;
  modificador_tier?: number;
  item_con_modificador?: string;
  efecto_especial?: string;

  static nada(params: {
    piso: number;
    tipo_habitacion_id: number;
    tirada_original: number;
    bonus_recompensa: number;
    tirada_con_bonus: number;
    descripcion?: string;
  }): RecompensaResueltaDto {
    const dto = new RecompensaResueltaDto();
    dto.piso = params.piso;
    dto.tipo_habitacion_id = params.tipo_habitacion_id;
    dto.tirada_original = params.tirada_original;
    dto.bonus_recompensa = params.bonus_recompensa;
    dto.tirada_con_bonus = params.tirada_con_bonus;
    dto.tipo_resultado = 'nada';
    dto.descripcion = params.descripcion ?? 'No hay recompensa';
    dto.requiere_subtabla = false;
    return dto;
  }

  static oro(params: {
    piso: number;
    tipo_habitacion_id: number;
    tirada_original: number;
    bonus_recompensa: number;
    tirada_con_bonus: number;
    dados_oro: string;
    descripcion?: string;
  }): RecompensaResueltaDto {
    const dto = new RecompensaResueltaDto();
    dto.piso = params.piso;
    dto.tipo_habitacion_id = params.tipo_habitacion_id;
    dto.tirada_original = params.tirada_original;
    dto.bonus_recompensa = params.bonus_recompensa;
    dto.tirada_con_bonus = params.tirada_con_bonus;
    dto.tipo_resultado = 'oro';
    dto.dados_oro = params.dados_oro;
    dto.descripcion = params.descripcion;
    dto.requiere_subtabla = false;
    return dto;
  }

  static subtablaPendiente(params: {
    piso: number;
    tipo_habitacion_id: number;
    tirada_original: number;
    bonus_recompensa: number;
    tirada_con_bonus: number;
    subtabla_nombre: string;
    descripcion?: string;
  }): RecompensaResueltaDto {
    const dto = new RecompensaResueltaDto();
    dto.piso = params.piso;
    dto.tipo_habitacion_id = params.tipo_habitacion_id;
    dto.tirada_original = params.tirada_original;
    dto.bonus_recompensa = params.bonus_recompensa;
    dto.tirada_con_bonus = params.tirada_con_bonus;
    dto.tipo_resultado = 'subtabla';
    dto.subtabla_nombre = params.subtabla_nombre;
    dto.descripcion = params.descripcion;
    dto.requiere_subtabla = true;
    return dto;
  }

  static subtablaResuelta(params: {
    piso: number;
    tipo_habitacion_id: number;
    tirada_original: number;
    bonus_recompensa: number;
    tirada_con_bonus: number;
    subtabla_nombre: string;
    tirada_subtabla: number;
    item_nombre?: string;
    item_id?: number;
    modificador_tier?: number;
    efecto_especial?: string;
    descripcion?: string;
  }): RecompensaResueltaDto {
    const dto = new RecompensaResueltaDto();
    dto.piso = params.piso;
    dto.tipo_habitacion_id = params.tipo_habitacion_id;
    dto.tirada_original = params.tirada_original;
    dto.bonus_recompensa = params.bonus_recompensa;
    dto.tirada_con_bonus = params.tirada_con_bonus;
    dto.tipo_resultado = 'subtabla';
    dto.subtabla_nombre = params.subtabla_nombre;
    dto.tirada_subtabla = params.tirada_subtabla;
    dto.requiere_subtabla = false;
    dto.item_nombre = params.item_nombre;
    dto.item_id = params.item_id;
    dto.efecto_especial = params.efecto_especial;
    dto.descripcion = params.descripcion;

    if (params.modificador_tier && params.modificador_tier > 0 && params.item_nombre) {
      dto.modificador_tier = params.modificador_tier;
      dto.item_con_modificador = `${params.item_nombre} +${params.modificador_tier}`;
    } else {
      dto.modificador_tier = 0;
    }

    return dto;
  }
}
