import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';
import { TipoItem } from '../../common/enums';

@Entity({ name: 'items', schema: 'expediciones' })
@Check('"precio_base" IS NOT NULL OR "dados_precio" IS NOT NULL')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'enum', enum: TipoItem })
  tipo: TipoItem;

  @Column({ type: 'int', nullable: true })
  precio_base: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dados_precio: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', default: false })
  es_base_modificable: boolean;
}
