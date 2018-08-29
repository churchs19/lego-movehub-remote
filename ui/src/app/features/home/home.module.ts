import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { MovehubModule } from '../movehub/movehub.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [MovehubModule, MatToolbarModule, MatButtonModule, CommonModule],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    entryComponents: [HomeComponent]
})
export class HomeModule {}
