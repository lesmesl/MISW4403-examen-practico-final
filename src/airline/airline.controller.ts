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
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll(): Promise<AirlineEntity[]> {
    return this.airlineService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<AirlineEntity> {
    return this.airlineService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() airline: AirlineEntity): Promise<AirlineEntity> {
    return this.airlineService.create(airline);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() airline: AirlineEntity,
  ): Promise<AirlineEntity> {
    return this.airlineService.update(id, airline);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.airlineService.delete(id);
  }
}
