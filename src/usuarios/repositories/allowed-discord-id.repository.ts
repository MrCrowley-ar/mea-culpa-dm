import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllowedDiscordId } from '../entities/allowed-discord-id.entity';

@Injectable()
export class AllowedDiscordIdRepository {
  constructor(
    @InjectRepository(AllowedDiscordId)
    private readonly repo: Repository<AllowedDiscordId>,
  ) {}

  async findById(discordId: string): Promise<AllowedDiscordId | null> {
    return this.repo.findOne({ where: { discord_id: discordId } });
  }

  async findAll(): Promise<AllowedDiscordId[]> {
    return this.repo.find();
  }
}
