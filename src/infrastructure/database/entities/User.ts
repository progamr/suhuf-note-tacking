import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Conversation } from './Conversation';
import { Note } from './Note';
import '../reflect-metadata';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  passwordHash!: string;

  @OneToMany({ entity: () => Conversation, mappedBy: 'user' })
  conversations!: Conversation[];

  @OneToMany({ entity: () => Note, mappedBy: 'user' })
  notes!: Note[];

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}