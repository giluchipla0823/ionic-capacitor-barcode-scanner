import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceInformationPage } from './device-information.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceInformationPageRoutingModule {}
