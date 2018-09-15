import { ConnectDialogModule } from './connect-dialog.module';

describe('ConnectDialogModule', () => {
  let connectDialogModule: ConnectDialogModule;

  beforeEach(() => {
    connectDialogModule = new ConnectDialogModule();
  });

  it('should create an instance', () => {
    expect(connectDialogModule).toBeTruthy();
  });
});
