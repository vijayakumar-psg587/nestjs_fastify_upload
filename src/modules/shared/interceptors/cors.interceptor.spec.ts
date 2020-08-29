import { CorsInterceptor } from './cors.interceptor';

describe('CorsInterceptor', () => {
  it('should be defined', () => {
    expect(new CorsInterceptor()).toBeDefined();
  });
});
