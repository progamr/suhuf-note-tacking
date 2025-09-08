import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import '../reflect-metadata';

@Entity({ collection: 'messages' })
export class Message {
  @PrimaryKey()
  id!: number;

  @ManyToOne('Conversation')
  conversation!: unknown;

  @Property()
  role!: 'user' | 'assistant';

  @Property({ columnType: 'text' })
  content!: string;

  @Property()
  createdAt = new Date();
}