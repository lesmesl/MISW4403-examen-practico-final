import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({ relations: ['airports'] });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });
    if (!airline) {
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const hoy = new Date();
    if (airline.fechaFundacion >= hoy) {
      throw new BusinessLogicException(
        'La fecha de fundación debe ser una fecha pasada',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persisted = await this.airlineRepository.findOne({ where: { id } });
    if (!persisted) {
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    const hoy = new Date();
    if (airline.fechaFundacion >= hoy) {
      throw new BusinessLogicException(
        'La fecha de fundación debe ser una fecha pasada',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    airline.id = id;
    return await this.airlineRepository.save(airline);
  }

  async delete(id: string): Promise<void> {
    const airline = await this.airlineRepository.findOne({ where: { id } });
    if (!airline) {
      throw new BusinessLogicException(
        'La aerolínea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    await this.airlineRepository.remove(airline);
  }

  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    const airline = await this.findOne(airlineId);
    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport) {
      throw new BusinessLogicException(
        'El aeropuerto no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    airline.airports = airline.airports || [];
    airline.airports.push(airport);
    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline = await this.findOne(airlineId);
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airports = await this.findAirportsFromAirline(airlineId);
    const airport = airports.find((a) => a.id === airportId);
    if (!airport) {
      throw new BusinessLogicException(
        'El aeropuerto no está asociado con la aerolínea',
        BusinessError.NOT_FOUND,
      );
    }
    return airport;
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airportIds: string[],
  ): Promise<AirlineEntity> {
    const airline = await this.findOne(airlineId);
    const airports: AirportEntity[] = [];
    for (const id of airportIds) {
      const airport = await this.airportRepository.findOne({ where: { id } });
      if (!airport) {
        throw new BusinessLogicException(
          `Aeropuerto con id ${id} no encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
      airports.push(airport);
    }
    airline.airports = airports;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<void> {
    const airline = await this.findOne(airlineId);
    const airport = await this.findAirportFromAirline(airlineId, airportId);
    airline.airports = airline.airports.filter((a) => a.id !== airport.id);
    await this.airlineRepository.save(airline);
  }
}
