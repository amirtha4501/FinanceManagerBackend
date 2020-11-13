import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    // username: 'ammu',
    username: 'postgres',
    // password: process.env.DB_PASSWORD,
    password: 'password',
    database: 'financemanager',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
};