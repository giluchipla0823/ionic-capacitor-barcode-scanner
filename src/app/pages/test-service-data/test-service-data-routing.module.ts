import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestServiceDataPage } from './test-service-data.page';

const routes: Routes = [
  {
    path: '',
    component: TestServiceDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestServiceDataPageRoutingModule {}
