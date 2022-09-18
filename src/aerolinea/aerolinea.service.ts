import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
    constructor(
            @InjectRepository(AerolineaEntity)
            private readonly aerolineaRepository: Repository<AerolineaEntity>  
        ){}
}
