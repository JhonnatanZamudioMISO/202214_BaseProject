import { Controller } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';

@Controller('airports')
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) {}
    
}
