import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'laser-scanner',
    loadChildren: () => import('./pages/laser-scanner/laser-scanner.module').then( m => m.LaserScannerPageModule)
  },
  {
    path: 'barcode-scanner',
    loadChildren: () => import('./pages/barcode-scanner/barcode-scanner.module').then( m => m.BarcodeScannerPageModule)
  },
  {
    path: 'device-information',
    loadChildren: () => import('./pages/device-information/device-information.module').then( m => m.DeviceInformationPageModule)
  },
  {
    path: 'test-service-data',
    loadChildren: () => import('./pages/test-service-data/test-service-data.module').then( m => m.TestServiceDataPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
