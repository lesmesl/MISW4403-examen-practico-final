import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineEntity } from './airline/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport/airport.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5441,
      username: 'admin',
      password: 'admin',
      database: 'airlines',
      entities: [AirlineEntity, AirportEntity],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
