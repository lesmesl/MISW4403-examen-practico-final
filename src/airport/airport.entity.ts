/* eslint-disable prettier/prettier */
/* archivo: src/airport/airport.entity.ts */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(
    () => AirlineEntity,
    airline => airline.airports,
  )
  airlines: AirlineEntity[];
}
