import { DataSource } from 'typeorm';
import { LogEntity } from './src/database/entities/log.entity';
import { CommandEntity } from './src/commands/entities/command.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'siinteroperable',
  entities: [LogEntity, CommandEntity],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
  logging: true, // Activer le logging pour le débogage
});

export default dataSource;