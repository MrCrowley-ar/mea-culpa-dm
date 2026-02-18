import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'allowed_discord_ids', schema: 'expediciones' })
export class AllowedDiscordId {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  discord_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nota: string;

  @CreateDateColumn()
  created_at: Date;
}
