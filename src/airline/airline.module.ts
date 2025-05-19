import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineController } from './airline.controller';
import { AirlineAirportController } from './airline-airport.controller';
import { AirportEntity } from '../airport/airport.entity';

@Module({
  providers: [AirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  controllers: [AirlineController, AirlineAirportController],
  exports: [AirlineService],
})
export class AirlineModule {}
