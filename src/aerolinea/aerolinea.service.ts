import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
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
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const fechaActual: Date = new Date();
        if(aerolinea.fechaFundacion > fechaActual)
            throw new BusinessLogicException("La fecha de fundación no puede ser superior a la fecha actual", BusinessError.NOT_FOUND);
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaGuardada: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        const fechaActual: Date = new Date();
        if (!aerolineaGuardada)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND);
        if(aerolinea.fechaFundacion > fechaActual)
          throw new BusinessLogicException("La fecha de fundación no puede ser superior a la fecha actual", BusinessError.NOT_FOUND);
        aerolinea.id = id;
        return await this.aerolineaRepository.save(aerolinea);
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolinea);
    }
}
