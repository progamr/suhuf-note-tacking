import { Entity, PrimaryKey, Property, ManyToOne, OneToMany } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import '../reflect-metadata';

@Entity({ tableName: 'conversations' })
export class Conversation {
  @PrimaryKey()
  id: string = uuidv4();

  @ManyToOne('User')
  user!: unknown;

  @Property()
  title!: string;

  @OneToMany('Message', 'conversation')
  messages!: unknown[];

  @OneToMany('Note', 'conversation')
  notes!: unknown[];

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}