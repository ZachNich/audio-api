import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebRtcGateway } from './web-rtc/web-rtc.gateway';
import { WebRtcModule } from './web-rtc/web-rtc.module';

@Module({
  imports: [WebRtcModule],
  controllers: [AppController],
  providers: [AppService, WebRtcGateway],
})
export class AppModule {}
