import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let listaAeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();
    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
    listaAeropuertos = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.company.name(),
          codigo: faker.lorem.word(3),
          pais: faker.address.country(),
          ciudad: faker.address.city()
        })
        listaAeropuertos.push(aeropuerto);
    }
    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      paginaWeb: faker.internet.url(),
      aeropuertos: listaAeropuertos
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline deberia asociar un aeropuerto a una aerolinea', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word(3),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });

    const nuevaAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      paginaWeb: faker.internet.url()
    })
    const result: AerolineaEntity = await service.addAirportToAirline(nuevaAerolinea.id, nuevoAeropuerto.id);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(nuevoAeropuerto.nombre)
    expect(result.aeropuertos[0].codigo).toBe(nuevoAeropuerto.codigo)
    expect(result.aeropuertos[0].pais).toBe(nuevoAeropuerto.pais)
    expect(result.aeropuertos[0].ciudad).toBe(nuevoAeropuerto.ciudad)
  });

});
