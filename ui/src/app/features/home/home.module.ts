import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatMenuModule, MatSliderModule, MatToolbarModule } from '@angular/material';

import { MovehubModule } from '../movehub/movehub.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        MovehubModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSliderModule,
        FlexLayoutModule,
        CommonModule
    ],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    entryComponents: [HomeComponent]
})
export class HomeModule {}
