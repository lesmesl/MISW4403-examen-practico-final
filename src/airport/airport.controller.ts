import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll(): Promise<AirportEntity[]> {
    return this.airportService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AirportEntity> {
    return this.airportService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() airport: AirportEntity): Promise<AirportEntity> {
    return this.airportService.create(airport);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() airport: AirportEntity,
  ): Promise<AirportEntity> {
    return this.airportService.update(id, airport);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.airportService.delete(id);
  }
}
