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


});
