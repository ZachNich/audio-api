import { Test, TestingModule } from '@nestjs/testing';
import { WebRtcGateway } from './web-rtc.gateway';

describe('WebRtcGateway', () => {
  let gateway: WebRtcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebRtcGateway],
    }).compile();

    gateway = module.get<WebRtcGateway>(WebRtcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
