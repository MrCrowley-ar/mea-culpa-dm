import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipos_habitacion', schema: 'expediciones' })
export class TipoHabitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: false })
  usa_tabla_boss: boolean;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}
