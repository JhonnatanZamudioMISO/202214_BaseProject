import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
    constructor(@InjectRepository(AerolineaEntity)
            private readonly aerolineaRepository: Repository<AerolineaEntity>  
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND);
        return museum;
    }
}
