import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './aerolinea/aerolinea.module';

@Module({
  imports: [AerolineaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
