import { RecompensaResueltaDto } from './recompensa-resuelta.dto';

export class ItemPendienteDto {
  indice: number;
  tirada_d20: number;
  tirada_subtabla: number | null;
  subtabla_nombre: string;
  item_id: number | null;
  item_nombre: string | null;
  modificador_tier: number | null;
}

export class ResultadoRecompensasHabitacionDto {
  historial_habitacion_id: number;
  piso: number;
  tipo_habitacion_id: number;
  resultados: RecompensaResueltaDto[];
  items_pendientes: ItemPendienteDto[];
  oro_dados: string[];
}
