export enum EstadoExpedicion {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en_curso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

export enum TipoItem {
  CONSUMIBLE = 'consumible',
  EQUIPO = 'equipo',
  ARMA = 'arma',
  ARMADURA = 'armadura',
  MATERIAL = 'material',
  OTRO = 'otro',
}

export enum TipoResultadoRecompensa {
  NADA = 'nada',
  ORO = 'oro',
  SUBTABLA = 'subtabla',
}

export enum RolUsuario {
  PLAYER = 'player',
  DM = 'dm',
  ADMIN = 'admin',
}
