import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestServiceDataPageRoutingModule } from './test-service-data-routing.module';

import { TestServiceDataPage } from './test-service-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestServiceDataPageRoutingModule
  ],
  declarations: [TestServiceDataPage]
})
export class TestServiceDataPageModule {}
