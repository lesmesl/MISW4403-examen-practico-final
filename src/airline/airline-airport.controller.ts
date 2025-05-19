import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AirlineService } from './airline.service';
import { AirportEntity } from '../airport/airport.entity';

@Controller('airlines/:airlineId/airports')
export class AirlineAirportController {
  constructor(private readonly airlineService: AirlineService) {}

  @Post(':airportId')
  @HttpCode(HttpStatus.OK)
  async addAirportToAirline(
    @Param('airlineId', new ParseUUIDPipe()) airlineId: string,
    @Param('airportId', new ParseUUIDPipe()) airportId: string,
  ) {
    return this.airlineService.addAirportToAirline(airlineId, airportId);
  }

  @Get()
  async findAirportsFromAirline(
    @Param('airlineId', new ParseUUIDPipe()) airlineId: string,
  ): Promise<AirportEntity[]> {
    return this.airlineService.findAirportsFromAirline(airlineId);
  }

  @Get(':airportId')
  async findAirportFromAirline(
    @Param('airlineId', new ParseUUIDPipe()) airlineId: string,
    @Param('airportId', new ParseUUIDPipe()) airportId: string,
  ): Promise<AirportEntity> {
    return this.airlineService.findAirportFromAirline(airlineId, airportId);
  }

  @Put()
  async updateAirportsFromAirline(
    @Param('airlineId', new ParseUUIDPipe()) airlineId: string,
    @Body() airportIds: string[],
  ) {
    return this.airlineService.updateAirportsFromAirline(airlineId, airportIds);
  }

  @Delete(':airportId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAirportFromAirline(
    @Param('airlineId', new ParseUUIDPipe()) airlineId: string,
    @Param('airportId', new ParseUUIDPipe()) airportId: string,
  ): Promise<void> {
    return this.airlineService.deleteAirportFromAirline(airlineId, airportId);
  }
}
