import { Module } from '@nestjs/common';
import { WebRtcGateway } from './web-rtc.gateway';

@Module({
  providers: [WebRtcGateway],
})
export class WebRtcModule {}
