import { MikroORM, EntityManager } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from './mikro-orm.config';

class ServiceLocator {
  private static instance: ServiceLocator;
  private services: Map<string, any> = new Map();
  private orm: MikroORM | null = null;
  
  private constructor() {}
  
  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }
  
  async getOrm(): Promise<MikroORM> {
    if (!this.orm) {
      this.orm = await MikroORM.init<PostgreSqlDriver>(config);
    }
    return this.orm;
  }
  
  async getEntityManager(): Promise<EntityManager> {
    const orm = await this.getOrm();
    return orm.em.fork();
  }
  
  async getRepository<T extends object>(entityClass: any): Promise<any> {
    const em = await this.getEntityManager();
    return em.getRepository(entityClass);
  }
  
  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }
  
  get<T>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found`);
    }
    return this.services.get(name);
  }
  
  async createService<T>(serviceClass: new (...args: any[]) => T, ...args: any[]): Promise<T> {
    const serviceName = serviceClass.name;
    
    if (!this.services.has(serviceName)) {
      const service = new serviceClass(...args);
      this.services.set(serviceName, service);
    }
    
    return this.services.get(serviceName);
  }
}

export const DI = ServiceLocator.getInstance();