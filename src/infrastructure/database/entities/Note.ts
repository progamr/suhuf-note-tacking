import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import '../reflect-metadata';

@Entity({ tableName: 'notes' })
export class Note {
  @PrimaryKey()
  id!: number;

  @ManyToOne('User')
  user!: unknown;

  @ManyToOne('Conversation', { nullable: true })
  conversation?: unknown;

  @Property()
  title!: string;

  @Property({ columnType: 'text' })
  content!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}