import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebRtcModule } from './web-rtc/web-rtc.module';

@Module({
  imports: [WebRtcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
