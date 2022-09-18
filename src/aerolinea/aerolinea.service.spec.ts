import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let respository: Repository<AerolineaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();
    service = module.get<AerolineaService>(AerolineaService);
    respository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  const seedDatabase = async () => {
    repository.clear();
    listaAerolineas = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.company.companyName(),
        description: faker.lorem.sentence(),
        address: faker.address.secondaryAddress(),
        city: faker.address.city(),
        image: faker.image.imageUrl()})
        museumsList.push(museum);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
