import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';

import { ConnectDialogComponent } from './connect-dialog.component';

@NgModule({
    imports: [MatDialogModule, CommonModule],
    declarations: [ConnectDialogComponent],
    exports: [ConnectDialogComponent],
    entryComponents: [ConnectDialogComponent]
})
export class ConnectDialogModule {}
