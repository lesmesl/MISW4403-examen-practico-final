/* eslint-disable prettier/prettier */
/* archivo: src/airline/airline.entity.ts */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AirportEntity } from '../airport/airport.entity';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'date' })
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @ManyToMany(
    () => AirportEntity,
    airport => airport.airlines,
  )
  @JoinTable({
    name: 'airline_airport',
    joinColumn: { name: 'airline_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'airport_id', referencedColumnName: 'id' },
  })
  airports: AirportEntity[];
}
