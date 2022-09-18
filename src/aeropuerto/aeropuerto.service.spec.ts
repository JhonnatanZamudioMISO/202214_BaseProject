import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let listaAeropuertos: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();
    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaAeropuertos = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.lorem.word(3),
        pais: faker.address.country(),
        ciudad: faker.address.city()})
        listaAeropuertos.push(aeropuerto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(listaAeropuertos.length);
  });

  it('findOne deberia retornar un aeropuerto por id', async () => {
    const aeropuertoGuardado: AeropuertoEntity = listaAeropuertos[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(aeropuertoGuardado.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(aeropuertoGuardado.nombre)
    expect(aeropuerto.codigo).toEqual(aeropuertoGuardado.codigo)
    expect(aeropuerto.pais).toEqual(aeropuertoGuardado.pais)
    expect(aeropuerto.ciudad).toEqual(aeropuertoGuardado.ciudad)
  });

  it('findOne deberia mostrar una excepción cuando el id del aeropuerto no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el aeropuerto con la identificación proporcionada")
  });

  it('create deberia retornar un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.lorem.word(3),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: []
    }
    const aeropuertoNuevo: AeropuertoEntity = await service.create(aeropuerto);
    expect(aeropuerto).not.toBeNull();
    const aeropuertoGuardado: AeropuertoEntity = await repository.findOne({where: {id: aeropuertoNuevo.id}})
    expect(aeropuertoGuardado).not.toBeNull();
    expect(aeropuertoGuardado.nombre).toEqual(aeropuertoNuevo.nombre)
    expect(aeropuertoGuardado.codigo).toEqual(aeropuertoNuevo.codigo)
    expect(aeropuertoGuardado.pais).toEqual(aeropuertoNuevo.pais)
    expect(aeropuertoGuardado.ciudad).toEqual(aeropuertoNuevo.ciudad)
  });
});
