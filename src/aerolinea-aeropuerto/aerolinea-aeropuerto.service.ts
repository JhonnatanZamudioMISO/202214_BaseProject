import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aeropuerto con la identificación proporcionada", BusinessError.NOT_FOUND);
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]})
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND);
        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND)
        return aerolinea.aeropuertos;
    }

    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException("No se encontró el aeropuerto con la identificación proporcionada", BusinessError.NOT_FOUND)
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException("No se encontró la aerolinea con la identificación proporcionada", BusinessError.NOT_FOUND)
        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
        if (!aerolineaAeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id proporcionado no está asociada a la aerolinea.", BusinessError.PRECONDITION_FAILED)
        return aerolineaAeropuerto;
    }

}
