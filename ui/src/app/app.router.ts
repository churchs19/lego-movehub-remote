import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';

export const router: Routes = [
    {
        path: '',
        component: HomeComponent
    }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(router);
