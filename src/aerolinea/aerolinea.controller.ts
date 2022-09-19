import { Controller } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';

@Controller('airlines')
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) {}
}
