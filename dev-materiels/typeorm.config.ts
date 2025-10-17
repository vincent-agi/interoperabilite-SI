import { DataSource } from 'typeorm';
import { LogEntity } from './src/database/entities/log.entity';
import { OrderEntity } from './src/orders/entities/order.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'siinteroperable',
  entities: [LogEntity, OrderEntity],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;