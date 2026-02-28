import { IsObject, IsNotEmpty } from 'class-validator';

export class SaveEstadoSnapshotDto {
  @IsObject()
  @IsNotEmpty()
  estado_snapshot: Record<string, any>;
}
