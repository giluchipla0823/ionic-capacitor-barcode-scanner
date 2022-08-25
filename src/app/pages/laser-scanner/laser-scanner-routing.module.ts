import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaserScannerPage } from './laser-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: LaserScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaserScannerPageRoutingModule {}
