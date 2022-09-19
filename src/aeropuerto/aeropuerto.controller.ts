import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoService } from './aeropuerto.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airports')
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) {}

    @Get()
    async findAll() {
        return await this.aeropuertoService.findAll();
    }
}
