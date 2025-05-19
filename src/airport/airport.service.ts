import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({ relations: ['airlines'] });
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });
    if (!airport) {
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return airport;
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    if (!airport.codigo || airport.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente tres caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persisted = await this.airportRepository.findOne({ where: { id } });
    if (!persisted) {
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    if (!airport.codigo || airport.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente tres caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    airport.id = id;
    return await this.airportRepository.save(airport);
  }

  async delete(id: string): Promise<void> {
    const airport = await this.airportRepository.findOne({ where: { id } });
    if (!airport) {
      throw new BusinessLogicException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.airportRepository.remove(airport);
  }
}
