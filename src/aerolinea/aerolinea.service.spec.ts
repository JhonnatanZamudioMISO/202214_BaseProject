import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let listaAerolineas: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();
    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaAerolineas = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
        paginaWeb: faker.image.imageUrl()})
        listaAerolineas.push(aerolinea);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todoas las aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(listaAerolineas.length);
  });

  it('findOne deberia retornar una aerolinea por id', async () => {
    const aerolineaGuardada: AerolineaEntity = listaAerolineas[0];
    const aerolinea: AerolineaEntity = await service.findOne(aerolineaGuardada.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(aerolineaGuardada.nombre)
    expect(aerolinea.descripcion).toEqual(aerolineaGuardada.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(aerolineaGuardada.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(aerolineaGuardada.paginaWeb)
  });

  it('findOne deberia mostrar una excepción cuando el id de la aerolinea no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró la aerolinea con la identificación proporcionada")
  });

  it('create deberia retornar una nueva aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechaFundacion: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      paginaWeb: faker.image.imageUrl(),
      aeropuertos: []
    }
    const aerolineaNueva: AerolineaEntity = await service.create(aerolinea);
    expect(aerolinea).not.toBeNull();
    const aerolineaGuardada: AerolineaEntity = await repository.findOne({where: {id: aerolineaNueva.id}})
    expect(aerolineaGuardada).not.toBeNull();
    expect(aerolineaGuardada.nombre).toEqual(aerolineaNueva.nombre)
    expect(aerolineaGuardada.descripcion).toEqual(aerolineaNueva.descripcion)
    expect(aerolineaGuardada.fechaFundacion).toEqual(aerolineaNueva.fechaFundacion)
    expect(aerolineaGuardada.paginaWeb).toEqual(aerolineaNueva.paginaWeb)
  });

  it('create deberia mostrar una excepción cuando la Fecha Fundación es superior a la Fecha actual', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      fechaFundacion: faker.date.between('2099-01-01T00:00:00.000Z', '2100-01-01T00:00:00.000Z'),
      paginaWeb: faker.image.imageUrl(),
      aeropuertos: []
    }
    await expect(() => service.create(aerolinea)).rejects.toHaveProperty("message", "La fecha de fundación no puede ser superior a la fecha actual")
  });

  it('update deberia modificar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = listaAerolineas[0];
    aerolinea.nombre = "Nuevo nombre";
    aerolinea.descripcion = "Nueva descripción";
    const aerolineaActualizada: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(aerolineaActualizada).not.toBeNull();
    const aerolineaGuardada: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(aerolineaGuardada).not.toBeNull();
    expect(aerolineaGuardada.nombre).toEqual(aerolinea.nombre)
    expect(aerolineaGuardada.descripcion).toEqual(aerolinea.descripcion)
  });


});
