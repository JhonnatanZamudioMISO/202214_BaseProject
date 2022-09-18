import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] } );
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aeropuerto con la identificación proporcionada", BusinessError.NOT_FOUND);
        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        if(aeropuerto.codigo.length != 3)
            throw new BusinessLogicException("El código del aeropuerto debe tener 3 caracteres", BusinessError.NOT_FOUND);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aeropuertoGuardado: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuertoGuardado)
          throw new BusinessLogicException("No se encontró el aeropuerto con la identificación proporcionada", BusinessError.NOT_FOUND);
        if(aeropuerto.codigo.length != 3)
          throw new BusinessLogicException("El código del aeropuerto debe tener 3 caracteres", BusinessError.NOT_FOUND);
        aeropuerto.id = id;
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aeropuerto con la identificación proporcionada", BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.remove(aeropuerto);
    }
}
