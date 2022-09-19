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

  it('addAirportToAirline deberia mostrar una excepción cuando el aeropuerto no existe', async () => {
    const nuevaAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      paginaWeb: faker.internet.url()
    })
    await expect(() => service.addAirportToAirline(nuevaAerolinea.id, "0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con la identificación proporcionada");
  });

  it('addAirportToAirline deberia mostrar una excepción cuando la aerolinea no existe', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word(3),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
    await expect(() => service.addAirportToAirline("0", nuevoAeropuerto.id)).rejects.toHaveProperty("message", "No se encontró la aerolinea con la identificación proporcionada");
  });

  it('findAirportsFromAirline deberia retornar los aeropuertos de una aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAirportsFromAirline deberia mostrar una excepción cuando la aerolinea no existe', async () => {
    await expect(()=> service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "No se encontró la aerolinea con la identificación proporcionada"); 
  });

  it('findAirportFromAirline deberia retorna el aeropuerto de una aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    const aeropuertoGuardado: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
    expect(aeropuertoGuardado).not.toBeNull();
    expect(aeropuertoGuardado.nombre).toBe(aeropuerto.nombre);
    expect(aeropuertoGuardado.codigo).toBe(aeropuerto.codigo);
    expect(aeropuertoGuardado.pais).toBe(aeropuerto.pais);
    expect(aeropuertoGuardado.ciudad).toBe(aeropuerto.ciudad);
  });

  it('findAirportFromAirline deberia mostrar una excepción cuando el aeropuerto no existe', async () => {
    await expect(()=> service.findAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con la identificación proporcionada"); 
  });

  it('findAirportFromAirline deberia mostrar una excepción cuando la aerolinea no existe', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0]; 
    await expect(()=> service.findAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "No se encontró la aerolinea con la identificación proporcionada"); 
  });

  it('findAirportFromAirline deberia mostrar una excepción cuando un aeropuerto no esta asociado a una aerolinea', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word(3),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
    await expect(()=> service.findAirportFromAirline(aerolinea.id, nuevoAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no está asociada a la aerolinea"); 
  });

});
