import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirlineEntity } from './airline/airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport/airport.entity';
import { AirlineAirportController } from './airline/airline-airport.controller';

@Module({
  imports: [
    AirlineModule,
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
  controllers: [AppController, AirlineAirportController],
  providers: [AppService],
})
export class AppModule {}
