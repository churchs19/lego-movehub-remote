import { MovehubModule } from './movehub.module';

describe('MovehubModule', () => {
  let movehubModule: MovehubModule;

  beforeEach(() => {
    movehubModule = new MovehubModule();
  });

  it('should create an instance', () => {
    expect(movehubModule).toBeTruthy();
  });
});
