import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors';

const mockAirline = {
  id: '1',
  nombre: 'Avianca',
  descripcion: 'Aerolínea colombiana',
  fechaFundacion: new Date('1919-12-05'),
  paginaWeb: 'https://www.avianca.com',
  airports: [],
};

const mockAirport = {
  id: '10',
  nombre: 'El Dorado',
  codigo: 'BOG',
  ciudad: 'Bogotá',
  pais: 'Colombia',
};

describe('AirlineService', () => {
  let service: AirlineService;
  let airlineRepo: Repository<AirlineEntity>;
  let airportRepo: Repository<AirportEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineService,
        {
          provide: getRepositoryToken(AirlineEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AirportEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    airlineRepo = module.get(getRepositoryToken(AirlineEntity));
    airportRepo = module.get(getRepositoryToken(AirportEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all airlines', async () => {
      jest
        .spyOn(airlineRepo, 'find')
        .mockResolvedValue([mockAirline as AirlineEntity]);
      const result = await service.findAll();
      expect(result).toEqual([mockAirline]);
    });
  });

  describe('findOne', () => {
    it('should return an airline by id', async () => {
      jest
        .spyOn(airlineRepo, 'findOne')
        .mockResolvedValue(mockAirline as AirlineEntity);
      const result = await service.findOne('1');
      expect(result).toEqual(mockAirline);
    });

    it('should throw NOT_FOUND if airline does not exist', async () => {
      jest.spyOn(airlineRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('create', () => {
    it('should create an airline with a past date', async () => {
      jest
        .spyOn(airlineRepo, 'save')
        .mockResolvedValue(mockAirline as AirlineEntity);
      const result = await service.create({
        ...mockAirline,
        fechaFundacion: new Date('1919-12-05'),
      } as AirlineEntity);
      expect(result).toEqual(mockAirline);
    });

    it('should throw PRECONDITION_FAILED if fechaFundacion is in the future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      await expect(
        service.create({
          ...mockAirline,
          fechaFundacion: futureDate,
        } as AirlineEntity),
      ).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update an airline', async () => {
      jest
        .spyOn(airlineRepo, 'findOne')
        .mockResolvedValue(mockAirline as AirlineEntity);
      jest.spyOn(airlineRepo, 'save').mockResolvedValue({
        ...mockAirline,
        nombre: 'Updated',
      } as AirlineEntity);
      const result = await service.update('1', {
        ...mockAirline,
        nombre: 'Updated',
      } as AirlineEntity);
      expect(result.nombre).toBe('Updated');
    });

    it('should throw NOT_FOUND if airline does not exist', async () => {
      jest.spyOn(airlineRepo, 'findOne').mockResolvedValue(null);
      await expect(
        service.update('2', mockAirline as AirlineEntity),
      ).rejects.toThrow(BusinessLogicException);
    });

    it('should throw PRECONDITION_FAILED if fechaFundacion is in the future', async () => {
      jest
        .spyOn(airlineRepo, 'findOne')
        .mockResolvedValue(mockAirline as AirlineEntity);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      await expect(
        service.update('1', {
          ...mockAirline,
          fechaFundacion: futureDate,
        } as AirlineEntity),
      ).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('delete', () => {
    it('should delete an airline', async () => {
      jest
        .spyOn(airlineRepo, 'findOne')
        .mockResolvedValue(mockAirline as AirlineEntity);
      jest
        .spyOn(airlineRepo, 'remove')
        .mockResolvedValue(mockAirline as AirlineEntity);
      await expect(service.delete('1')).resolves.toBeUndefined();
    });

    it('should throw NOT_FOUND if airline does not exist', async () => {
      jest.spyOn(airlineRepo, 'findOne').mockResolvedValue(null);
      await expect(service.delete('2')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...mockAirline, airports: [] } as AirlineEntity);
      jest
        .spyOn(airportRepo, 'findOne')
        .mockResolvedValue(mockAirport as AirportEntity);
      jest.spyOn(airlineRepo, 'save').mockResolvedValue({
        ...mockAirline,
        airports: [mockAirport],
      } as AirlineEntity);
      const result = await service.addAirportToAirline('1', '10');
      expect(result.airports.length).toBe(1);
    });

    it('should throw NOT_FOUND if airport does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockAirline as AirlineEntity);
      jest.spyOn(airportRepo, 'findOne').mockResolvedValue(null);
      await expect(service.addAirportToAirline('1', '99')).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return airports from an airline', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockAirline,
        airports: [mockAirport],
      } as AirlineEntity);
      const result = await service.findAirportsFromAirline('1');
      expect(result).toEqual([mockAirport]);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport from an airline', async () => {
      jest
        .spyOn(service, 'findAirportsFromAirline')
        .mockResolvedValue([mockAirport as AirportEntity]);
      const result = await service.findAirportFromAirline('1', '10');
      expect(result).toEqual(mockAirport);
    });

    it('should throw NOT_FOUND if airport is not associated', async () => {
      jest.spyOn(service, 'findAirportsFromAirline').mockResolvedValue([]);
      await expect(service.findAirportFromAirline('1', '99')).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update airports from an airline', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...mockAirline, airports: [] } as AirlineEntity);
      jest
        .spyOn(airportRepo, 'findOne')
        .mockResolvedValue(mockAirport as AirportEntity);
      jest.spyOn(airlineRepo, 'save').mockResolvedValue({
        ...mockAirline,
        airports: [mockAirport],
      } as AirlineEntity);
      const result = await service.updateAirportsFromAirline('1', ['10']);
      expect(result.airports.length).toBe(1);
    });

    it('should throw NOT_FOUND if any airport does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...mockAirline, airports: [] } as AirlineEntity);
      jest.spyOn(airportRepo, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateAirportsFromAirline('1', ['99']),
      ).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should delete an airport from an airline', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockAirline,
        airports: [mockAirport],
      } as AirlineEntity);
      jest
        .spyOn(service, 'findAirportFromAirline')
        .mockResolvedValue(mockAirport as AirportEntity);
      jest
        .spyOn(airlineRepo, 'save')
        .mockResolvedValue({ ...mockAirline, airports: [] } as AirlineEntity);
      await expect(
        service.deleteAirportFromAirline('1', '10'),
      ).resolves.toBeUndefined();
    });
  });
});
