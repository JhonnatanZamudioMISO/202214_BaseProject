import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaService } from './aerolinea.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airlines')
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) {}
}
