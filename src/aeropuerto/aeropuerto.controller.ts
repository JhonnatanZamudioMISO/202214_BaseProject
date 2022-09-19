import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
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

    @Get(':aeropuertoId')
    async findOne(@Param('aeropuertoId') aeropuertoId: string) {
        return await this.aeropuertoService.findOne(aeropuertoId);
    }
}
