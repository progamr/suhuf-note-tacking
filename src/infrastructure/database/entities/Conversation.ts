import { Entity, PrimaryKey, Property, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Message } from './Message';
import '../reflect-metadata';

@Entity({ tableName: 'conversations' })
export class Conversation {
  @PrimaryKey()
  id!: number;

  @ManyToOne('User')
  user!: unknown;

  @Property()
  title!: string;

  @OneToMany({ entity: () => Message, mappedBy: 'conversation' })
  messages!: Message[];

  @OneToMany('Note', 'conversation')
  notes!: unknown[];

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}